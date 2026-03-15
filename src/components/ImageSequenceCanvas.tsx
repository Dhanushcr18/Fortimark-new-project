'use client'

import { useEffect, useRef, useCallback } from 'react'
import { MotionValue, useMotionValueEvent } from 'framer-motion'
import { useImagePreloader } from '@/hooks/useImagePreloader'

interface ImageSequenceCanvasProps {
  /** Ordered array of public image paths, e.g. /frames/2/ezgif-frame-001.jpg */
  imagePaths: string[]
  /** Framer Motion MotionValue<number> 0 → 1 representing scroll progress */
  scrollYProgress: MotionValue<number>
  /** How many frames to load immediately before showing the canvas */
  priorityCount?: number
}

/**
 * Renders a full-screen canvas that maps scrollYProgress → frame index.
 *
 * Key features:
 * - devicePixelRatio scaling for Retina sharpness
 * - "object-fit: cover" draw algorithm so the jet always fills the screen
 * - Progressive loading via useImagePreloader (priorityCount frames first)
 * - Skips redundant redraws (lastFrameRef guard)
 */
export function ImageSequenceCanvas({
  imagePaths,
  scrollYProgress,
  priorityCount = 15,
}: ImageSequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { imagesRef } = useImagePreloader(imagePaths, priorityCount)
  const lastFrameRef = useRef<number>(-1)

  // ─── Core draw routine ────────────────────────────────────────────────────
  const drawFrame = useCallback(
    (progress: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Map 0..1 → 0..N-1 (clamped)
      const frameIndex = Math.min(
        Math.floor(progress * imagePaths.length),
        imagePaths.length - 1
      )

      const img = imagesRef.current[frameIndex]
      // If this frame isn't loaded yet, keep the last rendered frame visible
      if (!img) return

      // Avoid redundant redraws of the same frame
      if (frameIndex === lastFrameRef.current) return
      lastFrameRef.current = frameIndex

      const cw = canvas.width
      const ch = canvas.height
      const iw = img.naturalWidth
      const ih = img.naturalHeight

      // Cover algorithm: scale so the image fills the canvas, cropped centered
      const scale = Math.max(cw / iw, ch / ih)
      const dw = iw * scale
      const dh = ih * scale
      const dx = (cw - dw) / 2
      const dy = (ch - dh) / 2

      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, dx, dy, dw, dh)
    },
    // imagesRef is a stable ref-backed array; imagePaths.length is a primitive
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [imagePaths.length]
  )

  // ─── Canvas sizing (DPR-aware) ─────────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    lastFrameRef.current = -1 // force redraw after resize
    drawFrame(scrollYProgress.get())
  }, [drawFrame, scrollYProgress])

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [resizeCanvas])

  // ─── Draw initial frame ────────────────────────────────────────────────────
  useEffect(() => {
    lastFrameRef.current = -1 // force first draw
    drawFrame(scrollYProgress.get())
  }, [drawFrame, scrollYProgress])

  // ─── Keep canvas in sync with scroll ──────────────────────────────────────
  useMotionValueEvent(scrollYProgress, 'change', drawFrame)

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 block"
      aria-hidden="true"
    />
  )
}
