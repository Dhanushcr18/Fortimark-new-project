'use client'

import { useEffect, useRef } from 'react'
import * as THREE_API from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function HelicopterScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    // Dynamic import to handle Next.js SSR  
    import('three').then((ThreeModule) => {
      const THREE = ThreeModule as typeof THREE_API

      // Scene setup
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x0a0a0a)
      scene.fog = new THREE.Fog(0x0a0a0a, 150, 500)

      // Camera setup
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      camera.position.set(0, 5, 15)
      camera.lookAt(0, 0, 0)

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current!,
        antialias: true,
        alpha: false,
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFShadowMap

      // Lighting - Cyberpunk theme
      const keyLight = new THREE.DirectionalLight(0xff00ff, 1.5)
      keyLight.position.set(10, 15, 10)
      keyLight.castShadow = true
      keyLight.shadow.mapSize.width = 2048
      keyLight.shadow.mapSize.height = 2048
      scene.add(keyLight)

      const rimLight = new THREE.DirectionalLight(0xaa00ff, 1.2)
      rimLight.position.set(-15, 10, -10)
      scene.add(rimLight)

      const fillLight = new THREE.DirectionalLight(0x00ffff, 0.6)
      fillLight.position.set(-10, 5, 15)
      scene.add(fillLight)

      const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.8)
      scene.add(ambientLight)

      // Grid floor
      const gridHelper = new THREE.GridHelper(30, 30, 0xff00ff, 0x3d0040)
      gridHelper.position.y = -5
      ;(gridHelper.material as any).transparent = true
      ;(gridHelper.material as any).opacity = 0.15
      scene.add(gridHelper)

      // Ground plane
      const groundGeometry = new THREE.PlaneGeometry(100, 100)
      const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x0d0d1a,
        metalness: 0.3,
        roughness: 0.8,
      })
      const ground = new THREE.Mesh(groundGeometry, groundMaterial)
      ground.rotation.x = -Math.PI / 2
      ground.position.y = -5
      ground.receiveShadow = true
      scene.add(ground)

      // Scanner beam
      const beamGeometry = new THREE.BufferGeometry()
      const beamPositions = new Float32Array([-50, 0, 0, 50, 0, 0])
      beamGeometry.setAttribute('position', new THREE.BufferAttribute(beamPositions, 3))
      const beamMaterial = new THREE.LineBasicMaterial({
        color: 0xff00ff,
        transparent: true,
        opacity: 0.6,
      })
      const beamLine = new THREE.Line(beamGeometry, beamMaterial)
      beamLine.position.z = -5
      scene.add(beamLine)

      // Floating elements
      const floatingElements: any[] = []
      for (let i = 0; i < 8; i++) {
        const geometry = new THREE.IcosahedronGeometry(0.3, 2)
        const material = new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? 0xff00ff : 0x00ffff,
          emissive: i % 2 === 0 ? 0xff00ff : 0x00ffff,
          emissiveIntensity: 0.8,
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 30 + 5,
          (Math.random() - 0.5) * 40 - 20
        )
        floatingElements.push(mesh)
        scene.add(mesh)
      }

      // Helicopter model (box + rotor)
      const helicopterGeometry = new THREE.BoxGeometry(2, 1, 3)
      const helicopterMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a3a,
        metalness: 0.95,
        roughness: 0.2,
        emissive: 0xff00ff,
        emissiveIntensity: 0.5,
      })
      const helicopter = new THREE.Mesh(helicopterGeometry, helicopterMaterial)
      helicopter.castShadow = true
      helicopter.receiveShadow = true
      
      const helicopterGroup = new THREE.Group()
      helicopterGroup.add(helicopter)

      // Rotor
      const rotorGeometry = new THREE.BoxGeometry(3, 0.1, 0.5)
      const rotorMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        metalness: 0.9,
        emissive: 0xff00ff,
        emissiveIntensity: 0.4,
      })
      const rotor = new THREE.Mesh(rotorGeometry, rotorMaterial)
      rotor.position.y = 0.8
      rotor.castShadow = true
      helicopterGroup.add(rotor)

      scene.add(helicopterGroup)

      // Spline path
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 30),
        new THREE.Vector3(15, 8, 15),
        new THREE.Vector3(20, 12, 0),
        new THREE.Vector3(15, 10, -15),
        new THREE.Vector3(0, 5, -20),
        new THREE.Vector3(-15, 8, -15),
        new THREE.Vector3(-20, 12, 0),
        new THREE.Vector3(-15, 10, 15),
        new THREE.Vector3(0, 0, 30),
      ])

      // GSAP ScrollTrigger animation
      const proxy = { scrollProgress: 0 }
      gsap.to(proxy, {
        scrollProgress: 1,
        scrollTrigger: {
          trigger: containerRef.current!,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
        onUpdate: () => {
          const point = curve.getPoint(proxy.scrollProgress)
          helicopterGroup.position.copy(point)

          const nextProgress = Math.min(proxy.scrollProgress + 0.01, 1)
          const nextPoint = curve.getPoint(nextProgress)
          const direction = new THREE.Vector3()
            .subVectors(nextPoint, point)
            .normalize()

          const angle = Math.atan2(direction.x, direction.z)
          helicopterGroup.rotation.y = angle
          helicopterGroup.rotation.z = Math.sin(proxy.scrollProgress * Math.PI * 2) * 0.3
        },
      })

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate)

        rotor.rotation.z += 0.15

        floatingElements.forEach((el, i) => {
          el.rotation.x += 0.002
          el.rotation.y += 0.004
          el.position.y += Math.sin((Date.now() * 0.001 + i) * 0.5) * 0.01
        })

        beamLine.rotation.z += 0.008
        ;(beamMaterial as any).opacity = Math.sin(Date.now() * 0.003) * 0.3 + 0.5

        camera.position.x = Math.sin(Date.now() * 0.0003) * 2
        camera.position.z = 15 + Math.cos(Date.now() * 0.0002) * 1

        renderer.render(scene, camera)
      }
      animate()

      const handleResize = () => {
        const width = window.innerWidth
        const height = window.innerHeight
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        renderer.dispose()
      }
    })
  }, [containerRef])

  return (
    <section
      ref={containerRef}
      className="relative h-[600vh] w-full overflow-hidden bg-gradient-to-b from-[#0a0015] to-[#050505]"
    >
      <div className="sticky top-0 h-screen w-full">
        <canvas
          ref={canvasRef}
          className="block w-full h-full"
        />
        {/* Overlay gradient with neon */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0015]/20 via-transparent to-[#0a0015]/40" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#ff00ff]/5 via-transparent to-[#00ffff]/5" />
        
        {/* Section label */}
        <div className="pointer-events-none absolute top-12 left-12 text-[#00ffff]/60">
          <p className="text-xs tracking-[0.2em] uppercase">Scroll to animate</p>
          <h3 className="text-2xl font-thin tracking-[0.1em] mt-2 text-[#ff00ff]" style={{ textShadow: '0 0 20px rgba(255, 0, 255, 0.5)' }}>Helicopter Flight Path</h3>
        </div>
      </div>
    </section>
  )
}


