"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  Renderer,
  Camera,
  Transform,
  Mesh,
  Program,
  Plane,
  Geometry,
  Texture,
  RenderTarget,
  Post,
  Raycast,
  Vec2,
} from "ogl"

import { logos } from "@/lib/logos"
import { getRandom, getRandomInt } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

// --- Grid layout (echoes LogoGrid.tsx) ---
const COLUMNS = 6
const ROWS = 12
const CELL_W = 3.9
const CELL_H = 1.3
const LOGO_WIDTH = 1.3 // base world-unit width of a logo before aspect scaling
const STAR_COUNT = 100

// Scroll-driven Y rotation (degrees), at progress 0 -> 1
const MAX_ROTATION = 0
const MIN_ROTATION = -10

// Bloom: render the glow at a fraction of full resolution so the blur kernel
// spreads much wider in screen space (cheaper + far more visible halo).
const BLOOM_SCALE = 0.25
const BLOOM_ITERATIONS = 3
const BLOOM_THRESHOLD = 0.4
const BLOOM_INTENSITY = 0.6

const GRID_W = COLUMNS * CELL_W
const GRID_H = ROWS * CELL_H

// --- Shaders ---
const logoVertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec3 position;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const logoFragment = /* glsl */ `
  precision highp float;
  uniform sampler2D tMap;
  varying vec2 vUv;
  void main() {
    vec4 tex = texture2D(tMap, vUv);
    if (tex.a < 0.01) discard;
    gl_FragColor = tex;
  }
`

const starVertex = /* glsl */ `
  attribute vec3 position;
  attribute float size;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uPixelRatio;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = size * uPixelRatio * (60.0 / -mvPosition.z);
  }
`

const starFragment = /* glsl */ `
  precision highp float;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, d);
    gl_FragColor = vec4(vec3(1.0), alpha);
  }
`

const brightFragment = /* glsl */ `
  precision highp float;
  uniform sampler2D tMap;
  uniform float uThreshold;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D(tMap, vUv);
    float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
    float f = smoothstep(uThreshold, uThreshold + 0.25, l);
    gl_FragColor = vec4(c.rgb * f, 1.0);
  }
`

const blurFragment = /* glsl */ `
  precision highp float;
  uniform sampler2D tMap;
  uniform vec2 uDirection;
  uniform vec2 uResolution;
  varying vec2 vUv;
  void main() {
    vec2 px = uDirection / uResolution;
    vec4 sum = texture2D(tMap, vUv) * 0.227027;
    sum += texture2D(tMap, vUv + px * 1.384615) * 0.316216;
    sum += texture2D(tMap, vUv - px * 1.384615) * 0.316216;
    sum += texture2D(tMap, vUv + px * 3.230769) * 0.070270;
    sum += texture2D(tMap, vUv - px * 3.230769) * 0.070270;
    gl_FragColor = sum;
  }
`

const compositeVertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const compositeFragment = /* glsl */ `
  precision highp float;
  uniform sampler2D tScene;
  uniform sampler2D tBloom;
  uniform float uIntensity;
  varying vec2 vUv;
  void main() {
    vec3 scene = texture2D(tScene, vUv).rgb;
    vec3 bloom = texture2D(tBloom, vUv).rgb;
    gl_FragColor = vec4(scene + bloom * uIntensity, 1.0);
  }
`

// Rasterize an SVG (by URL) onto a canvas for crisp WebGL sampling.
function rasterizeLogo(src: string): Promise<{ canvas: HTMLCanvasElement; aspect: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "Anonymous"
    img.onload = () => {
      const aspect = img.naturalWidth / img.naturalHeight || 2
      const width = 1024
      const height = Math.round(width / aspect)
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("no 2d context"))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      resolve({ canvas, aspect })
    }
    img.onerror = reject
    img.src = src
  })
}

export const LogoGrid3D = () => {
  const maskRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = maskRef.current
    if (!canvas || !wrapper) return

    let cancelled = false
    let raf = 0
    const disposers: Array<() => void> = []

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const renderer = new Renderer({ canvas, dpr, alpha: true, premultipliedAlpha: false })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 1)

    const camera = new Camera(gl, { fov: 45, near: 0.1, far: 300 })
    camera.position.z = 14

    const scene = new Transform()
    const grid = new Transform()
    grid.setParent(scene)

    // Render target for the raw scene + bloom post pipeline
    const sceneTarget = new RenderTarget(gl)
    const post = new Post(gl, { targetOnly: true, dpr: dpr * BLOOM_SCALE })
    post.addPass({ fragment: brightFragment, uniforms: { uThreshold: { value: BLOOM_THRESHOLD } } })
    const blurResolution = new Vec2()
    for (let i = 0; i < BLOOM_ITERATIONS; i++) {
      post.addPass({
        fragment: blurFragment,
        uniforms: { uDirection: { value: new Vec2(1, 0) }, uResolution: { value: blurResolution } },
      })
      post.addPass({
        fragment: blurFragment,
        uniforms: { uDirection: { value: new Vec2(0, 1) }, uResolution: { value: blurResolution } },
      })
    }

    const compositeProgram = new Program(gl, {
      vertex: compositeVertex,
      fragment: compositeFragment,
      uniforms: {
        tScene: { value: sceneTarget.texture },
        // Bloom texture is produced by `post` and assigned per-frame in the render loop.
        tBloom: { value: null },
        uIntensity: { value: BLOOM_INTENSITY },
      },
    })
    const compositeGeometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    })
    const compositeMesh = new Mesh(gl, { geometry: compositeGeometry, program: compositeProgram })

    const raycast = new Raycast()
    const mouseNdc = new Vec2()
    const linkMeshes: Mesh[] = []
    let hoveredLink: string | null = null

    const resize = () => {
      const w = wrapper.clientWidth
      const h = wrapper.clientHeight
      renderer.setSize(w, h)
      camera.perspective({ aspect: w / h })
      sceneTarget.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight)
      post.resize()
      // Blur steps are relative to the (reduced-resolution) bloom buffer.
      blurResolution.set(post.resolutionWidth, post.resolutionHeight)
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseNdc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -(((e.clientY - rect.top) / rect.height) * 2 - 1))
      raycast.castMouse(camera, mouseNdc)
      const hits = raycast.intersectMeshes(linkMeshes)
      if (hits.length) {
        hoveredLink = (hits[0] as Mesh & { link?: string }).link ?? null
        canvas.style.cursor = "pointer"
      } else {
        hoveredLink = null
        canvas.style.cursor = ""
      }
    }

    const onClick = () => {
      if (hoveredLink) router.push(hoveredLink)
    }

    const setup = async () => {
      const rasterized = await Promise.all(logos.map((l) => rasterizeLogo(l.logo.src)))
      if (cancelled) return

      const textures = rasterized.map(({ canvas: c }) => {
        const tex = new Texture(gl, {
          image: c,
          generateMipmaps: true,
          minFilter: gl.LINEAR_MIPMAP_LINEAR,
          magFilter: gl.LINEAR,
        })
        tex.anisotropy = 8
        return tex
      })

      // Shuffle client-side, mirroring the CSS version
      const order = [...logos.keys()].sort(() => 0.5 - Math.random())

      const planeGeometry = new Plane(gl)

      for (let i = 0; i < COLUMNS * ROWS; i++) {
        const entry = logos[order[i % order.length]]
        const texIndex = order[i % order.length]
        const aspect = rasterized[texIndex].aspect

        const column = i % COLUMNS
        const row = Math.floor(i / COLUMNS)

        const program = new Program(gl, {
          vertex: logoVertex,
          fragment: logoFragment,
          uniforms: { tMap: { value: textures[texIndex] } },
          transparent: true,
          depthTest: true,
          depthWrite: false,
        })

        const mesh = new Mesh(gl, { geometry: planeGeometry, program }) as Mesh & { link?: string }
        mesh.scale.set(LOGO_WIDTH, LOGO_WIDTH / aspect, 1)
        mesh.position.set(
          column * CELL_W + (row % 2) * (CELL_W / 2) - GRID_W / 2,
          GRID_H / 2 - row * CELL_H,
          getRandom(0, 3),
        )
        mesh.setParent(grid)

        if (entry.link) {
          mesh.link = entry.link
          linkMeshes.push(mesh)
        }
      }

      // Star field
      const starPos = new Float32Array(STAR_COUNT * 3)
      const starSize = new Float32Array(STAR_COUNT)
      for (let i = 0; i < STAR_COUNT; i++) {
        starPos[i * 3 + 0] = getRandom(-GRID_W * 2, GRID_W * 2)
        starPos[i * 3 + 1] = getRandom(-GRID_H * 2, GRID_H * 2)
        starPos[i * 3 + 2] = getRandom(-100, 0)
        starSize[i] = getRandomInt(2, 4)
      }
      const starGeometry = new Geometry(gl, {
        position: { size: 3, data: starPos },
        size: { size: 1, data: starSize },
      })
      const starProgram = new Program(gl, {
        vertex: starVertex,
        fragment: starFragment,
        uniforms: { uPixelRatio: { value: dpr } },
        transparent: true,
        depthTest: false,
        depthWrite: false,
      })
      starProgram.setBlendFunc(gl.ONE, gl.ONE, gl.ONE, gl.ONE)
      const stars = new Mesh(gl, { mode: gl.POINTS, geometry: starGeometry, program: starProgram })
      stars.frustumCulled = false
      stars.setParent(grid)

      // Scroll-driven progress (0 -> 1), mirrors LogoGrid timeline.
      // Drive a proxy with an actual tween so `scrub` smooths/lerps the value;
      // a bare ScrollTrigger.onUpdate would report the raw (un-scrubbed) progress.
      const scrubbed = { progress: 0 }
      const tween = gsap.to(scrubbed, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1,
        },
      })
      disposers.push(() => {
        tween.scrollTrigger?.kill()
        tween.kill()
      })

      const update = () => {
        raf = requestAnimationFrame(update)
        const p = scrubbed.progress

        grid.position.x = GRID_W * 0.2 - GRID_W * 0.4 * p
        grid.position.y = -GRID_H * 0.2 + GRID_H * 0.4 * p
        grid.rotation.y = (MAX_ROTATION + (MIN_ROTATION - MAX_ROTATION) * p) * (Math.PI / 180)

        // Render scene -> target, run bloom, composite to screen
        renderer.render({ scene, camera, target: sceneTarget, frustumCull: false })
        post.render({ texture: sceneTarget.texture })
        compositeProgram.uniforms.tBloom.value = post.uniform.value
        renderer.render({ scene: compositeMesh })
      }

      window.addEventListener("resize", resize)
      canvas.addEventListener("pointermove", onPointerMove, { passive: true })
      canvas.addEventListener("click", onClick)
      disposers.push(() => window.removeEventListener("resize", resize))
      disposers.push(() => canvas.removeEventListener("pointermove", onPointerMove))
      disposers.push(() => canvas.removeEventListener("click", onClick))

      resize()
      raf = requestAnimationFrame(update)
    }

    setup()

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      disposers.forEach((d) => d())
    }
  }, [router])

  return (
    <section className="bg-black">
      <div
        ref={maskRef}
        className="perspective-[100vw] mask-[linear-gradient(to_bottom,transparent_0px,black_300px,black_100%)] relative aspect-[1] w-full overflow-hidden lg:aspect-[1.5]"
      >
        <canvas ref={canvasRef} className="absolute left-0 top-0 size-full" />
      </div>
    </section>
  )
}
