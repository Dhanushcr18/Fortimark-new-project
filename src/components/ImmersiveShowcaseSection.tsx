'use client'

import dynamic from 'next/dynamic'
import { Component, useMemo } from 'react'
import { motion } from 'framer-motion'

const ModelStage = dynamic(
  () => import('./ModelStage').then((mod) => mod.ModelStage),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-20 w-20 rounded-full border border-white/20 bg-[radial-gradient(circle,rgba(255,255,255,0.18),rgba(255,255,255,0.04)_58%,transparent_74%)]" />
      </div>
    ),
  }
)

function hasWebGLSupport() {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    return !!gl
  } catch {
    return false
  }
}

class StageErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('3D stage failed, showing fallback UI.', error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

function StageFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-6 h-20 w-20 rounded-full border border-white/20 bg-[radial-gradient(circle,rgba(255,255,255,0.18),rgba(255,255,255,0.04)_58%,transparent_74%)]" />
        <p className="text-[0.68rem] uppercase tracking-[0.55em] text-white/45">Model Loading</p>
      </div>
    </div>
  )
}

export function ImmersiveShowcaseSection() {
  const canRender3D = useMemo(() => hasWebGLSupport(), [])

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505] px-6 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_42%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_26%,transparent_74%,rgba(255,255,255,0.04))]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-12rem)] max-w-7xl flex-col justify-center gap-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <p className="mb-5 text-[0.72rem] uppercase tracking-[0.85em] text-white/45">
            Final Reveal
          </p>
          <h2 className="text-4xl font-semibold uppercase tracking-[0.12em] text-white sm:text-5xl md:text-6xl">
            Precision In Three Dimensions.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 tracking-[0.26em] text-white/62 sm:text-base">
            Explore the aircraft form up close with a fully interactive model display built for a luxury showroom finish.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, delay: 0.08 }}
          className="relative h-[60vh] min-h-[520px] overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] shadow-[0_40px_140px_rgba(0,0,0,0.55)]"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_54%)]" />
          {canRender3D ? (
            <StageErrorBoundary fallback={<StageFallback />}>
              <ModelStage />
            </StageErrorBoundary>
          ) : (
            <StageFallback />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.14 }}
          className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6"
        >
          <p className="text-[0.68rem] uppercase tracking-[0.6em] text-white/42">
            Drag to rotate the aircraft
          </p>
          <p className="text-[0.68rem] uppercase tracking-[0.6em] text-white/28">
            Rendered in real time
          </p>
        </motion.div>
      </div>
    </section>
  )
}
