'use client'

import { useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import { ImageSequenceCanvas } from './ImageSequenceCanvas'

// ─── Frame manifest ────────────────────────────────────────────────────────
// Folder 1: ezgif-frame-188.jpg → ezgif-frame-300.jpg  (113 frames)
const EXHIBIT_FRAMES = Array.from(
  { length: 113 },
  (_, i) => `/frames/1/ezgif-frame-${String(i + 188).padStart(3, '0')}.jpg`
)

export function ExhibitSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // ── Overlay 1: PRECISION CRAFTED (0 → 48%) ──────────────────────────────
  const t1Opacity = useTransform(scrollYProgress, [0, 0.08, 0.80, 0.92], [0, 1, 1, 0])
  const t1Y       = useTransform(scrollYProgress, [0, 0.10], [32, 0])

  // ── Side label ──────────────────────────────────────────────────────────
  const sideLabelOpacity = useTransform(scrollYProgress, [0.05, 0.12, 0.82, 0.92], [0, 1, 1, 0])

  return (
    <section ref={containerRef} className="relative h-[450vh] bg-gradient-to-b from-[#0a0015] to-[#050505]">
      <div className="sticky top-0 h-screen overflow-hidden bg-gradient-to-b from-[#0a0015] to-[#050505]">
        <ImageSequenceCanvas
          imagePaths={EXHIBIT_FRAMES}
          scrollYProgress={scrollYProgress}
          priorityCount={12}
        />

        {/* Vignettes */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0015]/55 via-transparent to-[#0a0015]/55" />

        {/* Vertical side label */}
        <motion.div
          style={{ opacity: sideLabelOpacity }}
          className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 hidden md:flex"
        >
          <p
            className="text-[9px] tracking-[0.6em] text-[#00ffff]/40 uppercase"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Jesko Craftsmanship
          </p>
        </motion.div>

        {/* ── Overlay 1: PRECISION CRAFTED ── */}
        <motion.div
          style={{ opacity: t1Opacity, y: t1Y }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-start pt-32 md:pt-40"
        >
          <p className="mb-5 text-[10px] tracking-[0.7em] text-[#00ffff] opacity-60 uppercase">
            Craftsmanship
          </p>
          <h2 className="text-center text-4xl font-thin leading-tight tracking-[0.25em] text-[#ff00ff] sm:text-6xl md:text-8xl" style={{ textShadow: '0 0 30px rgba(255, 0, 255, 0.6)' }}>
            PRECISION<br />CRAFTED
          </h2>
          <div className="mt-8 h-px w-12 bg-gradient-to-r from-transparent via-[#ff00ff] to-transparent" />
        </motion.div>

        {/* ── Overlay 2: EVERY DETAIL MATTERS ── */}
      </div>
    </section>
  )
}
