'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const NAV_NODES = [
    { label: 'Home', href: '/', x: 15, y: 50 },
    { label: 'Waitlist', href: '/waitlist', x: 30, y: 30 },
    { label: 'Console', href: '/console', x: 50, y: 50 },
    { label: 'Roadmap', href: '/roadmap', x: 65, y: 25 },
    { label: 'Team', href: '/team', x: 40, y: 70 },
    { label: 'Decisions', href: '/decisions', x: 75, y: 60 },
]

const CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [2, 4], [3, 5], [1, 4],
]

export default function NeuralNavigation() {
    const [isOpen, setIsOpen] = useState(false)
    const [hoveredNode, setHoveredNode] = useState<number | null>(null)
    const navRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <>
            {/* Toggle button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    top: 24,
                    right: 24,
                    zIndex: 100,
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.5s ease',
                    background: isOpen ? 'rgba(108, 59, 255, 0.3)' : 'rgba(20, 20, 34, 0.7)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${isOpen ? 'rgba(108, 59, 255, 0.5)' : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: isOpen ? '0 0 30px rgba(108, 59, 255, 0.3)' : 'none',
                }}
                aria-label="Toggle navigation"
            >
                <div style={{ position: 'relative', width: 20, height: 20 }}>
                    <span style={{
                        position: 'absolute', width: 7, height: 7, borderRadius: '50%', transition: 'all 0.3s ease',
                        background: isOpen ? '#6C3BFF' : '#8888AA',
                        top: isOpen ? 6 : 2, left: isOpen ? 6 : 2,
                        boxShadow: isOpen ? '0 0 8px #6C3BFF' : 'none',
                    }} />
                    <span style={{
                        position: 'absolute', width: 7, height: 7, borderRadius: '50%', transition: 'all 0.3s ease',
                        background: isOpen ? '#00A3FF' : '#8888AA',
                        top: isOpen ? 6 : 2, right: isOpen ? 6 : 2,
                        boxShadow: isOpen ? '0 0 8px #00A3FF' : 'none',
                    }} />
                    <span style={{
                        position: 'absolute', width: 7, height: 7, borderRadius: '50%', transition: 'all 0.3s ease',
                        background: isOpen ? '#00FF9D' : '#8888AA',
                        bottom: 2, left: '50%', transform: 'translateX(-50%)',
                        boxShadow: isOpen ? '0 0 8px #00FF9D' : 'none',
                    }} />
                </div>
            </button>

            {/* Navigation overlay */}
            <div
                ref={navRef}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 90,
                    transition: 'all 0.5s ease',
                    opacity: isOpen ? 1 : 0,
                    visibility: isOpen ? 'visible' : 'hidden',
                    pointerEvents: 'none',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: isOpen ? 'auto' : 'none',
                        background: 'rgba(10, 10, 15, 0.92)',
                        backdropFilter: 'blur(40px)',
                    }}
                >
                    {/* SVG connections */}
                    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}>
                        {CONNECTIONS.map(([a, b], i) => {
                            const nodeA = NAV_NODES[a]
                            const nodeB = NAV_NODES[b]
                            const isHighlighted = hoveredNode === a || hoveredNode === b
                            return (
                                <line
                                    key={i}
                                    x1={`${nodeA.x}%`} y1={`${nodeA.y}%`}
                                    x2={`${nodeB.x}%`} y2={`${nodeB.y}%`}
                                    stroke={isHighlighted ? 'rgba(108, 59, 255, 0.6)' : 'rgba(108, 59, 255, 0.15)'}
                                    strokeWidth={isHighlighted ? 2 : 1}
                                    style={{
                                        transition: 'all 0.4s ease',
                                        filter: isHighlighted ? 'drop-shadow(0 0 6px rgba(108,59,255,0.4))' : 'none',
                                    }}
                                />
                            )
                        })}
                    </svg>

                    {/* Nodes */}
                    {NAV_NODES.map((node, i) => {
                        const isHovered = hoveredNode === i
                        const delay = i * 0.08
                        return (
                            <Link
                                key={i}
                                href={node.href}
                                onClick={() => setIsOpen(false)}
                                onMouseEnter={() => setHoveredNode(i)}
                                onMouseLeave={() => setHoveredNode(null)}
                                style={{
                                    position: 'absolute',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 12,
                                    textDecoration: 'none',
                                    left: `${node.x}%`,
                                    top: `${node.y}%`,
                                    transform: isOpen ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.3)',
                                    opacity: isOpen ? 1 : 0,
                                    transition: `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
                                    zIndex: 2,
                                }}
                            >
                                {/* Outer glow */}
                                <div style={{
                                    position: 'absolute',
                                    width: isHovered ? 80 : 50,
                                    height: isHovered ? 80 : 50,
                                    borderRadius: '50%',
                                    background: `radial-gradient(circle, rgba(108,59,255,${isHovered ? 0.2 : 0.05}) 0%, transparent 70%)`,
                                    transition: 'all 0.4s ease',
                                }} />

                                {/* Core node */}
                                <div style={{
                                    position: 'relative',
                                    borderRadius: '50%',
                                    width: isHovered ? 20 : 14,
                                    height: isHovered ? 20 : 14,
                                    background: isHovered ? '#6C3BFF' : 'rgba(108, 59, 255, 0.5)',
                                    boxShadow: isHovered
                                        ? '0 0 20px rgba(108,59,255,0.6), 0 0 40px rgba(108,59,255,0.2)'
                                        : '0 0 10px rgba(108,59,255,0.2)',
                                    transition: 'all 0.3s ease',
                                    animation: 'glow-breathe 3s ease-in-out infinite',
                                    animationDelay: `${delay}s`,
                                }} />

                                {/* Label */}
                                <span style={{
                                    fontSize: isHovered ? 16 : 14,
                                    fontWeight: 500,
                                    whiteSpace: 'nowrap',
                                    color: isHovered ? '#F0F0FF' : '#8888AA',
                                    textShadow: isHovered ? '0 0 20px rgba(108,59,255,0.5)' : 'none',
                                    transition: 'all 0.3s ease',
                                    fontFamily: "'Outfit', sans-serif",
                                    letterSpacing: '0.05em',
                                }}>
                                    {node.label}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
