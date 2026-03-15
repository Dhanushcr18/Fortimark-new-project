'use client'

import { useMemo, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useImagePreloader } from '@/hooks/useImagePreloader'
import { useScrollDraw } from '@/hooks/useScrollDraw'

const FRAME_COUNT = 166

type AccessStep = {
  label: string
  title: string
  body: string
  range: number[]
}

const ACCESS_STEPS: AccessStep[] = [
  {
    label: '01',
    title: 'Wide Reach',
    body: 'The aircraft enters against an open black horizon, emphasizing range, quiet operation, and a long-distance visual signature.',
    range: [0.04, 0.16, 0.24, 0.34],
  },
  {
    label: '02',
    title: 'Urban Routing',
    body: 'A compact footprint and distributed lift make the platform agile enough for dense city corridors and premium short-hop travel.',
    range: [0.28, 0.4, 0.5, 0.6],
  },
  {
    label: '03',
    title: 'Landing Readiness',
    body: 'Controlled lateral motion and stable body attitude reinforce confidence during approach, descent, and point-to-point arrival.',
    range: [0.54, 0.68, 0.78, 0.88],
  },
  {
    label: '04',
    title: 'Reserve Your Flight',
    body: 'The final hold positions the aircraft as a premium mobility product ready for reservation, charter, and future fleet operations.',
    range: [0.82, 0.9, 0.98, 1],
  },
]

const RIGHT_SIDE_STEPS = new Set(['03', '04'])

function createFramePaths() {
  return Array.from(
    { length: FRAME_COUNT },
    (_, index) => `/last-part/ezgif-frame-${String(index + 1).padStart(3, '0')}.jpg`
  )
}

export function Globe() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const framePaths = useMemo(() => createFramePaths(), [])
  const { imagesRef, ready } = useImagePreloader(framePaths, 18)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 86,
    damping: 21,
    mass: 0.34,
  })

  useScrollDraw({
    canvasRef,
    progress: smoothProgress,
    imagesRef,
    ready,
    background: '#050505',
  })

  const shadeOpacity = useTransform(smoothProgress, [0, 0.4, 1], [0.5, 0.36, 0.7])
  const cardOpacity = useTransform(smoothProgress, [0.06, 0.18, 1], [0, 1, 1])
  const cardX = useTransform(smoothProgress, [0.06, 0.18], [-28, 0])
  const ctaOpacity = useTransform(smoothProgress, [0.82, 0.92, 1], [0, 1, 1])

  return (
    <section id="reserve" ref={sectionRef} className="relative h-[440vh] bg-[#050505]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#050505]">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

        <motion.div
          style={{ opacity: shadeOpacity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_16%,rgba(0,0,0,0.18)_46%,rgba(0,0,0,0.88)_100%)]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/76 via-transparent to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/58 via-transparent to-black/18" />

        <div className="relative z-10 h-full">
          {ACCESS_STEPS.map((step) => {
            const opacity = useTransform(smoothProgress, step.range, [0.18, 1, 1, 0.18])
            const x = useTransform(
              smoothProgress,
              step.range,
              RIGHT_SIDE_STEPS.has(step.label) ? [-28, 0, 0, 18] : [28, 0, 0, -18]
            )
            const scale = useTransform(smoothProgress, step.range, [0.96, 1, 1, 0.98])
            const alignRight = RIGHT_SIDE_STEPS.has(step.label)

            return (
              <motion.div
                key={step.label}
                style={{ opacity: cardOpacity, x: cardX }}
                className={`absolute inset-y-0 flex items-center px-6 md:px-10 ${
                  alignRight ? 'right-0 justify-end' : 'left-0 justify-start'
                }`}
              >
                <motion.div
                  style={{ opacity, x, scale }}
                  className="w-full max-w-xl rounded-[1.75rem] border border-white/10 bg-black/38 p-6 backdrop-blur-md md:p-8"
                >
                  <p className="mb-6 text-[0.68rem] uppercase tracking-[0.9em] text-white/42">
                    Worldwide Access
                  </p>
                  <div className="border-l border-white/14 pl-5">
                    <p className="mb-2 text-[0.66rem] uppercase tracking-[0.7em] text-white/38">
                      {step.label}
                    </p>
                    <h3 className="text-2xl font-semibold uppercase tracking-[0.08em] text-white md:text-3xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-7 tracking-[0.16em] text-white/64">
                      {step.body}
                    </p>
                  </div>

                  {step.label === '04' ? (
                    <motion.button
                      type="button"
                      style={{ opacity: ctaOpacity }}
                      className="group relative mt-8 inline-flex items-center justify-center overflow-hidden border border-white/70 bg-transparent px-8 py-4 text-[0.72rem] uppercase tracking-[0.45em] text-white transition-colors duration-300"
                    >
                      <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100" />
                      <span className="relative transition-colors duration-300 group-hover:text-[#050505]">
                        Reserve Your Flight
                      </span>
                    </motion.button>
                  ) : null}
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
