"use client"

import gsap from "gsap"
import { Renderer, Program, Texture, Mesh, Vec2, Vec4, Geometry, Flowmap } from "ogl"
import { useEffect, useRef } from "react"
import Logo from "@/images/logo-background.svg"

const vertex = `
    attribute vec2 uv;
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
    }
`

const fragment = `
    precision highp float;
    precision highp int;
    uniform sampler2D tWater;
    uniform sampler2D tFlow;
    uniform float uTime;
    uniform float uDeformationSize;
    varying vec2 vUv;
    uniform vec4 res;

    uniform float uScroll;
    uniform vec2 uTile;
    uniform float uPadding;
    uniform float uGap;

    void main() {
        // R and G values are velocity in the x and y direction
        // B value is the velocity length
        vec3 flow = texture2D(tFlow, vUv).rgb;

        // Work in canvas-width units so padding is even on every side.
        // x: 0..1 across the canvas. y: 0..(H/W), same physical unit as x.
        float xw = gl_FragCoord.x / res.x;
        float yw = gl_FragCoord.y / res.x;

        float tileAspect = uTile.y / uTile.x;
        float logoW = 1.0 - 2.0 * uPadding;   // logo width (side margins of uPadding)
        float logoH = logoW * tileAspect;     // logo height (keeps aspect)
        float cellH = logoH + uGap;           // vertical repeat period

        // Wrap into one cell, scrolling by whole cells for a seamless loop.
        float v = mod(yw + uScroll * cellH, cellH);

        // uGap is split top/bottom so the gap between stacked logos equals uGap.
        vec2 myUV = vec2((xw - uPadding) / logoW, (v - 0.5 * uGap) / logoH);

        myUV -= flow.xy * uDeformationSize;

        // Transparent outside the logo box (the padding margin).
        float inside = step(0.0, myUV.x) * step(myUV.x, 1.0) * step(0.0, myUV.y) * step(myUV.y, 1.0);

        vec4 tex = texture2D(tWater, myUV);

        gl_FragColor = vec4(tex.rgb, tex.a) * inside;
    }
`

interface MyVec2 extends Vec2 {
  needsUpdate?: boolean
}

const LogoDistortion = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Set up OGL canvas
  useEffect(() => {
    const falloff = 1
    const dissipation = 0.95
    const deformationSize = 0.025
    // Dimensions of one seamlessly-tiling logo tile (logo-background.svg)
    const tileSize = [2560, 891.511]
    // Scroll: tile periods per second, and direction (+1 / -1)
    const scrollSpeed = -1 / 15
    const scrollDirection = 1
    // Horizontal side margin around the logo, in fractions of the canvas width (0 = full bleed)
    const padding = 0.04
    // Vertical space between stacked logos, in fractions of the canvas width
    const gap = 0.05
    const canvas = canvasRef.current

    if (!canvas) return

    const renderer = new Renderer({
      canvas,
      dpr: 2,
      alpha: true,
      premultipliedAlpha: false,
    })
    const gl = renderer.gl

    // Variable inputs to control flowmap
    let aspect = 1
    const mouse = new Vec2(-1)
    const velocity = new Vec2() as MyVec2

    const resize = () => {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight)
      // gl_FragCoord is in framebuffer pixels (canvas size × dpr), so res must match.
      mesh.program.uniforms.res.value = new Vec4(gl.drawingBufferWidth, gl.drawingBufferHeight, 0, 0)
      aspect = canvas.clientWidth / canvas.clientHeight
    }

    const flowmap = new Flowmap(gl, { falloff, dissipation })

    // Triangle that includes -1 to 1 range for 'position', and 0 to 1 range for 'uv'.
    const geometry = new Geometry(gl, {
      position: {
        size: 2,
        data: new Float32Array([-1, -1, 3, -1, -1, 3]),
      },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    })

    const texture = new Texture(gl, {
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      // mod() in the shader handles the seamless wrap; clamp both axes so edge
      // texels don't bleed across the padding mask.
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
    })

    const img = new Image()
    img.onload = () => {
      texture.image = img
    }
    img.crossOrigin = "Anonymous"
    img.src = Logo.src

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        tWater: { value: texture },
        res: {
          value: new Vec4(canvas.clientWidth, canvas.clientHeight, 0, 0),
        },
        uScroll: { value: 0 },
        uTile: { value: new Vec2(tileSize[0], tileSize[1]) },
        uPadding: { value: padding },
        uGap: { value: gap },
        // Note that the uniform is applied without using an object and value property
        // This is because the class alternates this texture between two render targets
        // and updates the value property after each render.
        tFlow: flowmap.uniform,
        uDeformationSize: { value: deformationSize },
      },
    })
    const mesh = new Mesh(gl, { geometry, program })

    window.addEventListener("resize", resize, false)
    resize()

    let lastTime: number
    const lastMouse = new Vec2()

    const updateMouse = (x: number, y: number) => {
      // Get mouse value in 0 to 1 range, with y flipped
      mouse.set(x / gl.renderer.width, 1.0 - y / gl.renderer.height)

      // Calculate velocity
      if (!lastTime) {
        // First frame
        lastTime = performance.now()
        lastMouse.set(x, y)
      }

      const deltaX = x - lastMouse.x
      const deltaY = y - lastMouse.y

      lastMouse.set(x, y)

      const time = performance.now()

      // Avoid dividing by 0
      const delta = Math.max(10.4, time - lastTime)
      lastTime = time
      velocity.x = deltaX / delta
      velocity.y = deltaY / delta

      // Flag update to prevent hanging velocity values when not moving
      velocity.needsUpdate = true
    }

    const update = (t: number) => {
      requestAnimationFrame(update)

      // Reset velocity when mouse not moving
      if (!velocity.needsUpdate) {
        mouse.set(-1)
        velocity.set(0)
      }
      velocity.needsUpdate = false

      // Update flowmap inputs
      flowmap.aspect = aspect
      flowmap.mouse.copy(mouse)

      // Ease velocity input, slower when fading out
      flowmap.velocity.lerp(velocity, velocity.len() ? 0.2 : 0.1)
      flowmap.update()
      program.uniforms.uTime.value = t * 0.01
      // Advance the seamless scroll: tile periods per second (t is ms).
      program.uniforms.uScroll.value = t * 0.001 * scrollSpeed * scrollDirection
      renderer.render({ scene: mesh })
    }

    requestAnimationFrame(update)

    const mouseMoveHandler = (e: MouseEvent) => {
      updateMouse(e.offsetX, e.offsetY)
    }

    canvas.addEventListener("mousemove", mouseMoveHandler, { passive: true })

    return () => {
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("mousemove", mouseMoveHandler)
    }
  }, [])

  return <canvas ref={canvasRef} className="size-full! absolute left-0 top-0" />
}

export default LogoDistortion
