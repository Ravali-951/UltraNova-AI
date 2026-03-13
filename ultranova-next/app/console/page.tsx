'use client'

import { useState } from 'react'
import GlassPanel from '../components/GlassPanel'
import GlowButton from '../components/GlowButton'
import AgentAvatar from '../components/AgentAvatar'
import ConfidenceBar from '../components/ConfidenceBar'
import StatusBar from '../components/StatusBar'
import type { AgentType, AgentStatus } from '../components/AgentAvatar'

const AGENTS: Array<{ type: AgentType; status: AgentStatus; stance: string; message: string }> = [
    { type: 'marketing', status: 'active', stance: 'Debating', message: 'Market timing is critical. We need positioning clarity before launch.' },
    { type: 'product', status: 'waiting', stance: 'Waiting', message: 'Ready to evaluate technical feasibility once scope is defined.' },
    { type: 'sales', status: 'active', stance: 'Has proposal', message: 'I see a direct-to-enterprise path. Let me outline the GTM.' },
    { type: 'tech', status: 'calculating', stance: 'Calculating', message: 'Running architecture cost analysis for both options...' },
    { type: 'ops', status: 'idle', stance: 'Monitoring', message: 'All metrics within acceptable range. Standing by for veto review.' },
]

const DECISION_OPTIONS = [
    { label: 'Option A: Build analytics first', risk: 30, confidence: 72, color: '#00A3FF' },
    { label: 'Option B: Launch with basic metrics', risk: 15, confidence: 85, color: '#00FF9D' },
    { label: 'Option C: Full suite before launch', risk: 45, confidence: 58, color: '#FF6B3B' },
]

export default function ConsolePage() {
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [inputValue, setInputValue] = useState('')
    const [isThinking, setIsThinking] = useState(false)
    const [agentStates, setAgentStates] = useState(AGENTS)
    const [decisionOptions, setDecisionOptions] = useState(DECISION_OPTIONS)
    const [overallConfidence, setOverallConfidence] = useState(82)
    const [decisionQuestion, setDecisionQuestion] = useState("Should we build the analytics dashboard now?")

    const [agentData, setAgentData] = useState({
        marketing: { status: "Idle", message: "", confidence: 0, actions: 0 },
        product: { status: "Idle", message: "", confidence: 0, actions: 0 },
        sales: { status: "Idle", message: "", confidence: 0, actions: 0 },
        tech: { status: "Idle", message: "", confidence: 0, actions: 0 },
        ops: { status: "Idle", message: "", confidence: 0, actions: 0 }
    });
    const [decisionSpace, setDecisionSpace] = useState({
        question: "",
        options: []
    });
    const [runway, setRunway] = useState("18 months");
    const [confidence, setConfidence] = useState(82);

const handleThink = async () => {
  try {
    setIsThinking(true);
    
    const thoughtInput = inputValue || "AI app for students to find study partners";
    
    console.log('1. Sending idea to backend:', thoughtInput);
    
    const response = await fetch('http://localhost:8000/founder/think', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        idea: thoughtInput
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('2. BACKEND RESPONSE RAW:', JSON.stringify(data, null, 2));
    
    // Transform the data to match your frontend format
    const transformedData = {
      agents: {
        marketing: { 
          status: "Active",
          message: data.marketing?.message || "Analyzing market conditions...",
          confidence: data.marketing?.confidence || 72,
          actions: 3,
          stance: data.marketing?.stance || "Analyzing"
        },
        product: { 
          status: "Active",
          message: data.product?.message || "Evaluating technical feasibility...",
          confidence: data.product?.confidence || 68,
          actions: 2,
          stance: data.product?.stance || "Evaluating"
        },
        sales: { 
          status: "Active",
          message: data.sales?.message || "Identifying enterprise opportunities...",
          confidence: data.sales?.confidence || 75,
          actions: 4,
          stance: data.sales?.stance || "Planning"
        },
        tech: { 
          status: "Active",
          message: data.tech?.message || "Running cost analysis...",
          confidence: data.tech?.confidence || 88,
          actions: 2,
          stance: data.tech?.stance || "Calculating"
        },
        ops: { 
          status: data.ops?.stance === "Ready" ? "Active" : "Idle",
          message: data.ops?.message || "Monitoring all systems...",
          confidence: data.ops?.confidence || 91,
          actions: 1,
          stance: data.ops?.stance || "Monitoring"
        }
      },
      decision: {
        question: data.decision_question || "Should we build the analytics dashboard now?",
        options: data.options || DECISION_OPTIONS
      },
      runway: "18 months",
      confidence: data.overall_confidence || 82
    };
    
    console.log('3. TRANSFORMED DATA:', transformedData);
    
    // Update agentData
    setAgentData(transformedData.agents);
    
    // Update agentStates for the left panel
const updatedAgentStates = [
  { type: 'marketing' as AgentType, status: (transformedData.agents.marketing.status === 'Active' ? 'active' : 'idle') as AgentStatus, stance: transformedData.agents.marketing.stance, message: transformedData.agents.marketing.message },
  { type: 'product' as AgentType, status: (transformedData.agents.product.status === 'Active' ? 'active' : 'idle') as AgentStatus, stance: transformedData.agents.product.stance, message: transformedData.agents.product.message },
  { type: 'sales' as AgentType, status: (transformedData.agents.sales.status === 'Active' ? 'active' : 'idle') as AgentStatus, stance: transformedData.agents.sales.stance, message: transformedData.agents.sales.message },
  { type: 'tech' as AgentType, status: (transformedData.agents.tech.status === 'Active' ? 'active' : 'idle') as AgentStatus, stance: transformedData.agents.tech.stance, message: transformedData.agents.tech.message },
  { type: 'ops' as AgentType, status: (transformedData.agents.ops.status === 'Active' ? 'active' : 'idle') as AgentStatus, stance: transformedData.agents.ops.stance, message: transformedData.agents.ops.message },
];

setAgentStates(updatedAgentStates);
    
    // Update decision data
    setDecisionSpace(transformedData.decision);
    setDecisionQuestion(transformedData.decision.question);
    
    // Format options to match your DECISION_OPTIONS structure
    if (transformedData.decision.options) {
      const formattedOptions = transformedData.decision.options.map((opt: any, index: number) => ({
        label: opt.label || opt.title || `Option ${String.fromCharCode(65 + index)}`,
        risk: opt.risk || 30,
        confidence: opt.confidence || 70,
        color: index === 0 ? '#00A3FF' : index === 1 ? '#00FF9D' : '#FF6B3B'
      }));
      setDecisionOptions(formattedOptions);
    }
    
    // Update confidence and runway
    setRunway(transformedData.runway);
    setConfidence(transformedData.confidence);
    setOverallConfidence(transformedData.confidence);
    
  } catch (error) {
    console.error('3. Error:', error);
  } finally {
    setIsThinking(false);
  }
};

    return (
        <div style={{ position: 'relative', minHeight: '100vh', padding: '24px 16px', zIndex: 2 }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <StatusBar runway={runway} confidence={confidence} />

                    {/* Main Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, minHeight: 'calc(100vh - 180px)' }}>
                        {/* Agent Council (Left) */}
                        <GlassPanel glow style={{ padding: 20 }}>
                            <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', fontFamily: "'Outfit', sans-serif", marginBottom: 20 }}>
                                Agent Council
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {/* Marketing */}
                                <div style={{
                                    padding: 12, borderRadius: 12, transition: 'all 0.5s ease',
                                    background: agentData.marketing.status === 'Active' ? 'var(--hover-bg)' : 'transparent',
                                    border: `1px solid ${agentData.marketing.status === 'Active' ? 'var(--border-glow)' : 'transparent'}`,
                                }}>
                                    <AgentAvatar type="marketing" status={agentData.marketing.status === 'Active' ? 'active' : 'idle'} size="sm" />
                                    <p style={{ fontSize: 11, marginTop: 8, marginLeft: 52, lineHeight: 1.5, color: 'var(--text-muted)' }}>
                                        {agentData.marketing.message || "Awaiting input..."}
                                    </p>
                                    <div style={{ marginLeft: 52, marginTop: 4, fontSize: 10, color: 'var(--text-muted-lighter)' }}>
                                        Confidence: {agentData.marketing.confidence}% • {agentData.marketing.actions} actions
                                    </div>
                                </div>

                                {/* Product */}
                                <div style={{
                                    padding: 12, borderRadius: 12, transition: 'all 0.5s ease',
                                    background: agentData.product.status === 'Active' ? 'var(--hover-bg)' : 'transparent',
                                    border: `1px solid ${agentData.product.status === 'Active' ? 'var(--border-glow)' : 'transparent'}`,
                                }}>
                                    <AgentAvatar type="product" status={agentData.product.status === 'Active' ? 'active' : 'idle'} size="sm" />
                                    <p style={{ fontSize: 11, marginTop: 8, marginLeft: 52, lineHeight: 1.5, color: 'var(--text-muted)' }}>
                                        {agentData.product.message || "Awaiting input..."}
                                    </p>
                                    <div style={{ marginLeft: 52, marginTop: 4, fontSize: 10, color: 'var(--text-muted-lighter)' }}>
                                        Confidence: {agentData.product.confidence}% • {agentData.product.actions} actions
                                    </div>
                                </div>

                                {/* Sales */}
                                <div style={{
                                    padding: 12, borderRadius: 12, transition: 'all 0.5s ease',
                                    background: agentData.sales.status === 'Active' ? 'var(--hover-bg)' : 'transparent',
                                    border: `1px solid ${agentData.sales.status === 'Active' ? 'var(--border-glow)' : 'transparent'}`,
                                }}>
                                    <AgentAvatar type="sales" status={agentData.sales.status === 'Active' ? 'active' : 'idle'} size="sm" />
                                    <p style={{ fontSize: 11, marginTop: 8, marginLeft: 52, lineHeight: 1.5, color: 'var(--text-muted)' }}>
                                        {agentData.sales.message || "Awaiting input..."}
                                    </p>
                                    <div style={{ marginLeft: 52, marginTop: 4, fontSize: 10, color: 'var(--text-muted-lighter)' }}>
                                        Confidence: {agentData.sales.confidence}% • {agentData.sales.actions} actions
                                    </div>
                                </div>

                                {/* Tech */}
                                <div style={{
                                    padding: 12, borderRadius: 12, transition: 'all 0.5s ease',
                                    background: agentData.tech.status === 'Active' ? 'var(--hover-bg)' : 'transparent',
                                    border: `1px solid ${agentData.tech.status === 'Active' ? 'var(--border-glow)' : 'transparent'}`,
                                }}>
                                    <AgentAvatar type="tech" status={agentData.tech.status === 'Active' ? 'active' : 'idle'} size="sm" />
                                    <p style={{ fontSize: 11, marginTop: 8, marginLeft: 52, lineHeight: 1.5, color: 'var(--text-muted)' }}>
                                        {agentData.tech.message || "Awaiting input..."}
                                    </p>
                                    <div style={{ marginLeft: 52, marginTop: 4, fontSize: 10, color: 'var(--text-muted-lighter)' }}>
                                        Confidence: {agentData.tech.confidence}% • {agentData.tech.actions} actions
                                    </div>
                                </div>

                                {/* Ops */}
                                <div style={{
                                    padding: 12, borderRadius: 12, transition: 'all 0.5s ease',
                                    background: agentData.ops.status === 'Active' ? 'var(--hover-bg)' : 'transparent',
                                    border: `1px solid ${agentData.ops.status === 'Active' ? 'var(--border-glow)' : 'transparent'}`,
                                }}>
                                    <AgentAvatar type="ops" status={agentData.ops.status === 'Active' ? 'active' : 'idle'} size="sm" />
                                    <p style={{ fontSize: 11, marginTop: 8, marginLeft: 52, lineHeight: 1.5, color: 'var(--text-muted)' }}>
                                        {agentData.ops.message || "Awaiting input..."}
                                    </p>
                                    <div style={{ marginLeft: 52, marginTop: 4, fontSize: 10, color: 'var(--text-muted-lighter)' }}>
                                        Confidence: {agentData.ops.confidence}% • {agentData.ops.actions} actions
                                    </div>
                                </div>
                            </div>
                        </GlassPanel>

                        {/* Main Decision Space */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <GlassPanel glow style={{ padding: 28, flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
                                    <div>
                                        <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', fontFamily: "'Outfit', sans-serif", marginBottom: 8 }}>
                                            Decision Space
                                        </h2>
                                        <h3 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>
                                            &ldquo;{decisionQuestion}&rdquo;
                                        </h3>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999,
                                        background: 'rgba(0, 255, 157, 0.08)', border: '1px solid rgba(0, 255, 157, 0.2)',
                                    }}>
                                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00FF9D', boxShadow: '0 0 6px rgba(0,255,157,0.5)' }} />
                                        <span style={{ fontSize: 11, fontWeight: 500, color: '#00FF9D' }}>Live</span>
                                    </div>
                                </div>

                                {/* Decision Tree */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
                                    {decisionOptions.map((opt, i) => {
                                        const isSelected = selectedOption === i
                                        const riskColor = opt.risk > 35 ? '#FF3B3B' : opt.risk > 20 ? '#FF6B3B' : '#00FF9D'
                                        return (
                                            <button key={i} onClick={() => setSelectedOption(i)}
                                                style={{
                                                    padding: 20, borderRadius: 14, textAlign: 'left', cursor: 'pointer',
                                                    background: isSelected ? 'var(--hover-bg)' : 'var(--inner-card-bg)',
                                                    border: `1px solid ${isSelected ? opt.color : 'var(--border-subtle)'}`,
                                                    boxShadow: isSelected ? `0 0 25px ${opt.color}20` : 'none',
                                                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                                    transition: 'all 0.35s ease',
                                                }}
                                            >
                                                <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: isSelected ? opt.color : 'var(--text-primary)' }}>
                                                    {opt.label}
                                                </h4>
                                                <ConfidenceBar value={opt.confidence} label="Confidence" color={opt.color} size="sm" />
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Risk Level</span>
                                                    <span style={{ fontSize: 11, fontWeight: 700, color: riskColor }}>{opt.risk}%</span>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* Weighted Votes */}
                                <div style={{ padding: 18, borderRadius: 14, background: 'var(--inner-card-bg)', border: '1px solid var(--border-subtle)' }}>
                                    <h4 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 16 }}>
                                        Weighted Agent Votes
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                                        {[
                                            { label: 'Marketing', vote: 'B', color: '#FF6B3B' },
                                            { label: 'Product', vote: 'B', color: '#00A3FF' },
                                            { label: 'Sales', vote: 'A', color: '#00FF9D' },
                                            { label: 'Tech', vote: 'B', color: '#E0E0FF' },
                                            { label: 'Ops', vote: '—', color: '#8A2BE2' },
                                        ].map((v, i) => (
                                            <div key={i} style={{ textAlign: 'center' }}>
                                                <span style={{ fontSize: 11, display: 'block', marginBottom: 4, color: '#555577' }}>{v.label}</span>
                                                <span style={{ fontSize: 20, fontWeight: 700, color: v.color, fontFamily: "'Outfit', sans-serif" }}>{v.vote}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </GlassPanel>

                            {/* Input Area */}
                            <GlassPanel glow style={{ padding: 20 }}>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <input
                                        type="text" placeholder="What decision do you need help with?"
                                        value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleThink()}
                                        style={{
                                            flex: 1, padding: '14px 18px', background: 'rgba(10,10,15,0.8)',
                                            border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8,
                                            color: '#F0F0FF', fontFamily: "'Inter', sans-serif", fontSize: 15, outline: 'none',
                                        }}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = '#6C3BFF'; e.currentTarget.style.boxShadow = '0 0 20px rgba(108,59,255,0.15)' }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none' }}
                                    />
                                    <GlowButton variant="primary" onClick={handleThink} disabled={isThinking || !inputValue.trim()}>
                                        {isThinking ? '⚙️ Thinking...' : 'THINK ⚡'}
                                    </GlowButton>
                                </div>
                            </GlassPanel>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
