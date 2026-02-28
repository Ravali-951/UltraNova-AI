'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import Link from 'next/link'
import GlowButton from '../components/GlowButton'
import GlassPanel from '../components/GlassPanel'

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

/* ─── Signal Canvas — unique visual signature ─── */
function SignalCanvas({ formProgress, roleColor }: { formProgress: number; roleColor: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animRef = useRef(0)
    const pointsRef = useRef<Array<{ x: number; y: number; angle: number; speed: number; radius: number }>>([])

    const initPoints = useCallback(() => {
        const pts = []
        for (let i = 0; i < 60; i++) {
            pts.push({
                x: 0,
                y: 0,
                angle: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.02 + 0.005,
                radius: Math.random() * 80 + 20,
            })
        }
        pointsRef.current = pts
    }, [])

    useEffect(() => { initPoints() }, [initPoints])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const dpr = window.devicePixelRatio || 1
        canvas.width = 250 * dpr
        canvas.height = 250 * dpr
        ctx.scale(dpr, dpr)

        const animate = () => {
            ctx.clearRect(0, 0, 250, 250)
            const cx = 125, cy = 125
            const pts = pointsRef.current
            const activeCount = Math.floor(pts.length * formProgress)

            for (let i = 0; i < activeCount; i++) {
                const p = pts[i]
                p.angle += p.speed
                p.x = cx + Math.cos(p.angle) * p.radius * (0.5 + formProgress * 0.5)
                p.y = cy + Math.sin(p.angle) * p.radius * (0.5 + formProgress * 0.5)

                ctx.beginPath()
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
                ctx.fillStyle = roleColor
                ctx.fill()

                for (let j = i + 1; j < activeCount; j++) {
                    const p2 = pts[j]
                    const dx = p.x - p2.x, dy = p.y - p2.y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < 80) {
                        ctx.beginPath()
                        ctx.moveTo(p.x, p.y)
                        ctx.lineTo(p2.x, p2.y)
                        ctx.strokeStyle = 'rgba(108, 59, 255, 0.12)'
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }
                }
            }

            if (formProgress > 0) {
                const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50 + formProgress * 50)
                gradient.addColorStop(0, `rgba(108, 59, 255, ${0.1 * formProgress})`)
                gradient.addColorStop(1, 'transparent')
                ctx.beginPath()
                ctx.arc(cx, cy, 50 + formProgress * 50, 0, Math.PI * 2)
                ctx.fillStyle = gradient
                ctx.fill()
            }

            animRef.current = requestAnimationFrame(animate)
        }
        animate()
        return () => cancelAnimationFrame(animRef.current)
    }, [formProgress, roleColor])

    return (
        <canvas
            ref={canvasRef}
            style={{ width: 250, height: 250, display: 'block', margin: '0 auto' }}
        />
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

    const roleColor = ROLES.find((r) => r.value === formData.role)?.color || '#6C3BFF'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')
        setErrorMsg('')
        try {
            const response = await axios.post('http://localhost:8000/waitlist/join', {
                name: formData.name, email: formData.email, role: formData.role,
                idea_description: formData.idea_description, stage: formData.stage,
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
        background: 'rgba(10, 10, 15, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: 8,
        color: '#F0F0FF',
        fontFamily: "'Inter', sans-serif",
        fontSize: 15,
        outline: 'none',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        boxSizing: 'border-box' as const,
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', zIndex: 2 }}>
            <div style={{ maxWidth: 560, width: '100%', margin: '0 auto' }}>

                {status === 'success' ? (
                    <GlassPanel glow style={{ padding: 48, textAlign: 'center' }}>
                        <div style={{ marginBottom: 24 }}>
                            <SignalCanvas formProgress={1} roleColor="rgba(0, 255, 157, 0.8)" />
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
                ) : (
                    <GlassPanel glow style={{ padding: '36px 32px' }}>
                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: 28 }}>
                            <SignalCanvas formProgress={formProgress} roleColor={formData.role === '' ? 'rgba(108, 59, 255, 0.8)' : `${roleColor}`} />
                            <h1 style={{
                                fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 8,
                                background: 'linear-gradient(135deg, #6C3BFF, #00A3FF)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            }}>
                                Create Your Neural Signature
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                                Each field you fill strengthens your signal in the founder constellation.
                            </p>
                        </div>

                        {/* Progress */}
                        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
                            {[0, 1, 2, 3].map((i) => (
                                <div key={i} style={{
                                    flex: 1, height: 3, borderRadius: 2, transition: 'all 0.7s ease',
                                    background: i < filledFields ? '#6C3BFF' : 'rgba(255,255,255,0.06)',
                                    boxShadow: i < filledFields ? '0 0 10px rgba(108,59,255,0.3)' : 'none',
                                }} />
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                            {/* Name */}
                            <div>
                                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#555577', marginBottom: 8 }}>Name</label>
                                <input type="text" placeholder="What should we call you?" style={inputStyle}
                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required
                                    onFocus={(e) => { e.currentTarget.style.borderColor = '#6C3BFF'; e.currentTarget.style.boxShadow = '0 0 20px rgba(108,59,255,0.15)' }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none' }}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#555577', marginBottom: 8 }}>Email</label>
                                <input type="email" placeholder="your@email.com" style={inputStyle}
                                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required
                                    onFocus={(e) => { e.currentTarget.style.borderColor = '#6C3BFF'; e.currentTarget.style.boxShadow = '0 0 20px rgba(108,59,255,0.15)' }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none' }}
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#555577', marginBottom: 10 }}>Role</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                                    {ROLES.map((r) => {
                                        const isSelected = formData.role === r.value
                                        return (
                                            <button key={r.value} type="button"
                                                onClick={() => setFormData({ ...formData, role: r.value })}
                                                style={{
                                                    padding: '12px 8px', borderRadius: 12, textAlign: 'center', cursor: 'pointer',
                                                    background: isSelected ? `${r.color}15` : 'rgba(10, 10, 15, 0.6)',
                                                    border: `1px solid ${isSelected ? `${r.color}60` : 'rgba(255,255,255,0.06)'}`,
                                                    boxShadow: isSelected ? `0 0 20px ${r.color}20` : 'none',
                                                    transition: 'all 0.3s ease',
                                                }}
                                            >
                                                <span style={{ fontSize: 18, display: 'block', marginBottom: 4 }}>{r.icon}</span>
                                                <span style={{ fontSize: 11, fontWeight: 600, color: isSelected ? r.color : '#8888AA' }}>{r.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Idea */}
                            <div>
                                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#555577', marginBottom: 8 }}>What do you want to build?</label>
                                <textarea placeholder="Describe your startup idea..." rows={4}
                                    style={{ ...inputStyle, resize: 'none', minHeight: 100 }}
                                    value={formData.idea_description} onChange={(e) => setFormData({ ...formData, idea_description: e.target.value })} required
                                    onFocus={(e) => { e.currentTarget.style.borderColor = '#6C3BFF'; e.currentTarget.style.boxShadow = '0 0 20px rgba(108,59,255,0.15)' }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none' }}
                                />
                            </div>

                            {/* Stage */}
                            <div>
                                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#555577', marginBottom: 8 }}>Stage</label>
                                <select style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' as const }}
                                    value={formData.stage} onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                                >
                                    {STAGES.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
                                </select>
                            </div>

                            {/* Error */}
                            {status === 'error' && (
                                <div style={{ padding: 16, borderRadius: 12, fontSize: 13, background: 'rgba(255,59,59,0.08)', border: '1px solid rgba(255,59,59,0.2)', color: '#FF3B3B' }}>
                                    {errorMsg}
                                </div>
                            )}

                            {/* Submit */}
                            <GlowButton type="submit" variant="primary" size="lg" disabled={status === 'loading' || filledFields < 4}
                                className="w-full" >
                                {status === 'loading' ? '⚙️ Activating...' : '⚡ ACTIVATE BEACON ⚡'}
                            </GlowButton>
                        </form>
                    </GlassPanel>
                )}
            </div>
        </div>
    )
}
