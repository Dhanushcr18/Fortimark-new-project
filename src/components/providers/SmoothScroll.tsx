'use client'

import { ReactLenis } from 'lenis/react'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.15,
        lerp: 0.085,
        smoothWheel: true,
        syncTouch: true,
        touchMultiplier: 1.1,
      }}
    >
      {children}
    </ReactLenis>
  )
}
