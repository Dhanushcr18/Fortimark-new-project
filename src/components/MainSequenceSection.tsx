'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ImageSequenceCanvas } from './ImageSequenceCanvas'

const MAIN_SEQUENCE_FRAMES = Array.from(
  { length: 246 },
  (_, i) => `/frames/new-images/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
)

export function MainSequenceSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const titleOpacity = useTransform(scrollYProgress, [0, 0.78, 0.92, 1], [1, 1, 0, 0])
  const titleY = useTransform(scrollYProgress, [0, 0.88], [0, -24])
  const metaOpacity = useTransform(scrollYProgress, [0, 0.10, 0.72, 0.84], [1, 1, 1, 0])
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0])

  return (
    <section ref={containerRef} className="relative h-[650vh] bg-gradient-to-b from-[#0a0015] to-[#050505]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <ImageSequenceCanvas
          imagePaths={MAIN_SEQUENCE_FRAMES}
          scrollYProgress={scrollYProgress}
          priorityCount={18}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0015]/55 via-transparent to-[#0a0015]/72" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#ff00ff]/10 via-transparent to-[#00ffff]/10" />

        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
        >
          <p className="mb-5 text-[10px] uppercase tracking-[0.7em] text-black opacity-80">
            Jesko Jets
          </p>
          <h1 className="text-4xl font-thin leading-tight tracking-[0.22em] text-black sm:text-6xl md:text-8xl xl:text-[9rem]" style={{ textShadow: '0 0 30px rgba(255, 255, 255, 0.3)' }}>
            ELEVATE YOUR<br />HORIZONS
          </h1>
          <div className="mt-8 h-px w-16 bg-gradient-to-r from-transparent via-black to-transparent" />
        </motion.div>

        <motion.div
          style={{ opacity: metaOpacity }}
          className="pointer-events-none absolute bottom-14 left-0 right-0 flex justify-center px-8"
        >
          <div className="flex gap-8 text-center md:gap-16">
            <div>
              <p className="mb-1 text-[9px] tracking-[0.55em] text-black/50">SEQUENCE</p>
              <p className="text-sm font-thin tracking-[0.18em] text-black">246 FRAMES</p>
            </div>
            <div>
              <p className="mb-1 text-[9px] tracking-[0.55em] text-black/50">SCROLL</p>
              <p className="text-sm font-thin tracking-[0.18em] text-black">CINEMATIC</p>
            </div>
            <div>
              <p className="mb-1 text-[9px] tracking-[0.55em] text-black/50">FINISH</p>
              <p className="text-sm font-thin tracking-[0.18em] text-black">MATTE CARBON</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        >
          <p className="text-[9px] uppercase tracking-[0.6em] text-black/60">Scroll</p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="h-8 w-px bg-gradient-to-b from-black to-transparent"
          />
        </motion.div>
      </div>
    </section>
  )
}