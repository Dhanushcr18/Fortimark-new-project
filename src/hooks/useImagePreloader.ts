'use client'

import { MutableRefObject, useEffect, useRef, useState } from 'react'

interface ImagePreloaderResult {
  imagesRef: MutableRefObject<(HTMLImageElement | null)[]>
  ready: boolean
}

export function useImagePreloader(paths: string[], priorityCount = 12): ImagePreloaderResult {
  const imagesRef = useRef<(HTMLImageElement | null)[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (paths.length === 0) {
      imagesRef.current = []
      setReady(false)
      return
    }

    let active = true
    imagesRef.current = Array.from({ length: paths.length }, () => null)
    setReady(false)

    const loadFrame = (index: number) =>
      new Promise<void>((resolve) => {
        const image = new Image()
        image.decoding = 'async'
        image.loading = 'eager'
        image.onload = () => {
          if (active) {
            imagesRef.current[index] = image
          }
          resolve()
        }
        image.onerror = () => resolve()
        image.src = paths[index]
      })

    const firstBatch = Math.min(priorityCount, paths.length)

    Promise.all(Array.from({ length: firstBatch }, (_, index) => loadFrame(index))).then(() => {
      if (!active) {
        return
      }

      setReady(true)

      const remaining = paths.slice(firstBatch)
      const pumpQueue = (queueIndex: number) => {
        if (!active || queueIndex >= remaining.length) {
          return
        }

        const frameIndex = queueIndex + firstBatch
        loadFrame(frameIndex).finally(() => {
          const idleWindow = window as Window &
            typeof globalThis & {
              requestIdleCallback?: (
                callback: IdleRequestCallback,
                options?: IdleRequestOptions
              ) => number
            }

          if (typeof idleWindow.requestIdleCallback === 'function') {
            idleWindow.requestIdleCallback(() => pumpQueue(queueIndex + 1), { timeout: 120 })
            return
          }

          globalThis.setTimeout(() => pumpQueue(queueIndex + 1), 16)
        })
      }

      pumpQueue(0)
    })

    return () => {
      active = false
    }
  }, [paths, priorityCount])

  return { imagesRef, ready }
}
