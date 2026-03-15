'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function AnimationShowcaseSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // 3D Transform - Rotate and scale based on scroll
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [0, 15, 30])
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-20, 0, 20])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1])

  // Parallax effects for different layers
  const parallaxY1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const parallaxY3 = useTransform(scrollYProgress, [0, 1], [0, 50])

  // Text reveal animation timing
  const line1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.35], [0, 0, 1])
  const line2Opacity = useTransform(scrollYProgress, [0.15, 0.35, 0.5], [0, 0, 1])
  const line3Opacity = useTransform(scrollYProgress, [0.3, 0.5, 0.65], [0, 0, 1])

  // Text reveal Y position animations
  const line1Y = useTransform(scrollYProgress, [0, 0.2, 0.35], [40, 40, 0])
  const line2Y = useTransform(scrollYProgress, [0.15, 0.35, 0.5], [40, 40, 0])
  const line3Y = useTransform(scrollYProgress, [0.3, 0.5, 0.65], [40, 40, 0])

  // Content fade-in effect
  const contentOpacity = useTransform(scrollYProgress, [0.6, 0.8, 1], [0, 0.5, 1])

  return (
    <section
      ref={containerRef}
      className="relative h-[800vh] bg-gradient-to-b from-[#050505] via-[#0a0a1f] to-[#000000]"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#000000]/40 to-[#000000]/80" />

        {/* Parallax Background Layer 1 */}
        <motion.div
          style={{ y: parallaxY1 }}
          className="absolute inset-0 bg-gradient-to-br from-[#1a0033]/20 via-transparent to-[#003366]/20"
        />

        {/* Parallax Background Layer 2 */}
        <motion.div
          style={{ y: parallaxY2 }}
          className="absolute inset-0 bg-gradient-to-tl from-[#330066]/15 via-transparent to-[#006699]/15"
        />

        {/* 3D Card Container with Transform */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            style={{
              rotateX,
              rotateY,
              scale,
            }}
            className="relative w-full max-w-2xl h-96"
          >
            {/* Main card with 3D effect */}
            <div className="absolute inset-0 rounded-3xl border border-[#ff00ff]/30 bg-gradient-to-br from-[#1a0033]/40 to-[#000033]/60 backdrop-blur-lg overflow-hidden">
              {/* Card shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-1000" />

              {/* Text Reveal Container */}
              <div className="flex flex-col items-center justify-center h-full px-8 gap-6">
                {/* Line 1 - Text Reveal */}
                <motion.div
                  style={{
                    opacity: line1Opacity,
                    y: line1Y,
                  }}
                  className="text-center"
                >
                  <h1 className="text-5xl md:text-6xl font-thin tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#ff3366]">
                    INNOVATION
                  </h1>
                </motion.div>

                {/* Divider */}
                <motion.div
                  style={{ opacity: line1Opacity }}
                  className="flex items-center gap-4"
                >
                  <div className="h-px w-8 bg-gradient-to-r from-[#ff00ff] to-transparent" />
                  <div className="h-px w-8 bg-gradient-to-l from-[#00ffff] to-transparent" />
                </motion.div>

                {/* Line 2 - Text Reveal */}
                <motion.div
                  style={{
                    opacity: line2Opacity,
                    y: line2Y,
                  }}
                  className="text-center"
                >
                  <h2 className="text-4xl md:text-5xl font-thin tracking-[0.08em] text-transparent bg-clip-text bg-gradient-to-r from-[#00ffff] to-[#00ff99]">
                    MEETS DESIGN
                  </h2>
                </motion.div>

                {/* Line 3 - Text Reveal */}
                <motion.div
                  style={{
                    opacity: line3Opacity,
                    y: line3Y,
                  }}
                  className="text-center"
                >
                  <p className="text-lg md:text-2xl font-light tracking-[0.12em] text-[#00ffff]/80">
                    scroll to explore
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Parallax Background Layer 3 */}
        <motion.div
          style={{ y: parallaxY3 }}
          className="absolute inset-0 bg-radial-gradient pointer-events-none"
        />

        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff00ff]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00ffff]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '0.7s' }} />
      </div>

      {/* Content section below scroll container */}
      <div
        ref={contentRef}
        className="relative z-10 h-[200vh] bg-gradient-to-b from-[#000000] to-[#0a0015] px-8 py-32"
      >
        <motion.div
          style={{ opacity: contentOpacity }}
          className="max-w-3xl mx-auto text-center"
        >
          <h3 className="text-4xl md:text-5xl font-thin tracking-[0.15em] text-[#ff00ff] mb-8">
            TRANSFORMATIVE EXPERIENCE
          </h3>
          <p className="text-lg text-[#00ffff]/70 mb-12 leading-relaxed">
            Scroll through the digital landscape where technology transcends boundaries. 
            Every pixel, every animation, every interaction is crafted to deliver
            an unforgettable visual journey.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              { title: 'TEXT REVEAL', desc: 'Progressive disclosure of information' },
              { title: 'PARALLAX', desc: 'Depth through layered movement' },
              { title: '3D TRANSFORM', desc: 'Dynamic perspective shifts' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 0, 255, 0.3)' }}
                className="p-8 rounded-2xl border border-[#ff00ff]/20 bg-gradient-to-br from-[#1a0033]/30 to-[#000033]/50 backdrop-blur"
              >
                <h4 className="text-[#ff00ff] font-thin tracking-[0.1em] mb-3">
                  {feature.title}
                </h4>
                <p className="text-[#00ffff]/60 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
