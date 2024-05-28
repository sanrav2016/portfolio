import React, { useState, useMemo, useRef, Suspense } from 'react'
import * as THREE from "three"
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useFBO } from "@react-three/drei";
import vert from './shaders/vertex.glsl'
import frag from './shaders/fragment.glsl'

const Wave = () => {
  const ref = useRef();

  const [mousePos, setMouse] = useState({ x: 0, y: 0 })
  const [prevTexture, setPrevTexture] = useState(null)
  const [currentTexture, setCurrentTexture] = useState(null)

  const FBOscene = useMemo(() => {
    const FBOscene = new THREE.Scene()
    return FBOscene
  })

  const renderTarget = useFBO()

  useFrame(({ gl, scene, camera, clock }) => {
    gl.setRenderTarget(renderTarget)
    gl.render(scene, camera)
    setPrevTexture(currentTexture)
    setCurrentTexture(renderTarget.texture)
    gl.setRenderTarget(null)
    ref.current.uniforms.uTime.value = clock.getElapsedTime()
  })

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        mouse: { value: { x: mousePos.x, y: mousePos.y } },
        prev: { value: prevTexture },
        current: { value: currentTexture }
      },
      vertexShader: vert,
      fragmentShader: frag
    }), [mousePos, prevTexture, currentTexture]
  )

  const act = (e) => {
    setMouse(e.uv)
  }

  return <mesh onPointerMove={act}>
    <planeGeometry args={[0.5, 0.5, 16, 16]} />
    <shaderMaterial ref={ref} args={[shaderArgs]} />
    <PerspectiveCamera position={[1, 0, 1]} makeDefault />
    <OrbitControls />
  </mesh>
}

const Scene = () => {
  return (
    <Canvas style={{ height: "100vh", width: "100vw" }}>
      <pointLight position={[2, 2, 2]} intensity={5} />
      <Suspense>
        <Wave />
      </Suspense>
    </Canvas>
  )
}

export default Scene