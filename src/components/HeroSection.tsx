'use client'

import { useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import { ImageSequenceCanvas } from './ImageSequenceCanvas'

// ─── Frame manifest ────────────────────────────────────────────────────────
// Folder 2: ezgif-frame-001.jpg → ezgif-frame-187.jpg  (187 frames)
const HERO_FRAMES = Array.from(
  { length: 187 },
  (_, i) => `/frames/2/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
)

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // ── Text overlay 1: hero title (scroll 0 → 28%) ─────────────────────────
  const t1Opacity = useTransform(scrollYProgress, [0, 0.05, 0.80, 0.92], [0, 1, 1, 0])
  const t1Y = useTransform(scrollYProgress, [0, 0.06], [32, 0])

  // ── Scroll indicator fades out quickly ──────────────────────────────────
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0])

  return (
    <section ref={containerRef} className="relative h-[600vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#050505]">
        {/* Image sequence canvas */}
        <ImageSequenceCanvas
          imagePaths={HERO_FRAMES}
          scrollYProgress={scrollYProgress}
          priorityCount={15}
        />

        {/* Atmospheric edge vignettes */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-transparent to-[#050505]/70" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050505]/30 via-transparent to-[#050505]/30" />

        {/* ── Overlay 1: ELEVATE YOUR HORIZONS ── */}
        <motion.div
          style={{ opacity: t1Opacity, y: t1Y }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
        >
          <p className="mb-5 text-[10px] tracking-[0.7em] text-white/35 uppercase">
            Jesko Jets · Est. 2024
          </p>
          <h1 className="text-center text-4xl font-thin leading-tight tracking-[0.22em] text-white sm:text-6xl md:text-8xl xl:text-[9rem]">
            ELEVATE<br />YOUR HORIZONS
          </h1>
          <div className="mt-8 h-px w-16 bg-white/20" />
        </motion.div>

        {/* ── Overlay 2: ENGINEERED FOR INFINITY ── */}
        {/* ── Scroll hint ── */}
        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <p className="text-[9px] tracking-[0.6em] text-white/30 uppercase">Scroll</p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="h-8 w-px bg-gradient-to-b from-white/30 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  )
}
