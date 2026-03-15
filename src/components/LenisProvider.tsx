'use client'

import { ReactLenis } from 'lenis/react'

/**
 * Wraps the app with Lenis smooth scroll.
 * Must be a client component because ReactLenis uses browser APIs.
 *
 * lerp: 0.08 gives a premium "weight" feel (lower = heavier/slower)
 * syncTouch: true enables inertia on touchscreens
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.4,
        smoothWheel: true,
        syncTouch: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
