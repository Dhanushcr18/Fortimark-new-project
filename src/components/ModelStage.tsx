'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, PerspectiveCamera, useGLTF } from '@react-three/drei'
import { Box3, Group, MathUtils, Mesh, MeshStandardMaterial, Vector3 } from 'three'

interface DragState {
  isDragging: boolean
  currentY: number
  dragDelta: number
}

function JeskoModel({ dragState }: { dragState: React.MutableRefObject<DragState> }) {
  const groupRef = useRef<Group>(null)
  const baseYRef = useRef(0)
  const { scene } = useGLTF('/models/jesko-hero.glb')
  const model = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    // Build bounds from renderable meshes only so helper nodes don't skew fit.
    model.updateMatrixWorld(true)
    let meshBounds: Box3 | null = null

    model.traverse((child) => {
      if (!(child instanceof Mesh) || !child.geometry) return
      child.geometry.computeBoundingBox()
      const localBox = child.geometry.boundingBox
      if (!localBox) return

      const meshBox = localBox.clone().applyMatrix4(child.matrixWorld)
      meshBounds = meshBounds ? meshBounds.union(meshBox) : meshBox
    })

    const box = meshBounds ?? new Box3().setFromObject(model)
    const center = box.getCenter(new Vector3())
    const size = box.getSize(new Vector3())

    // Smaller model with adjusted fit targets.
    const fitWidth = 5.0 / Math.max(size.x, 0.001)
    const fitHeight = 2.8 / Math.max(size.y, 0.001)
    const fitDepth = 3.0 / Math.max(size.z, 0.001)
    const scale = Math.min(fitWidth, fitHeight, fitDepth) * 0.85

    model.position.sub(center)
    model.scale.setScalar(scale)
    // Move model up by reducing downward offset and adding upward offset.
    model.position.y += size.y * scale * 0.2
    baseYRef.current = model.position.y

    model.traverse((child) => {
      if (!(child instanceof Mesh)) return
      child.castShadow = true
      child.receiveShadow = true

      const material = child.material
      if (material instanceof MeshStandardMaterial) {
        material.metalness = Math.max(material.metalness, 0.85)
        material.roughness = Math.min(material.roughness, 0.32)
        material.envMapIntensity = 1.7
        material.color.multiplyScalar(0.94)
      }
    })
  }, [model])

  useFrame((state) => {
    const group = groupRef.current
    if (!group) return

    const elapsed = state.clock.getElapsedTime()
    // Mouse-drag-driven rotation
    const targetRotationY = dragState.current.dragDelta + elapsed * 0.04
    // Gentle vertical drift
    const targetPositionY = baseYRef.current + Math.sin(elapsed * 0.6) * 0.1

    group.rotation.y = MathUtils.lerp(group.rotation.y, targetRotationY, 0.08)
    group.position.y = MathUtils.lerp(group.position.y, targetPositionY, 0.06)
  })

  return <primitive ref={groupRef} object={model} />
}

export function ModelStage() {
  const dragStateRef = useRef<DragState>({
    isDragging: false,
    currentY: 0,
    dragDelta: 0,
  })
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { // Left mouse button only
        dragStateRef.current.isDragging = true
        dragStateRef.current.currentY = e.clientY
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (dragStateRef.current.isDragging) {
        const delta = e.clientY - dragStateRef.current.currentY
        dragStateRef.current.dragDelta += delta * 0.005 // Sensitivity
        dragStateRef.current.currentY = e.clientY
      }
    }

    const handleMouseUp = () => {
      dragStateRef.current.isDragging = false
    }

    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener('mousedown', handleMouseDown)
      canvas.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)

      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown)
        canvas.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [])

  return (
    <div ref={canvasRef} style={{ width: '100%', height: '100%' }}>
      <Canvas
        shadows
        camera={{ position: [0, 0.12, 4.2], fov: 38 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0.12, 4.2]} fov={38} />

        <ambientLight intensity={0.9} color="#d8e1f5" />

        <directionalLight
          position={[4, 5, 2]}
          intensity={2.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Blue accent light */}
        <pointLight position={[-4, 2, 3]} intensity={30} distance={16} color="#62d0ff" />

        {/* Purple accent light */}
        <pointLight position={[3.5, -0.8, -2]} intensity={18} distance={12} color="#9d7bff" />

        {/* Rim light */}
        <spotLight
          position={[0, 7, 2]}
          angle={0.32}
          intensity={28}
          color="#b7e6ff"
          castShadow
        />

        <group>
          <JeskoModel dragState={dragStateRef} />
      </group>

        <ContactShadows position={[0, -1.55, 0]} scale={8.8} opacity={0.45} blur={3} />

        <Environment preset="dawn" />
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/jesko-hero.glb')