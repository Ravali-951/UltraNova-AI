'use client'

import { ReactNode } from 'react'

interface GlassPanelProps {
    children: ReactNode
    glow?: boolean
    className?: string
    style?: React.CSSProperties
}

export default function GlassPanel({
    children,
    glow = false,
    className = '',
    style = {},
}: GlassPanelProps) {
    return (
        <div
            className={className}
            style={{
                background: glow ? 'var(--glass-glow-bg)' : 'var(--glass-bg)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: glow
                    ? '1px solid var(--glass-glow-border)'
                    : '1px solid var(--glass-border)',
                borderRadius: '14px',
                boxShadow: glow ? 'var(--glass-glow-shadow)' : 'none',
                overflow: 'hidden',
                transition: 'background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease',
                ...style,
            }}
        >
            {children}
        </div>
    )
}
