'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const NAV_LINKS = ['ABOUT', 'FLEET', 'EXPERIENCE'] as const

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-14 py-7"
      style={{
        background: scrolled ? 'rgba(10, 0, 21, 0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 0, 255, 0.2)' : 'none',
        boxShadow: scrolled ? '0 0 30px rgba(255, 0, 255, 0.1)' : 'none',
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease',
      }}
    >
      {/* Logo */}
      <div className="text-white text-xs tracking-[0.5em] font-light select-none" style={{ textShadow: '0 0 10px rgba(255, 0, 255, 0.5)' }}>
        JESKO JETS
      </div>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-10">
        {NAV_LINKS.map((item) => (
          <div
            key={item}
            className="text-[#00ffff]/50 text-[11px] tracking-[0.35em] font-light cursor-default"
            style={{ textShadow: '0 0 10px rgba(255, 0, 255, 0.4)' }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* CTA */}
      <a
        href="#reserve"
        className="text-white text-[11px] tracking-[0.35em] border border-[#ff00ff]/50 px-6 py-2.5
                   hover:bg-[#ff00ff]/20 hover:border-[#ff00ff] hover:shadow-neon-pink transition-all duration-300"
      >
        RESERVE
      </a>
    </motion.nav>
  )
}
