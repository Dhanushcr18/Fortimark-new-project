'use client'

import { useMemo, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useImagePreloader } from '@/hooks/useImagePreloader'
import { useScrollDraw } from '@/hooks/useScrollDraw'

const FRAME_COUNT = 113

function createFramePaths() {
  return Array.from(
    { length: FRAME_COUNT },
    (_, index) => `/sequence-1/ezgif-frame-${String(index + 1).padStart(3, '0')}.jpg`
  )
}

export function HeroScroll() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const framePaths = useMemo(() => createFramePaths(), [])
  const { imagesRef, ready } = useImagePreloader(framePaths, 16)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.22,
  })

  useScrollDraw({
    canvasRef,
    progress: smoothProgress,
    imagesRef,
    ready,
    background: '#070707',
  })

  const labelOpacity = useTransform(smoothProgress, [0.05, 0.14, 0.34, 0.42], [0, 1, 1, 0])
  const headlineOpacity = useTransform(smoothProgress, [0.08, 0.18, 0.38, 0.52], [0, 1, 1, 0])
  const headlineY = useTransform(smoothProgress, [0.08, 0.22, 0.5], [70, 0, -30])
  const subtextOpacity = useTransform(smoothProgress, [0.14, 0.24, 0.42, 0.56], [0, 1, 1, 0])
  const vignetteOpacity = useTransform(smoothProgress, [0, 0.4, 1], [0.82, 0.55, 0.88])

  return (
    <section ref={sectionRef} className="relative h-[400vh] bg-[#050505]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#050505]">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <motion.div
          style={{ opacity: vignetteOpacity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.18)_48%,rgba(0,0,0,0.78)_100%)]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/72 via-transparent to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/52 via-transparent to-black/52" />

        <motion.div
          style={{ opacity: headlineOpacity, y: headlineY }}
          className="relative z-10 flex h-full items-center justify-center px-6 text-center"
        >
          <div className="max-w-6xl">
            <motion.p
              style={{ opacity: labelOpacity }}
              className="mb-6 text-[0.72rem] uppercase tracking-[0.85em] text-white/42"
            >
              Electric Aviation
            </motion.p>
            <h1 className="text-5xl font-semibold uppercase tracking-[0.08em] text-white sm:text-6xl md:text-7xl lg:text-[6.6rem]">
              Elevate Your Horizons
            </h1>
            <motion.p
              style={{ opacity: subtextOpacity }}
              className="mx-auto mt-5 max-w-4xl text-sm leading-7 tracking-[0.32em] text-white/72 sm:text-base"
            >
              The pinnacle of electric aviation. Silent, zero-emissions, uncompromising luxury.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
