'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import GlassPanel from '../components/GlassPanel'

const DECISIONS = [
    { id: 1, title: 'Market entry strategy', theme: 'market', impact: 0.9, date: 'Jan 15, 2026', outcome: 'Go B2B first, pivot to B2C later', confidence: 78, agents: { marketing: 'agree', product: 'agree', sales: 'strongly agree', tech: 'neutral', ops: 'agree' } },
    { id: 2, title: 'MVP feature scope', theme: 'product', impact: 0.85, date: 'Jan 22, 2026', outcome: 'Ship core 3 features, defer analytics', confidence: 82, agents: { marketing: 'disagree', product: 'strongly agree', sales: 'agree', tech: 'agree', ops: 'agree' } },
    { id: 3, title: 'Hiring first engineer', theme: 'team', impact: 0.7, date: 'Feb 1, 2026', outcome: 'Hire full-stack senior, defer DevOps', confidence: 91, agents: { marketing: 'neutral', product: 'agree', sales: 'neutral', tech: 'strongly agree', ops: 'agree' } },
    { id: 4, title: 'Pricing model selection', theme: 'market', impact: 0.95, date: 'Feb 8, 2026', outcome: 'Freemium with usage-based tier', confidence: 65, agents: { marketing: 'agree', product: 'disagree', sales: 'strongly agree', tech: 'neutral', ops: 'disagree' } },
    { id: 5, title: 'Tech stack decision', theme: 'product', impact: 0.8, date: 'Feb 12, 2026', outcome: 'Next.js + FastAPI + SQLite for MVP', confidence: 94, agents: { marketing: 'neutral', product: 'agree', sales: 'neutral', tech: 'strongly agree', ops: 'agree' } },
    { id: 6, title: 'Launch timeline', theme: 'team', impact: 0.75, date: 'Feb 18, 2026', outcome: 'Soft launch March 1, public March 15', confidence: 72, agents: { marketing: 'strongly agree', product: 'agree', sales: 'agree', tech: 'disagree', ops: 'agree' } },
    { id: 7, title: 'Content marketing strategy', theme: 'market', impact: 0.6, date: 'Feb 22, 2026', outcome: 'LinkedIn + Twitter thought leadership campaign', confidence: 88, agents: { marketing: 'strongly agree', product: 'neutral', sales: 'agree', tech: 'neutral', ops: 'neutral' } },
    { id: 8, title: 'Security audit scope', theme: 'product', impact: 0.65, date: 'Feb 25, 2026', outcome: 'Critical paths only pre-launch; full audit Q2', confidence: 76, agents: { marketing: 'neutral', product: 'agree', sales: 'neutral', tech: 'agree', ops: 'strongly agree' } },
]

const THEME_COLORS: Record<string, string> = { market: '#FF6B3B', product: '#00A3FF', team: '#00FF9D' }
const THEME_RGB: Record<string, number[]> = { market: [255, 107, 59], product: [0, 163, 255], team: [0, 255, 157] }
const THEME_LABELS: Record<string, string> = { market: 'Market', product: 'Product', team: 'Team' }

function ConstellationCanvas({ decisions, selectedId, onSelect }: { decisions: typeof DECISIONS; selectedId: number | null; onSelect: (id: number) => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animRef = useRef(0)
    const nodesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; decision: typeof DECISIONS[0] }>>([])

    const initNodes = useCallback((w: number, h: number) => {
        nodesRef.current = decisions.map((d) => {
            const ox = d.theme === 'market' ? -0.2 : d.theme === 'product' ? 0 : 0.2
            const oy = d.theme === 'market' ? -0.1 : d.theme === 'product' ? 0.1 : -0.05
            return { x: w * (0.3 + ox + Math.random() * 0.4), y: h * (0.2 + oy + Math.random() * 0.6), vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15, decision: d }
        })
    }, [decisions])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resize = () => {
            const rect = canvas.parentElement?.getBoundingClientRect()
            if (!rect) return
            const dpr = window.devicePixelRatio || 1
            canvas.width = rect.width * dpr; canvas.height = rect.height * dpr
            ctx.scale(dpr, dpr)
            canvas.style.width = `${rect.width}px`; canvas.style.height = `${rect.height}px`
            initNodes(rect.width, rect.height)
        }
        resize()
        window.addEventListener('resize', resize)

        const handleClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            const mx = e.clientX - rect.left, my = e.clientY - rect.top
            for (const node of nodesRef.current) {
                const dist = Math.sqrt((mx - node.x) ** 2 + (my - node.y) ** 2)
                if (dist < (8 + node.decision.impact * 16) + 10) { onSelect(node.decision.id); return }
            }
        }
        canvas.addEventListener('click', handleClick)

        const animate = () => {
            const rect = canvas.parentElement?.getBoundingClientRect()
            if (!rect) return
            const w = rect.width, h = rect.height
            ctx.clearRect(0, 0, w, h)
            const nodes = nodesRef.current

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    if (nodes[i].decision.theme === nodes[j].decision.theme) {
                        const dist = Math.sqrt((nodes[i].x - nodes[j].x) ** 2 + (nodes[i].y - nodes[j].y) ** 2)
                        if (dist < 250) {
                            const alpha = (1 - dist / 250) * 0.2
                            const rgb = THEME_RGB[nodes[i].decision.theme]
                            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y)
                            ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`; ctx.lineWidth = 0.8; ctx.stroke()
                        }
                    }
                }
            }

            for (const node of nodes) {
                node.x += node.vx; node.y += node.vy
                if (node.x < 30 || node.x > w - 30) node.vx *= -1
                if (node.y < 30 || node.y > h - 30) node.vy *= -1

                const size = 8 + node.decision.impact * 16
                const isSelected = node.decision.id === selectedId
                const rgb = THEME_RGB[node.decision.theme]
                const glowI = isSelected ? 0.3 : 0.1

                const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size * 3)
                gradient.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${glowI})`); gradient.addColorStop(1, 'transparent')
                ctx.beginPath(); ctx.arc(node.x, node.y, size * 3, 0, Math.PI * 2); ctx.fillStyle = gradient; ctx.fill()

                ctx.beginPath(); ctx.arc(node.x, node.y, isSelected ? size * 1.3 : size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.4 + node.decision.impact * 0.5})`; ctx.fill()

                if (isSelected) {
                    ctx.beginPath(); ctx.arc(node.x, node.y, size * 1.8, 0, Math.PI * 2)
                    ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.3)`; ctx.lineWidth = 1.5; ctx.stroke()
                }
            }
            animRef.current = requestAnimationFrame(animate)
        }
        animate()
        return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); canvas.removeEventListener('click', handleClick) }
    }, [selectedId, initNodes, onSelect])

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', cursor: 'pointer' }} />
}

export default function DecisionsPage() {
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [filter, setFilter] = useState<string | null>(null)

    const filteredDecisions = filter ? DECISIONS.filter((d) => d.theme === filter) : DECISIONS
    const selected = selectedId ? DECISIONS.find((d) => d.id === selectedId) : null

    return (
        <div style={{ position: 'relative', minHeight: '100vh', padding: '24px 16px', zIndex: 2 }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>

                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}>
                    <div>
                        <h1 style={{
                            fontFamily: "'Outfit', sans-serif", fontSize: 32, fontWeight: 700, marginBottom: 8,
                            color: 'var(--text-primary)'
                        }}>
                            The Memory Palace
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>Every decision becomes a star. Click to revisit the moment.</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {[{ key: null, label: 'All' }, { key: 'market', label: 'Market' }, { key: 'product', label: 'Product' }, { key: 'team', label: 'Team' }].map(({ key, label }) => (
                            <button key={label} onClick={() => setFilter(key)} style={{
                                padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.3s',
                                background: filter === key ? (key ? `${THEME_COLORS[key]}30` : 'var(--hover-bg)') : 'var(--inner-card-bg)',
                                border: `1px solid ${filter === key ? (key ? THEME_COLORS[key] : 'var(--border-glow)') : 'var(--border-subtle)'}`,
                                color: filter === key ? (key ? THEME_COLORS[key] : 'var(--text-primary)') : 'var(--text-muted)',
                            }}>{label}</button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, minHeight: '70vh' }}>
                    <GlassPanel glow style={{ minHeight: 500, position: 'relative' }}>
                        <ConstellationCanvas decisions={filteredDecisions} selectedId={selectedId} onSelect={setSelectedId} />
                    </GlassPanel>

                    <div>
                        {selected ? (
                            <GlassPanel glow style={{ padding: 24, height: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                    <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 999, fontWeight: 600, background: `${THEME_COLORS[selected.theme]}20`, color: THEME_COLORS[selected.theme], border: `1px solid ${THEME_COLORS[selected.theme]}50` }}>
                                        {THEME_LABELS[selected.theme]}
                                    </span>
                                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selected.date}</span>
                                </div>

                                <h3 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Outfit', sans-serif", marginBottom: 16, color: 'var(--text-primary)' }}>{selected.title}</h3>

                                <div style={{ padding: 16, borderRadius: 14, marginBottom: 20, background: 'var(--inner-card-bg)', border: '1px solid var(--border-subtle)' }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 8, color: 'var(--text-muted)' }}>Outcome</span>
                                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>{selected.outcome}</p>
                                </div>

                                <div style={{ marginBottom: 20 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Decision Confidence</span>
                                        <span style={{ fontSize: 14, fontWeight: 700, color: THEME_COLORS[selected.theme] }}>{selected.confidence}%</span>
                                    </div>
                                    <div style={{ height: 5, borderRadius: 3, background: 'var(--border-subtle)' }}>
                                        <div style={{ height: '100%', borderRadius: 3, width: `${selected.confidence}%`, background: THEME_COLORS[selected.theme], boxShadow: `0 0 10px ${THEME_COLORS[selected.theme]}40`, transition: 'width 0.7s ease' }} />
                                    </div>
                                </div>

                                <div style={{ marginBottom: 20 }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 8, color: 'var(--text-muted)' }}>Impact Level</span>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} style={{
                                                height: 6, flex: 1, borderRadius: 3, background: i < Math.round(selected.impact * 5) ? THEME_COLORS[selected.theme] : 'var(--border-subtle)',
                                                boxShadow: i < Math.round(selected.impact * 5) ? `0 0 6px ${THEME_COLORS[selected.theme]}30` : 'none'
                                            }} />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 10, color: 'var(--text-muted)' }}>Agent Consensus</span>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {Object.entries(selected.agents).map(([agent, vote]) => {
                                            const vc = vote === 'strongly agree' ? '#00FF9D' : vote === 'agree' ? '#00A3FF' : vote === 'neutral' ? 'var(--text-muted)' : vote === 'disagree' ? '#FF6B3B' : '#FF3B3B'
                                            return (
                                                <div key={agent} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <span style={{ fontSize: 12, textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{agent}</span>
                                                    <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'capitalize', color: vc }}>{vote}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </GlassPanel>
                        ) : (
                            <GlassPanel style={{ padding: 32, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.5 }}>✨</div>
                                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Click a star in the constellation to explore a past decision.</p>
                                </div>
                            </GlassPanel>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
