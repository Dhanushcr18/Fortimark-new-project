'use client'

import { MutableRefObject, useEffect, useRef } from 'react'
import { MotionValue, useMotionValueEvent } from 'framer-motion'

interface UseScrollDrawOptions {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>
  progress: MotionValue<number>
  imagesRef: MutableRefObject<(HTMLImageElement | null)[]>
  ready: boolean
  background?: string
}

function drawCoverFrame(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  width: number,
  height: number,
  background: string
) {
  const imageAspect = image.naturalWidth / image.naturalHeight
  const canvasAspect = width / height

  let drawWidth = width
  let drawHeight = height
  let drawX = 0
  let drawY = 0

  if (imageAspect > canvasAspect) {
    drawHeight = height
    drawWidth = height * imageAspect
    drawX = (width - drawWidth) / 2
  } else {
    drawWidth = width
    drawHeight = width / imageAspect
    drawY = (height - drawHeight) / 2
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.scale(canvas.width / width, canvas.height / height)
  ctx.fillStyle = background
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight)
}

export function useScrollDraw({
  canvasRef,
  progress,
  imagesRef,
  ready,
  background = '#050505',
}: UseScrollDrawOptions) {
  const frameRef = useRef(-1)
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 })
  const rafRef = useRef<number | null>(null)

  const drawFrame = (frameFloat: number) => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const frameCount = imagesRef.current.length
    if (frameCount === 0) {
      return
    }

    const frame = Math.max(0, Math.min(Math.round(frameFloat), frameCount - 1))
    const image = imagesRef.current[frame]
    if (!image?.complete) {
      return
    }

    if (frame === frameRef.current) {
      return
    }

    const context = canvas.getContext('2d', { alpha: false })
    if (!context) {
      return
    }

    const { width, height } = sizeRef.current
    if (!width || !height) {
      return
    }

    frameRef.current = frame
    drawCoverFrame(context, canvas, image, width, height, background)
  }

  useEffect(() => {
    const updateSize = () => {
      const canvas = canvasRef.current
      if (!canvas?.parentElement) {
        return
      }

      const rect = canvas.parentElement.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.round(rect.width)
      const height = Math.round(rect.height)

      sizeRef.current = { width, height, dpr }
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      frameRef.current = -1
      drawFrame(progress.get() * Math.max(imagesRef.current.length - 1, 0))
    }

    updateSize()

    let timeoutId = 0
    const onResize = () => {
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(updateSize, 80)
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      window.clearTimeout(timeoutId)
    }
  }, [canvasRef, imagesRef, progress])

  useEffect(() => {
    if (!ready) {
      return
    }

    frameRef.current = -1
    drawFrame(progress.get() * Math.max(imagesRef.current.length - 1, 0))
  }, [imagesRef, progress, ready])

  useMotionValueEvent(progress, 'change', (latest) => {
    if (!ready) {
      return
    }

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      drawFrame(latest * Math.max(imagesRef.current.length - 1, 0))
    })
  })

  useEffect(
    () => () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    },
    []
  )
}
