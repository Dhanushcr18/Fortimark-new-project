'use client'

import { useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import { ImageSequenceCanvas } from './ImageSequenceCanvas'

// ─── Frame manifest ────────────────────────────────────────────────────────
// Folder 3: ezgif-frame-001.jpg → ezgif-frame-286.jpg  (286 frames)
const MORPH_FRAMES = Array.from(
  { length: 286 },
  (_, i) => `/frames/3/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
)

export function MorphSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // ── Overlay 1: FORM MEETS FUNCTION (0 → 30%) ────────────────────────────
  const t1Opacity = useTransform(scrollYProgress, [0, 0.06, 0.80, 0.92], [0, 1, 1, 0])
  const t1Y       = useTransform(scrollYProgress, [0, 0.08], [36, 0])

  return (
    <section ref={containerRef} className="relative h-[800vh] bg-gradient-to-b from-[#0a0015] to-[#050505]">
      <div className="sticky top-0 h-screen overflow-hidden bg-gradient-to-b from-[#0a0015] to-[#050505]">
        <ImageSequenceCanvas
          imagePaths={MORPH_FRAMES}
          scrollYProgress={scrollYProgress}
          priorityCount={20}
        />

        {/* Vignettes */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0015]/55 via-transparent to-[#0a0015]/55" />

        {/* ── Overlay 1: FORM MEETS FUNCTION ── */}
        <motion.div
          style={{ opacity: t1Opacity, y: t1Y }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
        >
          <p className="mb-5 text-[10px] tracking-[0.7em] text-[#00ffff] opacity-60 uppercase">
            Design Philosophy
          </p>
          <h2 className="text-center text-4xl font-thin leading-tight tracking-[0.22em] text-[#ff00ff] sm:text-6xl md:text-8xl" style={{ textShadow: '0 0 30px rgba(255, 0, 255, 0.6)' }}>
            FORM<br />MEETS FUNCTION
          </h2>
          <div className="mt-8 h-px w-16 bg-gradient-to-r from-transparent via-[#ff00ff] to-transparent" />
        </motion.div>

        {/* ── Overlay 2: PURE AERODYNAMICS ── */}
      </div>
    </section>
  )
}
