'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function CyberDefenseSliderSection() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Helicopter path: right -> bottom -> right
  const heliLeft = useTransform(scrollYProgress, [0, 0.34, 0.7, 1], ['78%', '78%', '52%', '78%'])
  const heliTop = useTransform(scrollYProgress, [0, 0.34, 0.7, 1], ['38%', '38%', '76%', '40%'])
  const heliScale = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.84, 0.98])
  const heliRotate = useTransform(scrollYProgress, [0, 0.7, 1], [0, -6, 0])

  // Slide 1 reveal
  const s1TitleOpacity = useTransform(scrollYProgress, [0.01, 0.08, 0.28, 0.34], [0, 1, 1, 0])
  const s1BodyOpacity = useTransform(scrollYProgress, [0.08, 0.15, 0.28, 0.34], [0, 1, 1, 0])
  const s1Y = useTransform(scrollYProgress, [0.01, 0.15], [22, 0])

  // Slide 2 reveal
  const s2TitleOpacity = useTransform(scrollYProgress, [0.34, 0.42, 0.60, 0.68], [0, 1, 1, 0])
  const s2BodyOpacity = useTransform(scrollYProgress, [0.42, 0.50, 0.60, 0.68], [0, 1, 1, 0])
  const s2Y = useTransform(scrollYProgress, [0.34, 0.50], [22, 0])

  // Slide 3 reveal
  const s3TitleOpacity = useTransform(scrollYProgress, [0.68, 0.76, 0.96, 1.0], [0, 1, 1, 0])
  const s3BodyOpacity = useTransform(scrollYProgress, [0.76, 0.84, 0.96, 1.0], [0, 1, 1, 0])
  const s3Y = useTransform(scrollYProgress, [0.68, 0.84], [22, 0])

  return (
    <section ref={sectionRef} className="relative h-[500vh] overflow-hidden bg-[#05020A]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,0,255,0.18),transparent_40%),radial-gradient(circle_at_85%_70%,rgba(0,255,255,0.12),transparent_45%)]" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,0,255,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.18)_1px,transparent_1px)] [background-size:42px_42px]" />

        <motion.div
          className="absolute z-20 pointer-events-none"
          style={{
            left: heliLeft,
            top: heliTop,
            scale: heliScale,
            rotate: heliRotate,
            x: '-50%',
            y: '-50%',
          }}
        >
          <img
            src="https://res.cloudinary.com/dv3wztxvf/image/upload/v1773492365/WhatsApp_Image_2026-03-12_at_5.45.07_PM-removebg-preview_mmxvix.png"
            alt="helicopter"
            className="w-[680px] max-w-[88vw]"
          />
        </motion.div>

        <div className="relative z-10 h-full px-[10%]">
          <motion.div style={{ opacity: s1TitleOpacity, y: s1Y }} className="absolute left-[10%] top-1/2 max-w-[520px] -translate-y-1/2">
            <h1 className="mb-5 text-[42px] font-extrabold leading-tight tracking-[0.01em] text-white">AIR-TIGHT CYBER DEFENSE.</h1>
            <motion.p style={{ opacity: s1BodyOpacity }} className="text-[18px] leading-[1.7] text-[#bdbdbd]">
              In a world where data breaches move faster than light, static security is not enough.
              We provide real-time, 360-degree aerial surveillance for your digital perimeter.
              Our automated response systems intercept threats before they touch your server,
              ensuring your business stays airborne while the competition stays grounded.
            </motion.p>
          </motion.div>

          <motion.div style={{ opacity: s2TitleOpacity, y: s2Y }} className="absolute left-1/2 top-1/2 max-w-[560px] -translate-x-1/2 -translate-y-1/2 text-center">
            <h1 className="mb-5 text-[42px] font-extrabold leading-tight tracking-[0.01em] text-white">RAPID RESPONSE. ZERO FRICTION.</h1>
            <motion.p style={{ opacity: s2BodyOpacity }} className="text-[18px] leading-[1.7] text-[#bdbdbd]">
              Stop waiting for the future to arrive. We have built a platform designed for
              vertical takeoff, bypassing the bottlenecks of traditional workflows.
            </motion.p>
          </motion.div>

          <motion.div style={{ opacity: s3TitleOpacity, y: s3Y }} className="absolute right-[10%] top-1/2 max-w-[520px] -translate-y-1/2 text-left">
            <h1 className="mb-5 text-[42px] font-extrabold leading-tight tracking-[0.01em] text-white">AIR-TIGHT CYBER DEFENSE.</h1>
            <motion.p style={{ opacity: s3BodyOpacity }} className="text-[18px] leading-[1.7] text-[#bdbdbd]">
              The grid is messy, but your security should not be.
              We deploy elite digital protocols to patrol your code,
              hunting down bugs and vulnerabilities from above.
              Do not just patch the holes-dominate the airspace.
              Welcome to the next level of tactical tech.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
