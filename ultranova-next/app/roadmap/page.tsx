'use client'

import { useState, useEffect } from 'react'
import GlassPanel from '../components/GlassPanel'
import ConfidenceBar from '../components/ConfidenceBar'

const MILESTONES = [
    { id: 'mvp', label: 'MVP', time: 'Now', color: '#6C3BFF', status: 'active', tasks: ['Core product build', 'Landing page launch', 'First 50 users'], agents: { marketing: 'caution', product: 'ok', sales: 'ok', tech: 'ok', ops: 'ok' } },
    { id: 'v1', label: 'V1', time: '2 weeks', color: '#00A3FF', status: 'upcoming', tasks: ['User feedback loop', 'Analytics integration', 'Payment flow'], agents: { marketing: 'ok', product: 'ok', sales: 'caution', tech: 'ok', ops: 'ok' } },
    { id: 'v2', label: 'V2', time: '1 month', color: '#00FF9D', status: 'upcoming', tasks: ['Scale infrastructure', 'Marketing campaigns', 'Team hiring'], agents: { marketing: 'ok', product: 'caution', sales: 'ok', tech: 'caution', ops: 'ok' } },
    { id: 'scale', label: 'Scale', time: '3 months', color: '#FF6B3B', status: 'future', tasks: ['Enterprise features', 'API platform', 'International expansion'], agents: { marketing: 'ok', product: 'ok', sales: 'ok', tech: 'ok', ops: 'caution' } },
]

const TEAM_ALIGNMENT = [
    { name: 'Marketing', status: 'ok', color: '#FF6B3B' },
    { name: 'Product', status: 'ok', color: '#00A3FF' },
    { name: 'Sales', status: 'caution', color: '#00FF9D' },
    { name: 'Tech', status: 'ok', color: '#E0E0FF' },
    { name: 'Ops', status: 'ok', color: '#8A2BE2' },
]

export default function RoadmapPage() {
    const [activeMilestone, setActiveMilestone] = useState<string | null>('mvp')
    const [roadmapAI, setRoadmapAI] = useState<any>(null)
    const [idea] = useState("AI startup assistant")
    const [roadmapData, setRoadmapData] = useState<any>(null);

    const activeData =
        activeMilestone && roadmapAI
            ? roadmapAI[activeMilestone]
            : MILESTONES.find((m) => m.id === activeMilestone)

    const getRoadmap = async () => {
        try {
            const res = await fetch("https://ultranova-ai-r9rx.onrender.com/roadmap", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ idea })
            })

            const data = await res.json()

            setRoadmapData(data);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getRoadmap()
    }, [])



    return (
        <div style={{ position: 'relative', minHeight: '100vh', padding: '24px 16px', zIndex: 2 }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>

                <div style={{ marginBottom: 40 }}>
                    <h1 style={{
                        fontFamily: "'Outfit', sans-serif", fontSize: 32, fontWeight: 700, marginBottom: 8,
                        background: 'linear-gradient(135deg, #6C3BFF, #00A3FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                    }}>
                        The Timeline Nexus
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Your living roadmap — click milestones to explore.</p>
                </div>

                {/* Timeline Section */}
                <GlassPanel glow style={{ padding: '40px 32px 48px', marginBottom: 32, position: 'relative' }}>
                    <div style={{ position: 'relative', marginBottom: 48, padding: '0 14px' }}>
                        {/* Background Line */}
                        <div style={{
                            position: 'absolute', top: 11, left: 14, right: 14, height: 4,
                            borderRadius: 4, background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }} />
                        
                        {/* Progress Line */}
                        <div style={{
                            position: 'absolute', top: 11, left: 14, height: 4, borderRadius: 4,
                            width: `calc(${((MILESTONES.findIndex(m => m.id === activeMilestone)) / (MILESTONES.length - 1)) * 100}% - 0px)`,
                            background: 'linear-gradient(90deg, #6C3BFF, #00A3FF, #00FF9D)',
                            boxShadow: '0 0 20px rgba(108, 59, 255, 0.4), 0 0 40px rgba(0, 163, 255, 0.2)',
                            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                            zIndex: 1
                        }} />

                        {/* Milestones */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                            {MILESTONES.map((m, idx) => {
                                const isActive = activeMilestone === m.id
                                const currentIndex = MILESTONES.findIndex(ms => ms.id === activeMilestone)
                                const isCompleted = idx <= currentIndex
                                
                                return (
                                    <button 
                                        key={m.id} 
                                        onClick={() => setActiveMilestone(m.id)}
                                        style={{ 
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', 
                                            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                                            width: 80, // Fixed width for alignment consistency
                                            margin: idx === 0 ? '0 0 0 -40px' : idx === MILESTONES.length - 1 ? '0 -40px 0 0' : '0',
                                            boxShadow: 'none', // Kill global light mode shadow
                                            transform: 'none', // Kill global light mode transform
                                        }}
                                    >
                                        <div style={{
                                            width: isActive ? 30 : 24, 
                                            height: isActive ? 30 : 24, 
                                            borderRadius: '50% !important', // Force circularity in light mode
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: isCompleted ? (isActive ? m.color : m.color + '40') : 'var(--inner-card-bg)',
                                            border: isCompleted ? `2px solid ${m.color}` : '2px solid rgba(200,200,255,0.2)',
                                            boxShadow: isActive ? `0 0 25px ${m.color}80, inset 0 0 10px rgba(255,255,255,0.4)` : 'none',
                                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                            position: 'relative',
                                            marginTop: isActive ? -2 : 1,
                                            zIndex: 5
                                        }}>
                                            {isCompleted && !isActive && (
                                                <div style={{ width: 6, height: 6, borderRadius: '50% !important', background: m.color }} />
                                            )}
                                            {isActive && (
                                                <div style={{ width: 8, height: 8, borderRadius: '50% !important', background: 'white', boxShadow: '0 0 10px white' }} />
                                            )}
                                        </div>
                                        
                                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                                            <span style={{ 
                                                display: 'block',
                                                fontSize: 13, fontWeight: 700, 
                                                color: isActive ? 'white' : '#8888AA', 
                                                fontFamily: "'Outfit', sans-serif", 
                                                transition: 'all 0.3s ease',
                                                textShadow: isActive ? `0 0 10px ${m.color}60` : 'none'
                                            }}>
                                                {m.label}
                                            </span>
                                            <span style={{ 
                                                display: 'block',
                                                fontSize: 10, marginTop: 4, 
                                                color: isActive ? m.color : '#555577',
                                                fontWeight: 500,
                                                letterSpacing: '0.05em'
                                            }}>
                                                {m.time}
                                            </span>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {activeData && (
                        <div style={{ padding: 24, borderRadius: 14, background: 'var(--inner-card-bg)', border: '1px solid var(--border-subtle)', transition: 'all 0.5s ease' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
                                <div>
                                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: activeData.color, fontFamily: "'Outfit', sans-serif" }}>
                                        {activeData.label} — {activeData.time}
                                    </h3>
                                    <span style={{
                                        fontSize: 11, padding: '4px 10px', borderRadius: 999,
                                        background: activeData.status === 'active' ? 'rgba(0,255,157,0.1)' : 'rgba(255,255,255,0.05)',
                                        color: activeData.status === 'active' ? '#00FF9D' : '#555577',
                                        border: `1px solid ${activeData.status === 'active' ? 'rgba(0,255,157,0.2)' : 'rgba(255,255,255,0.06)'}`,
                                    }}>
                                        {activeData.status === 'active' ? '● Active' : activeData.status === 'upcoming' ? '◐ Upcoming' : '○ Future'}
                                    </span>
                                </div>
                            </div>

                            <h4 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 12 }}>Key Tasks</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                                {(activeData?.tasks || []).map((task: any, i: number) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 8, background: 'var(--hover-bg)', border: '1px solid var(--border-subtle)' }}>
                                        <div style={{
                                            width: 20, height: 20, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                            border: `1px solid ${activeData.color}40`, background: i === 0 && activeData.status === 'active' ? `${activeData.color}20` : 'transparent'
                                        }}>
                                            {i === 0 && activeData.status === 'active' && (
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={activeData.color} strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
                                            )}
                                        </div>
                                        <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{task}</span>
                                    </div>
                                ))}
                            </div>

                            <h4 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 12 }}>Agent Alignment</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {Object.entries(activeData?.agents || {}).map(([agent, s]) => (
                                    <div key={agent} style={{
                                        display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, fontSize: 12,
                                        background: s === 'ok' ? 'rgba(0,255,157,0.06)' : 'rgba(255,107,59,0.06)',
                                        border: `1px solid ${s === 'ok' ? 'rgba(0,255,157,0.15)' : 'rgba(255,107,59,0.15)'}`,
                                        color: s === 'ok' ? '#00FF9D' : '#FF6B3B',
                                    }}>
                                        {s === 'ok' ? '✅' : '⚠️'} {agent.charAt(0).toUpperCase() + agent.slice(1)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </GlassPanel>

                {/* Bottom */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                    <GlassPanel style={{ padding: 24 }}>
                        <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 16 }}>Risk Forecast</h3>
                        <ConfidenceBar value={activeData?.confidence || 78} label="Overall Confidence" color="#6C3BFF" />
                        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <ConfidenceBar value={activeData?.technical_feasibility || 92} label="Technical Feasibility" color="#00A3FF" size="sm" />

                            <ConfidenceBar value={activeData?.market_timing || 64} label="Market Timing" color="#FF6B3B" size="sm" />

                            <ConfidenceBar value={activeData?.team_readiness || 85} label="Team Readiness" color="#00FF9D" size="sm" />
                        </div>
                    </GlassPanel>

                    <GlassPanel style={{ padding: 24 }}>
                        <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#555577', marginBottom: 16 }}>Team Alignment</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {TEAM_ALIGNMENT.map((member, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: member.color, boxShadow: `0 0 8px ${member.color}40` }} />
                                        <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{member.name}</span>
                                    </div>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: member.status === 'ok' ? '#00FF9D' : '#FF6B3B' }}>
                                        {member.status === 'ok' ? '✅ Aligned' : '⚠️ Concerns'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </div>
    )
}
