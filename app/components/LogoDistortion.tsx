import gsap from "gsap";
import styles from "./LogoDistortion.module.scss";
import { Renderer, Program, Texture, Mesh, Vec2, Vec4, Geometry, Flowmap } from "ogl";
import { useEffect, useRef } from "react";
import Logo from "@/images/logo.svg";

const vertex = `
    attribute vec2 uv;
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
    }
`;

const fragment = `
    precision highp float;
    precision highp int;
    uniform sampler2D tWater;
    uniform sampler2D tFlow;
    uniform float uTime;
    uniform float uDeformationSize;
    varying vec2 vUv;
    uniform vec4 res;

    void main() {
        // R and G values are velocity in the x and y direction
        // B value is the velocity length
        vec3 flow = texture2D(tFlow, vUv).rgb;

        vec2 uv = .5 * gl_FragCoord.xy / res.xy ;
        vec2 myUV = (uv - vec2(0.5))*res.zw + vec2(0.5);
        // myUV -= flow.xy * (0.15 * 0.7);
        myUV -= flow.xy * uDeformationSize;

        vec3 tex = texture2D(tWater, myUV).rgb;

        gl_FragColor = vec4(tex.r, tex.g, tex.b, 1.0);
    }
`;

interface MyVec2 extends Vec2 {
  needsUpdate?: boolean;
}

const LogoDistortion = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Set up OGL canvas
  useEffect(() => {
    const falloff = 0.5;
    const dissipation = 0.9;
    const deformationSize = 0.2;
    const imgSize = [1218, 424];
    const imageAspect = imgSize[1] / imgSize[0];

    const div = divRef.current;
    const canvas = canvasRef.current;
    if (!div || !canvas) {
      return;
    }

    const renderer = new Renderer({
      canvas,
      dpr: 2,
      alpha: true,
      premultipliedAlpha: false,
    });
    const gl = renderer.gl;

    // Variable inputs to control flowmap
    let aspect = 1;
    const mouse = new Vec2(-1);
    const velocity = new Vec2() as MyVec2;

    const resize = () => {
      let a1, a2;

      if (div.clientHeight / div.clientWidth < imageAspect) {
        a1 = 1;
        a2 = div.clientHeight / div.clientWidth / imageAspect;
      } else {
        a1 = (div.clientWidth / div.clientHeight) * imageAspect;
        a2 = 1;
      }

      mesh.program.uniforms.res.value = new Vec4(div.clientWidth, div.clientHeight, a1, a2);
      renderer.setSize(div.clientWidth, div.clientHeight);
      aspect = div.clientWidth / div.clientHeight;
    };

    const flowmap = new Flowmap(gl, { falloff, dissipation });

    // Triangle that includes -1 to 1 range for 'position', and 0 to 1 range for 'uv'.
    const geometry = new Geometry(gl, {
      position: {
        size: 2,
        data: new Float32Array([-1, -1, 3, -1, -1, 3]),
      },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });

    const texture = new Texture(gl, {
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
    });

    const img = new Image();
    img.onload = () => {
      gsap.to(divRef.current, {
        opacity: 1,
        duration: 1,
      });
      texture.image = img;
    };
    img.crossOrigin = "Anonymous";
    img.src = Logo.src;

    let a1, a2;
    if (div.clientHeight / div.clientWidth < imageAspect) {
      a1 = 1;
      a2 = div.clientHeight / div.clientWidth / imageAspect;
    } else {
      a1 = (div.clientWidth / div.clientHeight) * imageAspect;
      a2 = 1;
    }

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        tWater: { value: texture },
        res: {
          value: new Vec4(canvas.clientWidth, canvas.clientHeight, a1, a2),
        },
        img: { value: new Vec2(imgSize[0], imgSize[1]) },
        // Note that the uniform is applied without using an object and value property
        // This is because the class alternates this texture between two render targets
        // and updates the value property after each render.
        tFlow: flowmap.uniform,
        uDeformationSize: { value: deformationSize },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    window.addEventListener("resize", resize, false);
    resize();

    let lastTime: number;
    const lastMouse = new Vec2();

    const updateMouse = (x: number, y: number) => {
      // Get mouse value in 0 to 1 range, with y flipped
      mouse.set(x / gl.renderer.width, 1.0 - y / gl.renderer.height);

      // Calculate velocity
      if (!lastTime) {
        // First frame
        lastTime = performance.now();
        lastMouse.set(x, y);
      }

      const deltaX = x - lastMouse.x;
      const deltaY = y - lastMouse.y;

      lastMouse.set(x, y);

      const time = performance.now();

      // Avoid dividing by 0
      const delta = Math.max(10.4, time - lastTime);
      lastTime = time;
      velocity.x = deltaX / delta;
      velocity.y = deltaY / delta;

      // Flag update to prevent hanging velocity values when not moving
      velocity.needsUpdate = true;
    };

    const update = (t: number) => {
      requestAnimationFrame(update);

      // Reset velocity when mouse not moving
      if (!velocity.needsUpdate) {
        mouse.set(-1);
        velocity.set(0);
      }
      velocity.needsUpdate = false;

      // Update flowmap inputs
      flowmap.aspect = aspect;
      flowmap.mouse.copy(mouse);

      // Ease velocity input, slower when fading out
      flowmap.velocity.lerp(velocity, velocity.len() ? 0.2 : 0.1);
      flowmap.update();
      program.uniforms.uTime.value = t * 0.01;
      renderer.render({ scene: mesh });
    };

    requestAnimationFrame(update);

    const mouseMoveHandler = (e: MouseEvent) => {
      updateMouse(e.offsetX, e.offsetY);
    };

    div.addEventListener("mousemove", mouseMoveHandler, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      div.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  return (
    <div ref={divRef} className={styles.div}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
};

export default LogoDistortion;
