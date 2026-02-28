'use client'

import { useTheme } from './ThemeContext'
import { useEffect, useRef, useState } from 'react'

export default function NeoBrutalistBackground() {
    const { theme } = useTheme()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    useEffect(() => {
        if (!mounted || theme !== 'light' || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let width = window.innerWidth
        let height = window.innerHeight
        canvas.width = width
        canvas.height = height

        // 5 Brand Colors for Data Pulses
        const colors = ['#6C3BFF', '#00A3FF', '#00FF9D', '#FF6B3B', '#FFD700']

        class Particle {
            x: number
            y: number
            vx: number
            vy: number
            size: number

            constructor() {
                this.x = Math.random() * width
                this.y = Math.random() * height
                this.vx = (Math.random() - 0.5) * 0.5
                this.vy = (Math.random() - 0.5) * 0.5
                this.size = Math.random() * 2 + 1.5
            }

            update() {
                this.x += this.vx
                this.y += this.vy

                if (this.x < 0 || this.x > width) this.vx *= -1
                if (this.y < 0 || this.y > height) this.vy *= -1
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = '#000000'
                ctx.fill()
            }
        }

        const particles: Particle[] = []
        const numParticles = Math.floor((width * height) / 12000)
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle())
        }

        let mouse = { x: -1000, y: -1000 }
        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX
            mouse.y = e.clientY
        }
        window.addEventListener('mousemove', handleMouseMove)

        const handleResize = () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height
        }
        window.addEventListener('resize', handleResize)

        type Pulse = { p1: Particle; p2: Particle; progress: number; speed: number; color: string }
        let pulses: Pulse[] = []

        const draw = () => {
            ctx.clearRect(0, 0, width, height)

            // Draw faint brutalist grid
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)'
            ctx.lineWidth = 1
            ctx.beginPath()
            for (let x = 0; x < width; x += 40) {
                ctx.moveTo(x, 0)
                ctx.lineTo(x, height)
            }
            for (let y = 0; y < height; y += 40) {
                ctx.moveTo(0, y)
                ctx.lineTo(width, y)
            }
            ctx.stroke()

            // Update particles & draw connections
            for (let i = 0; i < particles.length; i++) {
                particles[i].update()
                particles[i].draw(ctx)

                // Mouse repel logic
                const dx = mouse.x - particles[i].x
                const dy = mouse.y - particles[i].y
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist < 120) {
                    particles[i].x -= dx * 0.02
                    particles[i].y -= dy * 0.02
                }

                for (let j = i + 1; j < particles.length; j++) {
                    const dx2 = particles[i].x - particles[j].x
                    const dy2 = particles[i].y - particles[j].y
                    const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)

                    if (dist2 < 140) {
                        ctx.beginPath()
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.strokeStyle = `rgba(0, 0, 0, ${1 - dist2 / 140})`
                        // Thicker connection lines for brutalism
                        ctx.lineWidth = 1.5
                        ctx.stroke()

                        // Randomly spawn data pulses along connections
                        if (Math.random() < 0.0005) {
                            pulses.push({
                                p1: particles[i],
                                p2: particles[j],
                                progress: 0,
                                speed: Math.random() * 0.02 + 0.01,
                                color: colors[Math.floor(Math.random() * colors.length)]
                            })
                        }
                    }
                }
            }

            // Draw pulses
            for (let k = pulses.length - 1; k >= 0; k--) {
                const pulse = pulses[k]
                pulse.progress += pulse.speed

                if (pulse.progress >= 1) {
                    pulses.splice(k, 1)
                    continue
                }

                const px = pulse.p1.x + (pulse.p2.x - pulse.p1.x) * pulse.progress
                const py = pulse.p1.y + (pulse.p2.y - pulse.p1.y) * pulse.progress

                ctx.beginPath()
                ctx.arc(px, py, 4, 0, Math.PI * 2)
                ctx.fillStyle = pulse.color
                ctx.shadowColor = pulse.color
                ctx.shadowBlur = 10
                ctx.fill()
                ctx.shadowBlur = 0 // Reset
            }

            animationFrameId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(animationFrameId)
        }
    }, [theme, mounted])

    if (!mounted || theme !== 'light') return null

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0, // Behind content
                pointerEvents: 'none',
                backgroundColor: '#ffffff'
            }}
        />
    )
}
