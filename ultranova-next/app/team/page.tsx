'use client'

import { useState } from 'react'
import GlassPanel from '../components/GlassPanel'
import GlowButton from '../components/GlowButton'
import AgentAvatar from '../components/AgentAvatar'
import ConfidenceBar from '../components/ConfidenceBar'
import type { AgentType } from '../components/AgentAvatar'

const AGENT_PROFILES: Array<{
    type: AgentType; stance: string; confidence: number; reasoning: string[]; requests: string[]; color: string
}> = [
        {
            type: 'marketing', stance: 'Not ready for launch', confidence: 34,
            reasoning: ['Product clarity is only 42%', 'Target market undefined', 'Competitor analysis missing', 'Messaging hasn\'t been tested'],
            requests: ['Define ICP within 48h', 'Create messaging matrix', 'Run 5 customer interviews'], color: '#FF6B3B'
        },
        {
            type: 'product', stance: 'Core features solid, needs polish', confidence: 72,
            reasoning: ['Architecture is scalable', 'Core user flow validated', 'Missing 3 critical integrations', 'Mobile experience needs work'],
            requests: ['Prioritize API integrations', 'Complete mobile responsive design', 'Set up error monitoring'], color: '#00A3FF'
        },
        {
            type: 'sales', stance: 'Enterprise path is viable', confidence: 68,
            reasoning: ['B2B opportunity identified', 'Pricing model needs validation', 'No sales collateral exists', '3 warm leads in pipeline'],
            requests: ['Build pitch deck by Friday', 'Create demo environment', 'Schedule 3 discovery calls'], color: '#00FF9D'
        },
        {
            type: 'tech', stance: 'Infrastructure can handle 10x', confidence: 88,
            reasoning: ['Auto-scaling configured', 'CI/CD pipeline operational', 'Test coverage at 78%', 'Security audit passed'],
            requests: ['Increase test coverage to 85%', 'Set up staging environment', 'Document API endpoints'], color: '#E0E0FF'
        },
        {
            type: 'ops', stance: 'Monitoring all metrics', confidence: 91,
            reasoning: ['Burn rate within budget', 'Runway is 18 months', 'No compliance blockers', 'Team velocity stable'],
            requests: ['Review vendor contracts', 'Update financial projections', 'Finalize Q2 OKRs'], color: '#8A2BE2'
        },
    ]

export default function TeamPage() {
    const [expandedAgent, setExpandedAgent] = useState<AgentType | null>(null)
    const expanded = expandedAgent ? AGENT_PROFILES.find((a) => a.type === expandedAgent) : null

    return (
        <div style={{ position: 'relative', minHeight: '100vh', padding: '24px 16px', zIndex: 2 }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>

                <div style={{ marginBottom: 40 }}>
                    <h1 style={{
                        fontFamily: "'Outfit', sans-serif", fontSize: 32, fontWeight: 700, marginBottom: 8,
                        background: 'linear-gradient(135deg, #6C3BFF, #00A3FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                    }}>
                        The Council Chamber
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Meet your AI agents. Explore their thinking, stances, and action requests.</p>
                </div>

                {!expandedAgent ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                        {AGENT_PROFILES.map((agent) => (
                            <div key={agent.type} onClick={() => setExpandedAgent(agent.type)} style={{ cursor: 'pointer', transition: 'transform 0.35s ease' }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)')}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
                                <GlassPanel glow style={{ padding: 24 }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                                        <AgentAvatar type={agent.type} status="active" size="md" showLabel={false} />
                                        <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 999, background: `${agent.color}10`, color: agent.color, border: `1px solid ${agent.color}30` }}>
                                            {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Outfit', sans-serif", marginBottom: 12, color: '#F0F0FF' }}>
                                        &ldquo;{agent.stance}&rdquo;
                                    </h3>
                                    <ConfidenceBar value={agent.confidence} label="Confidence" color={agent.color} size="sm" />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                                        <span style={{ fontSize: 12, color: '#555577' }}>{agent.requests.length} action items</span>
                                        <span style={{ fontSize: 12, color: agent.color }}>→ View Details</span>
                                    </div>
                                </GlassPanel>
                            </div>
                        ))}
                    </div>
                ) : expanded && (
                    <div>
                        <GlassPanel glow style={{ padding: 32, maxWidth: 700, margin: '0 auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                                <AgentAvatar type={expanded.type} status="active" size="lg" />
                                <button onClick={() => setExpandedAgent(null)} style={{
                                    width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', color: '#555577',
                                    cursor: 'pointer', transition: 'all 0.3s ease', fontSize: 16,
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,59,59,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,59,59,0.3)'; e.currentTarget.style.color = '#FF3B3B' }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#555577' }}
                                >✕</button>
                            </div>

                            <div style={{ marginBottom: 24 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#555577' }}>Current Stance</span>
                                <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 8, fontFamily: "'Outfit', sans-serif", color: '#F0F0FF' }}>
                                    &ldquo;{expanded.stance}&rdquo;
                                </h2>
                            </div>

                            <div style={{ marginBottom: 32 }}>
                                <ConfidenceBar value={expanded.confidence} label="Confidence Level" color={expanded.color} />
                            </div>

                            <div style={{ marginBottom: 32 }}>
                                <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#555577', marginBottom: 12 }}>Reasoning</h3>
                                <div style={{ padding: 20, borderRadius: 14, background: 'rgba(10,10,15,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    {expanded.reasoning.map((r, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < expanded.reasoning.length - 1 ? 10 : 0 }}>
                                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: expanded.color, marginTop: 7, flexShrink: 0 }} />
                                            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{r}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: 32 }}>
                                <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#555577', marginBottom: 12 }}>Action Requests</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {expanded.requests.map((req, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
                                            <div style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, border: `1px solid ${expanded.color}40` }} />
                                            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{req}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                <GlowButton variant="primary" size="sm">Acknowledge</GlowButton>
                                <GlowButton variant="outline" size="sm">Debate</GlowButton>
                                <GlowButton variant="ghost" size="sm">Override</GlowButton>
                            </div>
                        </GlassPanel>
                    </div>
                )}
            </div>
        </div>
    )
}
