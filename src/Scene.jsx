import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react'
import * as THREE from "three"
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, shaderMaterial, useFBO } from "@react-three/drei";
import vert from './shaders/vertex.glsl'
import frag from './shaders/fragment.glsl'

const colorMaterial = shaderMaterial({
  uTime: 0,
  mouse: { x: 0, y: 0 },
  mouseMove: false,
  prev: null,
  dark: false
},
  vert,
  frag
)

extend({ ColorMaterial: colorMaterial });

const Wave = ({ darkMode }) => {
  const { gl, size, viewport, camera } = useThree();

  const bufferMaterial = useRef();
  const bufferScene = useMemo(() => new THREE.Scene(), []);
  const initialScene = useMemo(() => new THREE.Scene(), []);

  const meshRef = useRef();

  let rtA = useFBO();
  let rtB = useFBO();

  bufferMaterial.current = new colorMaterial({
    mouse: { x: 0, y: 0 },
    mouseMove: false,
    prev: rtA.texture,
    uTime: 0,
    dark: false
  });

  const plane = new THREE.PlaneGeometry(1, 1);
  const bufferObject = new THREE.Mesh(plane, bufferMaterial.current);
  const backgroundMaterial = new THREE.MeshBasicMaterial();
  const backgroundObject = new THREE.Mesh(plane, backgroundMaterial);

  backgroundObject.scale.set(viewport.width, viewport.height, 1)
  bufferObject.scale.set(viewport.width, viewport.height, 1);
  bufferScene.add(bufferObject);
  initialScene.add(backgroundObject);

  useEffect(() => {
    bufferMaterial.current.uniforms.dark.value = darkMode;
    backgroundMaterial.color = darkMode ? new THREE.Color(0, 0, 0) : new THREE.Color(255, 255, 255);
    gl.setRenderTarget(rtA)
    gl.clear()
    gl.render(initialScene, camera)
    gl.setRenderTarget(null)
  }, [size.width, size.height, darkMode])

  useFrame(({ gl, camera, clock }) => {
    gl.setRenderTarget(rtB)
    gl.clear()
    gl.render(bufferScene, camera)
    gl.setRenderTarget(null)

    const t = rtA;
    rtA = rtB;
    rtB = t;

    meshRef.current.material.map = rtB.texture;
    bufferMaterial.current.uniforms.prev.value = rtA.texture;
    bufferMaterial.current.uniforms.uTime.value = clock.getElapsedTime()
  })

  const getUV = (e) => {
    const b = (Math.max(size.width, size.height) - Math.min(size.width, size.height)) / Math.max(size.width, size.height) / 2
    let cX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
    let cY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY
    let x = cX / Math.max(size.width, size.height);
    let y = 1 - cY / Math.max(size.width, size.height);
    return { b: b, x: x, y: y }
  }

  (function (mouseStopDelay) {
    var timeout;
    document.addEventListener('mousemove', function (e) {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        var event = new CustomEvent("mouseend", {
          detail: {
            clientX: e.clientX,
            clientY: e.clientY
          },
          bubbles: true,
          cancelable: true
        });
        e.target.dispatchEvent(event);
      }, mouseStopDelay);
    });
  }(100));

  const onMouseMove = (e) => {
    bufferMaterial.current.uniforms.mouseMove.value = true;
    let { b, x, y } = getUV(e)
    if (size.width > size.height) y -= b;
    else x += b;
    bufferMaterial.current.uniforms.mouse.value.x = x;
    bufferMaterial.current.uniforms.mouse.value.y = y;
  }

  const onMouseEnd = (e) => {
    bufferMaterial.current.uniforms.mouseMove.value = false;
  }

  document.addEventListener("mousedown", onMouseMove);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("touchstart", onMouseMove);
  document.addEventListener("touchmove", onMouseMove);

  document.addEventListener("mouseend", onMouseEnd)
  document.addEventListener("mouseup", onMouseEnd)
  document.addEventListener("touchend", onMouseEnd)

  return <>
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[Math.max(viewport.width, viewport.height), Math.max(viewport.width, viewport.height)]} />
      <meshBasicMaterial map={rtB.texture} toneMapped={false} />
    </mesh>
  </>
}

const Scene = ({ darkMode }) => {
  return (
    <div className="fixed w-screen h-screen top-0 left-0 object-cover select-none">
      <div className="absolute top-0 left-0 w-full h-full bg-transparent" />
      <Canvas onContextMenu={(e) => e.preventDefault()}>
        <Wave darkMode={darkMode} />
      </Canvas>
    </div>
  )
}

export default Scene