'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import Link from 'next/link'
import GlowButton from '../components/GlowButton'
import GlassPanel from '../components/GlassPanel'
import { useTheme } from '../components/ThemeContext'

const ROLES = [
    { value: 'founder', label: 'Founder', color: '#6C3BFF', icon: '🚀' },
    { value: 'developer', label: 'Developer', color: '#00A3FF', icon: '⚡' },
    { value: 'marketer', label: 'Marketer', color: '#FF6B3B', icon: '🔥' },
    { value: 'other', label: 'Other', color: '#E0E0FF', icon: '✨' },
]

const STAGES = [
    { value: '', label: 'Current stage (optional)' },
    { value: 'idea', label: 'Just an idea' },
    { value: 'mvp', label: 'Building MVP' },
    { value: 'revenue', label: 'Generating revenue' },
]

import { StaggerContainer, StaggerItem } from '../components/PageAnimate'

/* ─── Signal Canvas — Neural Kinetic Orbit ─── */
function SignalCanvas({ formProgress, roleColor }: { formProgress: number; roleColor: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animRef = useRef(0)
    const particlesRef = useRef<Array<{
        x: number; y: number; z: number;
        angle: number; speed: number; orbit: number; size: number;
        opacity: number; glow: string
    }>>([])

    const initParticles = useCallback(() => {
        const pts = []
        for (let i = 0; i < 120; i++) {
            pts.push({
                x: 0, y: 0, z: Math.random() * 200 - 100,
                angle: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.015 + 0.005,
                orbit: Math.random() * 80 + 30,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                glow: `rgba(108, 59, 255, ${Math.random() * 0.3})`
            })
        }
        particlesRef.current = pts
    }, [])

    useEffect(() => { initParticles() }, [initParticles])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const dpr = window.devicePixelRatio || 1
        const size = 280
        canvas.width = size * dpr
        canvas.height = size * dpr
        ctx.scale(dpr, dpr)

        const animate = () => {
            ctx.clearRect(0, 0, size, size)
            const cx = size / 2, cy = size / 2
            const pts = particlesRef.current
            
            // Helper to handle alpha with hex colors safely
            const getRGB = (hex: string, alpha: number) => {
                const r = parseInt(hex.slice(1, 3), 16)
                const g = parseInt(hex.slice(3, 5), 16)
                const b = parseInt(hex.slice(5, 7), 16)
                return `rgba(${r}, ${g}, ${b}, ${alpha})`
            }

            // Interaction factor: animation speeds up and expands as you fill the form
            const intensity = 0.5 + (formProgress * 1.5)
            const focus = 150 // Perspective focus

            // Draw connections first
            ctx.beginPath()
            for (let i = 0; i < pts.length * (0.2 + formProgress * 0.8); i++) {
                const p = pts[i]
                p.angle += p.speed * (1 + formProgress)
                
                // 3D Orbital Projection
                const x3d = Math.cos(p.angle) * p.orbit * intensity
                const y3d = Math.sin(p.angle * 0.5) * (p.orbit * 0.4) * intensity
                const z3d = Math.sin(p.angle) * p.orbit * intensity
                
                const perspective = focus / (focus + z3d)
                p.x = cx + x3d * perspective
                p.y = cy + y3d * perspective
                
                const connectionRange = 50 * perspective
                
                for (let j = i + 1; j < Math.min(i + 5, pts.length); j++) {
                    const p2 = pts[j]
                    if (!p2.x) continue
                    const dx = p.x - p2.x, dy = p.y - p2.y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    
                    if (dist < connectionRange) {
                        ctx.moveTo(p.x, p.y)
                        ctx.lineTo(p2.x, p2.y)
                    }
                }
            }
            ctx.strokeStyle = getRGB(roleColor, 0.12)
            ctx.lineWidth = 0.5
            ctx.stroke()

            // Draw core glow
            const pulse = Math.sin(Date.now() / 800) * 10
            const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, (40 + pulse) * intensity)
            coreGrad.addColorStop(0, getRGB(roleColor, 0.2))
            coreGrad.addColorStop(1, 'transparent')
            ctx.fillStyle = coreGrad
            ctx.fillRect(0, 0, size, size)

            // Draw particles
            pts.forEach((p, i) => {
                if (i > pts.length * (0.3 + formProgress * 0.7)) return
                
                const zFactor = (focus / (focus + Math.sin(p.angle) * p.orbit))
                const visualSize = p.size * zFactor * (0.8 + formProgress * 0.4)
                
                ctx.beginPath()
                ctx.arc(p.x, p.y, visualSize, 0, Math.PI * 2)
                ctx.fillStyle = i % 5 === 0 ? roleColor : 'rgba(255, 255, 255, 0.8)'
                ctx.shadowBlur = 10 * zFactor
                ctx.shadowColor = roleColor
                ctx.fill()
                ctx.shadowBlur = 0
            })

            animRef.current = requestAnimationFrame(animate)
        }
        animate()
        return () => cancelAnimationFrame(animRef.current)
    }, [formProgress, roleColor])

    return (
        <div style={{ position: 'relative', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <canvas
                ref={canvasRef}
                style={{ width: 280, height: 280, display: 'block', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}
            />
            {/* Center Role Icon / Branding Node */}
            <div style={{
                width: 60, height: 60, borderRadius: '50%', 
                background: roleColor, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                boxShadow: `0 0 30px ${roleColor}60`,
                zIndex: 1, 
                animation: 'pulse 3s infinite ease-in-out',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                {ROLES.find(r => r.color === roleColor)?.icon || '✨'}
            </div>
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); filter: brightness(1); }
                    50% { transform: scale(1.1); filter: brightness(1.2); }
                    100% { transform: scale(1); filter: brightness(1); }
                }
            `}</style>
        </div>
    )
}

export default function WaitlistPage() {
    const [formData, setFormData] = useState({
        name: '', email: '', role: '', idea_description: '', stage: '',
    })
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [errorMsg, setErrorMsg] = useState('')

    const filledFields = [
        formData.name.length > 0,
        formData.email.length > 0,
        formData.role.length > 0,
        formData.idea_description.length > 0,
    ].filter(Boolean).length
    const formProgress = filledFields / 4

    const { theme } = useTheme()
    const isDark = theme === 'dark'

    const roleColor = ROLES.find((r) => r.value === formData.role)?.color || '#6C3BFF'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')
        setErrorMsg('')
        try {
            const response = await axios.post('http://localhost:8000/waitlist/join', {
                name: formData.name, 
                email: formData.email, 
                role: formData.role,
                idea_description: formData.idea_description, 
                stage: formData.stage === '' ? null : formData.stage, // Map empty string to null for backend str = None
            })
            console.log('Success:', response.data)
            setStatus('success')
            setFormData({ name: '', email: '', role: '', idea_description: '', stage: '' })
        } catch (error: unknown) {
            console.error('Error:', error)
            if (axios.isAxiosError(error)) {
                setErrorMsg(error.response?.data?.detail || 'Something went wrong')
            } else {
                setErrorMsg('Something went wrong')
            }
            setStatus('error')
        }
    }

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '14px 18px',
        background: 'var(--input-bg)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--text-primary)',
        fontFamily: "'Inter', sans-serif",
        fontSize: 15,
        outline: 'none',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box' as const,
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 2, overflowY: 'auto' }}>
            <div style={{ maxWidth: 760, width: '100%', margin: '0 auto' }}>

                {status === 'success' ? (
                    <StaggerItem>
                        <GlassPanel glow style={{ padding: 48, textAlign: 'center' }}>
                            <div style={{ marginBottom: 24 }}>
                                <SignalCanvas formProgress={1} roleColor="#00FF9D" />
                            </div>
                            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 700, color: '#00FF9D', marginBottom: 16 }}>
                                Your Beacon is Lit 🌟
                            </h2>
                            <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 8 }}>
                                You&apos;ve joined the constellation of founders.
                            </p>
                            <p style={{ fontSize: 13, color: '#555577', marginBottom: 32 }}>
                                Check your email for confirmation and next steps.
                            </p>
                            <Link href="/" style={{ textDecoration: 'none' }}>
                                <GlowButton variant="outline">Return to Home</GlowButton>
                            </Link>
                        </GlassPanel>
                    </StaggerItem>
                ) : (
                    <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
                        {/* ─── Neural Step Indicator (Reference Image Style) ─── */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40, position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 60, bottom: 40, width: 2, background: 'rgba(255,255,255,0.05)', zIndex: 0 }} />
                            
                            {[
                                { n: '01', color: '#6C3BFF', active: filledFields >= 1 },
                                { n: '02', color: '#00A3FF', active: filledFields >= 2 },
                                { n: '03', color: '#00FF9D', active: filledFields >= 3 },
                                { n: '04', color: '#FF6B3B', active: filledFields >= 4 },
                            ].map((step, i) => (
                                <div key={step.n} style={{ 
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', 
                                    marginBottom: i === 3 ? 0 : 50, zIndex: 1 
                                }}>
                                    <div style={{
                                        width: 50, height: 50, borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 14, fontWeight: 900, fontFamily: 'monospace',
                                        color: step.active ? step.color : 'rgba(255,255,255,0.2)',
                                        border: `2px solid ${step.active ? step.color : 'rgba(255,255,255,0.08)'}`,
                                        background: step.active ? `${step.color}15` : 'rgba(255,255,255,0.03)',
                                        boxShadow: step.active ? `0 0 25px ${step.color}40, inset 0 0 15px ${step.color}20` : 'none',
                                        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                        backdropFilter: 'blur(10px)'
                                    }}>
                                        {step.n}
                                    </div>
                                    {i < 3 && (
                                        <div style={{ 
                                            position: 'absolute', 
                                            top: 50 + (i * 100), 
                                            width: 2, height: 50, 
                                            background: `linear-gradient(to bottom, ${step.color}${step.active ? 'ff' : '10'}, ${filledFields > i+1 ? '#00A3FF' : 'transparent'})`,
                                            opacity: 0.6
                                        }} />
                                    )}
                                </div>
                            ))}
                        </div>

                        <StaggerContainer>
                            <GlassPanel glow style={{ padding: '32px 40px', flex: 1 }}>
                                {/* Header & Animation */}
                                <StaggerItem>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 40, marginBottom: 28, textAlign: 'left' }}>
                                        <div style={{ flex: '0 0 160px' }}>
                                            <SignalCanvas 
                                                formProgress={formProgress} 
                                                roleColor={formData.role === '' ? '#6C3BFF' : roleColor} 
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h1 style={{
                                                fontFamily: "'Outfit', sans-serif", fontSize: 32, fontWeight: 700, marginBottom: 8,
                                                background: 'linear-gradient(135deg, #6C3BFF, #00A3FF)',
                                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                            }}>
                                                Create Your Neural Signature
                                            </h1>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.5 }}>
                                                Join the constellation of founders. Every field you fill strengthens your cognitive signal.
                                            </p>
                                        </div>
                                    </div>
                                </StaggerItem>

                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    {/* Row 1: Name & Email */}
                                    <StaggerItem>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 8 }}>Name</label>
                                                <input type="text" placeholder="What should we call you?" style={inputStyle}
                                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required
                                                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--nova-core)'; e.currentTarget.style.boxShadow = '0 0 20px var(--nova-core-dim)' }}
                                                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 8 }}>Email</label>
                                                <input type="email" placeholder="your@email.com" style={inputStyle}
                                                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required
                                                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--nova-core)'; e.currentTarget.style.boxShadow = '0 0 20px var(--nova-core-dim)' }}
                                                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none' }}
                                                />
                                            </div>
                                        </div>
                                    </StaggerItem>

                                    {/* Row 2: Role Selection (Full Width) */}
                                    <StaggerItem>
                                        <div>
                                            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 10 }}>Role</label>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                                                {ROLES.map((r) => {
                                                    const isSelected = formData.role === r.value
                                                    const selectionStyle: React.CSSProperties = isSelected ? (
                                                        isDark ? {
                                                            background: `${r.color}25`,
                                                            border: `1.5px solid ${r.color}`,
                                                            boxShadow: `0 0 25px ${r.color}35`,
                                                            transform: 'translateY(-2px)'
                                                        } : {
                                                            background: `${r.color}15`,
                                                            border: `3px solid ${r.color}`,
                                                            boxShadow: `4px 4px 0px ${r.color}`,
                                                            transform: 'translate(-2px, -2px)'
                                                        }
                                                    ) : {
                                                        background: 'var(--inner-card-bg)',
                                                        border: '1px solid var(--border-subtle)',
                                                        transform: 'none'
                                                    }

                                                    return (
                                                        <button key={r.value} type="button"
                                                            onClick={() => setFormData({ ...formData, role: r.value })}
                                                            style={{
                                                                padding: '12px 8px', borderRadius: 12, textAlign: 'center', cursor: 'pointer',
                                                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                                position: 'relative',
                                                                ...selectionStyle
                                                            }}
                                                        >
                                                            <span style={{ fontSize: 18, display: 'block', marginBottom: 4 }}>{r.icon}</span>
                                                            <span style={{ fontSize: 11, fontWeight: 800, color: isSelected ? r.color : 'var(--text-secondary)', textTransform: 'uppercase' }}>{r.label}</span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </StaggerItem>

                                    {/* Row 3: Idea & Stage (Dual Column) */}
                                    <StaggerItem>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 8 }}>Startup Idea</label>
                                                <textarea placeholder="Briefly describe what you're building..." rows={2}
                                                    style={{ ...inputStyle, resize: 'none', minHeight: 60 }}
                                                    value={formData.idea_description} onChange={(e) => setFormData({ ...formData, idea_description: e.target.value })} required
                                                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--nova-core)'; e.currentTarget.style.boxShadow = '0 0 20px var(--nova-core-dim)' }}
                                                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 8 }}>Current Stage</label>
                                                <select style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' as const, height: 60 }}
                                                    value={formData.stage} onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                                                >
                                                    {STAGES.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
                                                </select>
                                            </div>
                                        </div>
                                    </StaggerItem>

                                    {/* Submit Button */}
                                    <StaggerItem>
                                        <GlowButton type="submit" variant="primary" size="lg" disabled={status === 'loading' || filledFields < 4}
                                            className="w-full" >
                                            {status === 'loading' ? '⚙️ Activating...' : '⚡ ACTIVATE BEACON ⚡'}
                                        </GlowButton>
                                    </StaggerItem>
                                </form>
                            </GlassPanel>
                        </StaggerContainer>
                    </div>
                )}
            </div>
        </div>
    )
}
