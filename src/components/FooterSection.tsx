'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// ─────────────────────────────────────────────────────────────────────────────
// Canvas globe: orthographic projection of rotating lat/lon grid
// ─────────────────────────────────────────────────────────────────────────────
function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>()
  const rotRef    = useRef(0) // longitude rotation accumulator (degrees)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const w  = canvas.width
      const h  = canvas.height
      const cx = w / 2
      const cy = h / 2
      const r  = Math.min(w, h) * 0.36

      ctx.clearRect(0, 0, w, h)

      // ── Atmosphere glow ──────────────────────────────────────────────────
      const atmoGrad = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r * 1.55)
      atmoGrad.addColorStop(0,   'rgba(255, 0, 255, 0.15)')
      atmoGrad.addColorStop(0.5, 'rgba(0, 255, 255, 0.08)')
      atmoGrad.addColorStop(1,   'rgba(0,    0,   0, 0)')
      ctx.fillStyle = atmoGrad
      ctx.fillRect(0, 0, w, h)

      // ── Sphere body ──────────────────────────────────────────────────────
      const sphereGrad = ctx.createRadialGradient(
        cx - r * 0.25, cy - r * 0.25, 0,
        cx, cy, r
      )
      sphereGrad.addColorStop(0,   'rgba(170, 0, 255, 0.50)')
      sphereGrad.addColorStop(0.6, 'rgba(100, 0, 150, 0.65)')
      sphereGrad.addColorStop(1,   'rgba(20, 0, 50, 0.85)')

      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = sphereGrad
      ctx.fill()

      // ── Latitude lines ───────────────────────────────────────────────────
      // Viewing angle tilt for the minor axis of each latitude ellipse
      const TILT = 0.28 // ~16° viewing elevation
      ctx.lineWidth = 0.6
      for (let lat = -75; lat <= 75; lat += 15) {
        const latRad  = (lat * Math.PI) / 180
        const ry_full = r * Math.cos(latRad)
        const ey      = cy + r * Math.sin(latRad)

        if (ry_full < 1) continue

        // Fade equatorial lines more, polar lines less
        const alpha = 0.03 + Math.abs(Math.sin(latRad)) * 0.03
        ctx.beginPath()
        ctx.ellipse(cx, ey, ry_full, ry_full * TILT, 0, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255, 0, 255, ${alpha * 2})`
        ctx.stroke()
      }

      // ── Longitude lines (rotating) ───────────────────────────────────────
      ctx.lineWidth = 0.5
      for (let lon = 0; lon < 180; lon += 15) {
        const lonRad = ((lon + rotRef.current) * Math.PI) / 180
        const cosLon = Math.cos(lonRad)
        const rx     = Math.abs(cosLon) * r

        // Front hemisphere is brighter
        const alpha = cosLon > 0
          ? 0.04 + cosLon * 0.05
          : 0.015

        ctx.beginPath()
        ctx.ellipse(cx, cy, rx, r, 0, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0, 255, 255, ${alpha * 2})`
        ctx.stroke()
      }

      // ── Rim light ────────────────────────────────────────────────────────
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255, 0, 255, 0.35)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // ── Polar cap highlight ──────────────────────────────────────────────
      const polarGrad = ctx.createRadialGradient(cx, cy - r * 0.88, 0, cx, cy, r)
      polarGrad.addColorStop(0,   'rgba(0, 255, 255, 0.25)')
      polarGrad.addColorStop(0.4, 'rgba(255, 0, 255, 0.08)')
      polarGrad.addColorStop(1,   'rgba(0, 0, 0, 0)')
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = polarGrad
      ctx.fill()

      rotRef.current += 0.04 // ~2.4 deg/s at 60 fps
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-55"
      aria-hidden="true"
    />
  )
}

// ─── Footer stats ─────────────────────────────────────────────────────────────
const STATS = [
  { label: 'DESTINATIONS', value: '200+' },
  { label: 'ACTIVE FLEET',  value: '48'   },
  { label: 'REACH',         value: 'GLOBAL'},
] as const

// ─── Main component ───────────────────────────────────────────────────────────
export function FooterSection() {
  return (
    <section
      id="reserve"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0a0015] to-[#050505] px-8"
    >
      {/* Animated globe background */}
      <GlobeCanvas />

      {/* Radial dark overlay so text is always legible */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0015] via-[#0a0015]/30 to-[#050505]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0015]/80 via-transparent to-[#0a0015]/80" />

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-8 text-[10px] tracking-[0.8em] text-[#00ffff] opacity-60 uppercase"
        >
          Join the Fleet
        </motion.p>

        <motion.h2
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-4xl font-thin leading-tight tracking-[0.2em] text-[#ff00ff] sm:text-6xl md:text-8xl"
          style={{ textShadow: '0 0 40px rgba(255, 0, 255, 0.6)' }}
        >
          RESERVE YOUR<br />FLIGHT
        </motion.h2>

        <motion.div
          initial={false}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
          className="my-10 h-px w-20 bg-gradient-to-r from-transparent via-[#ff00ff] to-transparent"
        />

        <motion.p
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-14 max-w-sm text-[11px] leading-[2.3] tracking-widest text-[#00ffff]/60"
        >
          Experience the pinnacle of private aviation.<br />
          Destinations worldwide. Departure on your terms.
        </motion.p>

        <motion.button
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          whileHover={{ backgroundColor: 'rgba(255, 0, 255, 0.2)', borderColor: 'rgba(255, 0, 255, 0.8)', boxShadow: '0 0 30px rgba(255, 0, 255, 0.5)' }}
          className="mb-20 inline-block border border-[#ff00ff]/50 px-16 py-5
                     text-[11px] tracking-[0.5em] text-[#ff00ff] transition-all duration-300"
          style={{ textShadow: '0 0 10px rgba(255, 0, 255, 0.6)' }}
          type="button"
        >
          RESERVE YOUR FLIGHT
        </motion.button>

        {/* Stats */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.7 }}
          viewport={{ once: true }}
          className="flex gap-14 md:gap-20"
        >
          {STATS.map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center">
              <p className="mb-1 text-2xl font-thin tracking-[0.08em] text-[#ff00ff] md:text-3xl">
                {value}
              </p>
              <p className="text-[9px] tracking-[0.5em] text-[#00ffff]/50">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Footer bar ─────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-[#ff00ff]/20 px-10 py-5">
        <p className="text-[10px] tracking-[0.45em] text-[#ff00ff]/40">JESKO JETS</p>
        <p className="text-[10px] tracking-[0.3em] text-[#00ffff]/40">© 2024 ALL RIGHTS RESERVED</p>
        <p className="hidden text-[10px] tracking-[0.4em] text-[#ff00ff]/40 md:block">
          PRIVATE AVIATION REDEFINED
        </p>
      </div>
    </section>
  )
}
