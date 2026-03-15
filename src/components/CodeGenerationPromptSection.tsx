'use client'

import { useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'

export function CodeGenerationPromptSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Fade in heading and content
  const headingOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
  const headingY = useTransform(scrollYProgress, [0, 0.15], [32, 0])

  const contentOpacity = useTransform(scrollYProgress, [0.05, 0.25, 0.80, 1], [0, 1, 1, 0])
  const contentY = useTransform(scrollYProgress, [0.05, 0.25], [40, 0])

  return (
    <section ref={containerRef} className="relative h-[500vh] bg-[#050505]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#050505]">
        {/* Background vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#050505]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050505]/40 via-transparent to-[#050505]/40" />

        {/* Animated grid background (subtle) */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(0deg, rgba(98,208,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(98,208,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Main content */}
        <div className="pointer-events-none relative h-full w-full overflow-hidden px-8 py-24 sm:px-12 md:px-16 lg:px-24">
          {/* Section heading */}
          <motion.div
            style={{ opacity: headingOpacity, y: headingY }}
            className="mb-16 flex flex-col items-center"
          >
            <p className="mb-4 text-[9px] tracking-[0.7em] text-white/40 uppercase">
              Implementation Guide
            </p>
            <h2 className="text-center text-3xl font-thin leading-tight tracking-[0.15em] text-white sm:text-5xl md:text-7xl">
              THE CODE<br />GENERATION PROMPT
            </h2>
            <div className="mt-8 h-px w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </motion.div>

          {/* Main prompt content */}
          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="mx-auto max-w-4xl space-y-8"
          >
            {/* Prompt box */}
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm">
              <p className="mb-4 text-[10px] tracking-[0.6em] text-white/50 uppercase">
                Prompt
              </p>
              <div className="space-y-4 text-sm leading-relaxed text-white/80">
                <p>
                  Create a high-quality web animation using Three.js and GSAP ScrollTrigger.
                </p>

                <div>
                  <h4 className="mb-2 font-semibold text-white/90">The Scene:</h4>
                  <p>
                    A dark, cyberpunk-themed canvas with a 3D grid floor/background. Add a
                    glowing purple/pink neon 'scanner' beam that moves across the scene.
                  </p>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold text-white/90">The Model:</h4>
                  <p>
                    Load a 3D helicopter model (GLTF/GLB). The helicopter should have a
                    metallic texture with neon pink glowing edges (emissive materials).
                  </p>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold text-white/90">The Animation:</h4>
                  <ul className="ml-4 space-y-2">
                    <li>
                      • On scroll, the helicopter should fly along a smooth curve (spline
                      path) towards the camera and then away.
                    </li>
                    <li>
                      • As it moves, it should rotate smoothly (pitch and yaw) to look like
                      it's banking into turns.
                    </li>
                    <li>• The main rotors should be constantly spinning at a high speed.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold text-white/90">Interaction:</h4>
                  <p>
                    Bind the progress of the helicopter's position along the path to the
                    window scroll progress.
                  </p>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold text-white/90">Visuals:</h4>
                  <p>
                    Add 'speed lines' or floating icons (skulls, lightning bolts) in the
                    background that parallax as the user scrolls. Ensure the lighting is
                    dramatic with a strong purple rim light on the helicopter.
                  </p>
                </div>
              </div>
            </div>

            {/* Key Technical Components */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-sm font-semibold tracking-[0.2em] text-white/90 uppercase">
                  Key Technical Components
                </h3>
                <p className="mb-6 text-sm text-white/60">
                  If you are building this yourself, here are the three pillars you'll need
                  to implement:
                </p>

                <div className="grid gap-4 md:grid-cols-3">
                  {/* Component 1 */}
                  <div className="rounded border border-white/5 bg-white/[0.01] p-5 backdrop-blur-sm">
                    <h4 className="mb-2 text-xs font-semibold tracking-[0.1em] text-white/80 uppercase">
                      Three.js Renderer
                    </h4>
                    <p className="text-xs leading-relaxed text-white/50">
                      To handle the 3D helicopter. You'll likely want to use
                      MeshStandardMaterial with a high emissiveIntensity to get that glowing
                      pink look.
                    </p>
                  </div>

                  {/* Component 2 */}
                  <div className="rounded border border-white/5 bg-white/[0.01] p-5 backdrop-blur-sm">
                    <h4 className="mb-2 text-xs font-semibold tracking-[0.1em] text-white/80 uppercase">
                      CatmullRomCurve3
                    </h4>
                    <p className="text-xs leading-relaxed text-white/50">
                      This is the Three.js class used to define the "invisible path" the
                      helicopter flies along.
                    </p>
                  </div>

                  {/* Component 3 */}
                  <div className="rounded border border-white/5 bg-white/[0.01] p-5 backdrop-blur-sm">
                    <h4 className="mb-2 text-xs font-semibold tracking-[0.1em] text-white/80 uppercase">
                      GSAP ScrollTrigger
                    </h4>
                    <p className="text-xs leading-relaxed text-white/50">
                      This is the industry standard for linking animations to scroll.
                    </p>
                  </div>
                </div>

                {/* Logic snippet */}
                <div className="mt-4 rounded border border-white/5 bg-white/[0.01] p-4 font-mono text-xs text-white/40 backdrop-blur-sm">
                  <p className="text-white/60">scrollTrigger: {'{'}trigger: ".container", scrub: 1{'}'}</p>
                  <p className="mt-1 text-white/50">
                    This ensures the helicopter only moves when the user moves their mouse
                    wheel.
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendation for Assets */}
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm">
              <h3 className="mb-4 text-sm font-semibold tracking-[0.2em] text-white/90 uppercase">
                Recommendation for Assets
              </h3>
              <p className="text-sm leading-relaxed text-white/70">
                Since you are replacing the rabbit with a helicopter, you will need a .glb
                or .gltf file of a helicopter. You can find free cyberpunk-style models on{' '}
                <span className="text-white/80">Sketchfab</span> or{' '}
                <span className="text-white/80">Poly Haven</span>.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
