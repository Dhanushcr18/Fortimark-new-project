'use client'

import { useMemo, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useImagePreloader } from '@/hooks/useImagePreloader'
import { useScrollDraw } from '@/hooks/useScrollDraw'

const FRAME_COUNT = 246

type MovementStep = {
  label: string
  title: string
  body: string
  range: number[]
}

const MOVEMENT_STEPS: MovementStep[] = [
  {
    label: '01',
    title: 'Vertical Lift',
    body: 'A stable multi-rotor ascent profile keeps the aircraft composed through takeoff while preserving a quiet passenger experience.',
    range: [0.02, 0.18, 0.24, 0.31],
  },
  {
    label: '02',
    title: 'Forward Transition',
    body: 'The airframe shifts from lift into directional travel with balanced thrust distribution across the span.',
    range: [0.25, 0.38, 0.47, 0.57],
  },
  {
    label: '03',
    title: 'Cabin Perspective',
    body: 'A wide-glass cabin and elevated sightlines turn the aircraft from transport into a cinematic passenger environment.',
    range: [0.5, 0.62, 0.72, 0.8],
  },
  {
    label: '04',
    title: 'Precision Hover',
    body: 'The final front-on hold showcases controlled hover stability, rotor synchronization, and urban landing readiness.',
    range: [0.76, 0.86, 0.96, 1],
  },
]

function createFramePaths() {
  return Array.from(
    { length: FRAME_COUNT },
    (_, index) => `/frames/new-images/ezgif-frame-${String(index + 1).padStart(3, '0')}.jpg`
  )
}

export function PlaneMorph() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const framePaths = useMemo(() => createFramePaths(), [])
  const { imagesRef, ready } = useImagePreloader(framePaths, 24)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 84,
    damping: 20,
    mass: 0.34,
  })

  useScrollDraw({
    canvasRef,
    progress: smoothProgress,
    imagesRef,
    ready,
    background: '#040404',
  })

  const vignetteOpacity = useTransform(smoothProgress, [0, 0.3, 0.65, 1], [0.28, 0.2, 0.38, 0.72])
  const panelOpacity = useTransform(smoothProgress, [0.06, 0.18, 1], [0, 1, 1])
  const panelY = useTransform(smoothProgress, [0.06, 0.18], [36, 0])

  return (
    <section ref={sectionRef} className="relative h-[520vh] bg-[#050505]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#050505]">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

        <motion.div
          style={{ opacity: vignetteOpacity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_12%,rgba(0,0,0,0.14)_42%,rgba(0,0,0,0.86)_100%)]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/88" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/18" />

        <motion.div
          style={{ opacity: panelOpacity, y: panelY }}
          className="relative z-10 flex h-full items-center px-6 md:px-10"
        >
          <div className="w-full max-w-xl rounded-[1.75rem] border border-white/10 bg-black/35 p-6 backdrop-blur-md md:p-8">
            <p className="mb-6 text-[0.68rem] uppercase tracking-[0.9em] text-white/42">
              Helicopter Movement Study
            </p>

            <div className="space-y-6">
              {MOVEMENT_STEPS.map((step) => {
                const opacity = useTransform(smoothProgress, step.range, [0.18, 1, 1, 0.18])
                const x = useTransform(smoothProgress, step.range, [28, 0, 0, -18])
                const scale = useTransform(smoothProgress, step.range, [0.96, 1, 1, 0.98])

                return (
                  <motion.div
                    key={step.label}
                    style={{ opacity, x, scale }}
                    className="border-l border-white/14 pl-5"
                  >
                    <p className="mb-2 text-[0.66rem] uppercase tracking-[0.7em] text-white/38">
                      {step.label}
                    </p>
                    <h3 className="text-2xl font-semibold uppercase tracking-[0.08em] text-white md:text-3xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-7 tracking-[0.16em] text-white/64">
                      {step.body}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
