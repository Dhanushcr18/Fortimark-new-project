'use client'

import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, useGLTF } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Box3, Group, MathUtils, Mesh, MeshStandardMaterial, Vector3 } from 'three'

gsap.registerPlugin(ScrollTrigger)

interface FlightState {
  progress: number
  bank: number
  heading: number
}

interface FlightStep {
  label: string
  title: string
  body: string
}

const FLIGHT_POINTS = [
  new Vector3(4.2, 2.1, -3.6),
  new Vector3(2.4, 1.3, -1.8),
  new Vector3(0.8, 0.6, -0.3),
  new Vector3(-1.2, -0.2, 1.4),
  new Vector3(-3.6, -1.1, 3.8),
]

const FLIGHT_STEPS: FlightStep[] = [
  {
    label: '01',
    title: 'Ignition Online',
    body: 'Systems check complete. Entering the controlled flight corridor at stable altitude.',
  },
  {
    label: '02',
    title: 'Urban Routing',
    body: 'Crosswind correction active with smooth bank control for dense city navigation.',
  },
  {
    label: '03',
    title: 'Mid Transit',
    body: 'Glide mode engaged as the flight computer balances lift, speed, and passenger comfort.',
  },
  {
    label: '04',
    title: 'Landing Readiness',
    body: 'Descent vector aligned and heading locked for a clean approach toward the left exit.',
  },
  {
    label: '05',
    title: 'Mission Complete',
    body: 'Final path completed. Aircraft exits the corridor after full sequence confirmation.',
  },
]

const RIGHT_SIDE_STEPS = new Set([2, 4])

class HelicopterCanvasErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('Helicopter canvas failed, rendering fallback.', error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

function HelicopterModel({
  flightStateRef,
  modelRef,
  onLoaded,
}: {
  flightStateRef: React.MutableRefObject<FlightState>
  modelRef: React.MutableRefObject<Group | null>
  onLoaded: () => void
}) {
  const rootRef = useRef<Group>(null)
  const rotorMeshesRef = useRef<Mesh[]>([])
  const { scene } = useGLTF('/models/helicopter-scroll.glb')

  const model = useMemo(() => {
    const cloned = scene.clone(true)
    cloned.traverse((child) => {
      if (!(child instanceof Mesh)) return
      child.castShadow = false
      child.receiveShadow = false
      if (child.material instanceof MeshStandardMaterial) {
        child.material.metalness = Math.min(child.material.metalness, 0.45)
        child.material.roughness = Math.max(child.material.roughness, 0.55)
        child.material.envMapIntensity = 0.6
      }
    })
    return cloned
  }, [scene])

  useEffect(() => {
    if (!rootRef.current) return

    const box = new Box3().setFromObject(model)
    const center = box.getCenter(new Vector3())
    const size = box.getSize(new Vector3())
    const maxDimension = Math.max(size.x, size.y, size.z, 0.001)
    const scale = 2.6 / maxDimension

    model.position.sub(center)
    model.scale.setScalar(scale)
    model.position.y += size.y * scale * 0.1

    const rotorMeshes: Mesh[] = []
    model.traverse((child) => {
      if (child instanceof Mesh && child.name.toLowerCase().includes('rotor')) {
        rotorMeshes.push(child)
      }
    })
    rotorMeshesRef.current = rotorMeshes

    rootRef.current.add(model)
    modelRef.current = rootRef.current
    onLoaded()

    return () => {
      rotorMeshesRef.current = []
      modelRef.current = null
      rootRef.current?.remove(model)
    }
  }, [model, modelRef, onLoaded])

  useFrame((state) => {
    const root = rootRef.current
    if (!root) return

    const elapsed = state.clock.getElapsedTime()
    const { progress, bank, heading } = flightStateRef.current

    root.rotation.z = MathUtils.lerp(root.rotation.z, bank, 0.1)
    root.rotation.x = MathUtils.lerp(root.rotation.x, Math.sin(elapsed * 0.9) * 0.08, 0.08)
    root.rotation.y = MathUtils.lerp(root.rotation.y, heading, 0.12)

    rotorMeshesRef.current.forEach((mesh) => {
      mesh.rotation.y += 0.72
    })
  })

  return <group ref={rootRef} />
}

export function HelicopterScrollSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinnedRef = useRef<HTMLDivElement>(null)
  const modelRef = useRef<Group | null>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const activeIndexRef = useRef(0)
  const flightStateRef = useRef<FlightState>({ progress: 0, bank: 0, heading: 0 })

  const [loaded, setLoaded] = useState(false)
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const canRender3D = useMemo(() => {
    if (typeof window === 'undefined') return false
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      return !!gl
    } catch {
      return false
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const pinned = pinnedRef.current
    if (!section || !pinned) return

    if (modelRef.current) {
      modelRef.current.position.copy(FLIGHT_POINTS[0])
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=4600',
      scrub: 0.9,
      pin: pinned,
      pinSpacing: true,
      invalidateOnRefresh: true,
      onUpdate: ({ progress }) => {
        flightStateRef.current.progress = progress

        const t = progress * (FLIGHT_POINTS.length - 1)
        const i = Math.floor(t)
        const j = Math.min(i + 1, FLIGHT_POINTS.length - 1)
        const localT = t - i

        const current = FLIGHT_POINTS[i].clone().lerp(FLIGHT_POINTS[j], localT)
        const direction = FLIGHT_POINTS[j].clone().sub(FLIGHT_POINTS[i]).normalize()

        if (modelRef.current) {
          modelRef.current.position.copy(current)
        }

        flightStateRef.current.bank = Math.sin(progress * Math.PI) * 0.34
        flightStateRef.current.heading = Math.atan2(direction.x, direction.z)

        const nextIndex = Math.min(
          FLIGHT_STEPS.length - 1,
          Math.floor(progress * FLIGHT_STEPS.length)
        )
        if (nextIndex !== activeIndexRef.current) {
          activeIndexRef.current = nextIndex
          gsap.to(textRef.current, {
            opacity: 0,
            y: 8,
            duration: 0.16,
            onComplete: () => {
              setActiveStepIndex(nextIndex)
              gsap.to(textRef.current, { opacity: 1, y: 0, duration: 0.2 })
            },
          })
        }
      },
    })

    return () => {
      trigger.kill()
    }
  }, [])

  useEffect(() => {
    if (!loaded || !modelRef.current) return
    modelRef.current.position.copy(FLIGHT_POINTS[0])
  }, [loaded])

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-[#03060d]">
      <div ref={pinnedRef} className="h-screen w-full overflow-hidden">
        {canRender3D ? (
          <HelicopterCanvasErrorBoundary
            fallback={<div className="h-full w-full bg-[#03060d]" />}
          >
            <Canvas
              dpr={[1, 1]}
              gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
              className="h-full w-full"
              onCreated={({ gl }) => {
                gl.setPixelRatio(1)
                gl.setClearColor(0x03060d, 1)
              }}
            >
              <PerspectiveCamera makeDefault position={[0, 0.35, 8.2]} fov={37} />
              <fog attach="fog" args={['#03060d', 7, 26]} />

              <ambientLight intensity={0.72} color="#dde7ff" />
              <directionalLight position={[6, 7, 5]} intensity={1.2} color="#f1f4ff" />
              <pointLight position={[-6, 1.5, 7]} intensity={4.5} distance={18} color="#58a9ff" />

              <mesh position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[22, 22]} />
                <meshBasicMaterial color="#07101e" transparent opacity={0.78} />
              </mesh>

              <Suspense fallback={null}>
                <HelicopterModel
                  flightStateRef={flightStateRef}
                  modelRef={modelRef}
                  onLoaded={() => setLoaded(true)}
                />
              </Suspense>
            </Canvas>
          </HelicopterCanvasErrorBoundary>
        ) : (
          <div className="h-full w-full bg-[#03060d]" />
        )}

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_28%,rgba(2,6,13,0.3)_68%,rgba(2,6,13,0.86)_100%)]" />

        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-8 md:p-12">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.55em] text-[#8fc4ff]/75">3D Flight Sequence</p>
            <h2 className="mt-5 text-5xl font-semibold uppercase tracking-[0.18em] text-white md:text-7xl">
              Helicopter
            </h2>
          </div>

          <div
            className={`flex ${RIGHT_SIDE_STEPS.has(activeStepIndex) ? 'justify-end' : 'justify-start'}`}
          >
            <div
              ref={textRef}
              className="w-full max-w-xl rounded-[1.65rem] border border-white/14 bg-black/35 p-6 backdrop-blur-md md:p-8"
            >
              <p className="mb-6 text-[0.68rem] uppercase tracking-[0.75em] text-white/42">
                Worldwide Access
              </p>
              <div className="border-l border-white/18 pl-5">
                <p className="mb-2 text-[0.66rem] uppercase tracking-[0.62em] text-white/38">
                  {FLIGHT_STEPS[activeStepIndex].label}
                </p>
                <h3 className="text-2xl font-semibold uppercase tracking-[0.08em] text-white md:text-3xl">
                  {FLIGHT_STEPS[activeStepIndex].title}
                </h3>
                <p className="mt-3 text-sm leading-7 tracking-[0.12em] text-white/66 md:text-base">
                  {FLIGHT_STEPS[activeStepIndex].body}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-5">
            <p className="text-[10px] uppercase tracking-[0.45em] text-white/34">
              Altitude {Math.round((1 - flightStateRef.current.progress) * 1000)}m
            </p>
            <p className="text-[10px] uppercase tracking-[0.45em] text-white/34">
              {(flightStateRef.current.progress * 100).toFixed(0)}% complete
            </p>
          </div>
        </div>

        {!loaded ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#02040a]">
            <span className="animate-pulse text-sm uppercase tracking-[0.45em] text-white/70">
              Initializing
            </span>
          </div>
        ) : null}
      </div>
    </section>
  )
}

useGLTF.preload('/models/helicopter-scroll.glb')
