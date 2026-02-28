'use client'

import { useState, useRef, useEffect } from 'react'
import { useTheme } from './ThemeContext'

type Message = { id: string; role: 'user' | 'ai'; content: string; delay?: number }

const FAQS = [
    "What is an AI Founder OS?",
    "How do the 5 agents work?",
    "Is this for solo founders?",
]

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'ai', content: 'System online. How can I help you build today?' }
    ])
    const [inputTitle, setInputTitle] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, isTyping])

    const handleSend = async (text: string) => {
        if (!text.trim()) return

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
        setMessages(prev => [...prev, userMsg])
        setInputTitle('')
        setIsTyping(true)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            })

            const reader = res.body?.getReader()
            const decoder = new TextDecoder()
            let done = false

            // Wait a quick moment before removing typing dots for realism
            await new Promise(r => setTimeout(r, 600))
            setIsTyping(false)

            // Setup empty AI message block to be filled chunk by chunk
            const aiMsgId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', content: '' }])

            // Read the stream
            while (!done && reader) {
                const { value, done: readerDone } = await reader.read()
                done = readerDone
                if (value) {
                    const chunk = decoder.decode(value)
                    setMessages(prev => prev.map(m =>
                        m.id === aiMsgId ? { ...m, content: m.content + chunk } : m
                    ))
                }
            }
        } catch (e) {
            setIsTyping(false)
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: 'Connection error while contacting AI Founder.' }])
        }
    }

    return (
        <>
            {/* ─── Chat Window ─── */}
            <div
                className={!isDark ? 'brutalist-card' : ''}
                style={{
                    position: 'fixed',
                    bottom: isOpen ? 100 : 80,
                    right: 32,
                    width: 360,
                    maxHeight: 550,
                    height: 'calc(100vh - 140px)',
                    background: 'var(--glass-glow-bg)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    border: '1px solid var(--border-glow)',
                    borderRadius: 20,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 40px rgba(108,59,255,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    transition: 'visibility 0.4s, opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: isOpen ? 1 : 0,
                    visibility: isOpen ? 'visible' : 'hidden',
                    pointerEvents: isOpen ? 'auto' : 'none',
                    transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
                    zIndex: 99,
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '20px',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: 'linear-gradient(135deg, rgba(108,59,255,0.1), transparent)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: '50%', background: '#6C3BFF',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                                boxShadow: '0 0 15px rgba(108,59,255,0.5)'
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                                    <path d="M19 10h-2M7 10H5M21 16H3" />
                                    <rect x="7" y="6" width="10" height="12" rx="2" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div style={{
                                position: 'absolute', bottom: -2, right: -2, width: 10, height: 10,
                                borderRadius: '50%', background: '#00FF9D', border: '2px solid var(--glass-glow-bg)',
                                boxShadow: '0 0 8px rgba(0,255,157,0.6)'
                            }} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>UltraNova Guide</h3>
                            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>Always online</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        style={{
                            background: 'transparent', border: 'none', color: 'var(--text-secondary)',
                            cursor: 'pointer', display: 'flex', padding: 4
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            style={{
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                background: m.role === 'user' ? '#6C3BFF' : 'var(--inner-card-bg)',
                                color: m.role === 'user' ? '#FFF' : 'var(--text-primary)',
                                padding: '12px 16px',
                                borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                fontSize: 14,
                                lineHeight: 1.5,
                                border: m.role === 'ai' ? '1px solid var(--border-subtle)' : 'none',
                                boxShadow: m.role === 'user' ? '0 4px 12px rgba(108,59,255,0.2)' : 'none',
                            }}
                        >
                            {m.content}
                        </div>
                    ))}

                    {isTyping && (
                        <div style={{ alignSelf: 'flex-start', background: 'var(--inner-card-bg)', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', border: '1px solid var(--border-subtle)', display: 'flex', gap: 4 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-secondary)', animation: 'pulse 1.5s infinite ease-in-out' }} />
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-secondary)', animation: 'pulse 1.5s infinite ease-in-out 0.2s' }} />
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-secondary)', animation: 'pulse 1.5s infinite ease-in-out 0.4s' }} />
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* FAQs */}
                <div style={{ padding: '0 20px 12px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {FAQS.map((faq, i) => (
                        <button
                            key={i}
                            onClick={() => handleSend(faq)}
                            style={{
                                background: 'var(--hover-bg)',
                                border: '1px solid var(--border-glow)',
                                color: 'var(--text-secondary)',
                                padding: '6px 12px',
                                borderRadius: 20,
                                fontSize: 12,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(108,59,255,0.1)'
                                e.currentTarget.style.color = 'var(--text-primary)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--hover-bg)'
                                e.currentTarget.style.color = 'var(--text-secondary)'
                            }}
                        >
                            {faq}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <div style={{ padding: 16, borderTop: '1px solid var(--border-subtle)' }}>
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(inputTitle); }}
                        style={{ position: 'relative', display: 'flex' }}
                    >
                        <input
                            type="text"
                            value={inputTitle}
                            onChange={(e) => setInputTitle(e.target.value)}
                            placeholder="Ask anything..."
                            style={{
                                width: '100%',
                                background: 'var(--input-bg)',
                                border: '1px solid var(--border-subtle)',
                                color: 'var(--text-primary)',
                                padding: '12px 45px 12px 16px',
                                borderRadius: 24,
                                fontSize: 14,
                                outline: 'none',
                                transition: 'all 0.3s ease',
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'rgba(108,59,255,0.5)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                        />
                        <button
                            type="submit"
                            disabled={!inputTitle.trim() || isTyping}
                            style={{
                                position: 'absolute',
                                right: 6,
                                top: 6,
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                background: inputTitle.trim() ? '#6C3BFF' : 'transparent',
                                border: 'none',
                                color: inputTitle.trim() ? '#FFF' : 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: inputTitle.trim() ? 'pointer' : 'default',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translateX(-1px)' }}>
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>

            {/* ─── Floating Button ─── */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle AI Chat"
                style={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6C3BFF, #00A3FF)',
                    border: 'none',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(108,59,255,0.4)',
                    zIndex: 100,
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isOpen ? 'rotate(90deg) scale(0.9)' : 'rotate(0deg) scale(1)',
                }}
                onMouseEnter={(e) => {
                    if (!isOpen) e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(108,59,255,0.6)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = isOpen ? 'rotate(90deg) scale(0.9)' : 'rotate(0deg) scale(1)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(108,59,255,0.4)'
                }}
            >
                <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Default Chat Icon */}
                    <svg
                        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        style={{
                            position: 'absolute',
                            transition: 'all 0.4s ease',
                            opacity: isOpen ? 0 : 1,
                            transform: isOpen ? 'rotate(-90deg) scale(0.5)' : 'rotate(0deg) scale(1)',
                        }}
                    >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    {/* Close Icon attached to button rotating state */}
                    <svg
                        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                        style={{
                            position: 'absolute',
                            transition: 'all 0.4s ease',
                            opacity: isOpen ? 1 : 0,
                            transform: isOpen ? 'rotate(-90deg) scale(1)' : 'rotate(90deg) scale(0.5)',
                        }}
                    >
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </div>
            </button>

            {/* Pulse ring underneath button */}
            {!isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(108,59,255,0.4)',
                    pointerEvents: 'none',
                    zIndex: 98,
                    animation: 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                }} />
            )}
        </>
    )
}
