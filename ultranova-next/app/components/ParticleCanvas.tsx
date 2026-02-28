'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    size: number
    opacity: number
    hue: number
    pulse: number
    pulseSpeed: number
}

interface ParticleCanvasProps {
    particleCount?: number
    interactive?: boolean
    baseHue?: number
    className?: string
}

export default function ParticleCanvas({
    particleCount = 120,
    interactive = true,
    baseHue = 260,
    className = '',
}: ParticleCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouseRef = useRef({ x: -1000, y: -1000 })
    const particlesRef = useRef<Particle[]>([])
    const animFrameRef = useRef<number>(0)

    const initParticles = useCallback(
        (width: number, height: number) => {
            const particles: Particle[] = []
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    size: Math.random() * 2 + 0.5,
                    opacity: Math.random() * 0.5 + 0.1,
                    hue: baseHue + (Math.random() - 0.5) * 40,
                    pulse: Math.random() * Math.PI * 2,
                    pulseSpeed: Math.random() * 0.02 + 0.005,
                })
            }
            particlesRef.current = particles
        },
        [particleCount, baseHue]
    )

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resize = () => {
            const dpr = window.devicePixelRatio || 1
            const rect = canvas.getBoundingClientRect()
            canvas.width = rect.width * dpr
            canvas.height = rect.height * dpr
            ctx.scale(dpr, dpr)
            canvas.style.width = `${rect.width}px`
            canvas.style.height = `${rect.height}px`
            initParticles(rect.width, rect.height)
        }

        resize()
        window.addEventListener('resize', resize)

        const handleMouseMove = (e: MouseEvent) => {
            if (!interactive) return
            const rect = canvas.getBoundingClientRect()
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
        }

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 }
        }

        window.addEventListener('mousemove', handleMouseMove)
        canvas.addEventListener('mouseleave', handleMouseLeave)

        const connectionDistance = 120

        const animate = () => {
            const rect = canvas.getBoundingClientRect()
            const w = rect.width
            const h = rect.height

            ctx.clearRect(0, 0, w, h)

            const particles = particlesRef.current
            const mouse = mouseRef.current

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i]

                // Update
                p.pulse += p.pulseSpeed
                p.x += p.vx
                p.y += p.vy

                // Mouse interaction — gentle repel + attract
                if (interactive && mouse.x > 0) {
                    const dx = mouse.x - p.x
                    const dy = mouse.y - p.y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < 200 && dist > 0) {
                        const force = (200 - dist) / 200
                        p.vx += (dx / dist) * force * 0.01
                        p.vy += (dy / dist) * force * 0.01
                    }
                }

                // Boundaries — wrap
                if (p.x < -10) p.x = w + 10
                if (p.x > w + 10) p.x = -10
                if (p.y < -10) p.y = h + 10
                if (p.y > h + 10) p.y = -10

                // Damping
                p.vx *= 0.99
                p.vy *= 0.99

                // Draw particle
                const currentOpacity = p.opacity + Math.sin(p.pulse) * 0.15
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${Math.max(0, currentOpacity)})`
                ctx.fill()

                // Glow
                if (p.size > 1.2) {
                    ctx.beginPath()
                    ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
                    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
                    grd.addColorStop(0, `hsla(${p.hue}, 80%, 65%, ${currentOpacity * 0.3})`)
                    grd.addColorStop(1, `hsla(${p.hue}, 80%, 65%, 0)`)
                    ctx.fillStyle = grd
                    ctx.fill()
                }

                // Connections
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j]
                    const cdx = p.x - p2.x
                    const cdy = p.y - p2.y
                    const cdist = Math.sqrt(cdx * cdx + cdy * cdy)

                    if (cdist < connectionDistance) {
                        const alpha = (1 - cdist / connectionDistance) * 0.15
                        ctx.beginPath()
                        ctx.moveTo(p.x, p.y)
                        ctx.lineTo(p2.x, p2.y)
                        ctx.strokeStyle = `hsla(${(p.hue + p2.hue) / 2}, 60%, 55%, ${alpha})`
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }
                }
            }

            animFrameRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            cancelAnimationFrame(animFrameRef.current)
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', handleMouseMove)
            canvas.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [interactive, initParticles])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 'var(--particle-opacity)' as unknown as number,
                transition: 'opacity 0.5s ease',
            }}
        />
    )
}
