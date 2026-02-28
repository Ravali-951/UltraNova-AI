'use client'

import { ReactNode, useState } from 'react'

interface GlowButtonProps {
    children: ReactNode
    onClick?: () => void
    type?: 'button' | 'submit'
    variant?: 'primary' | 'outline' | 'ghost'
    disabled?: boolean
    className?: string
    size?: 'sm' | 'md' | 'lg'
}

const SIZE_STYLES = {
    sm: { padding: '10px 20px', fontSize: '14px' },
    md: { padding: '16px 32px', fontSize: '16px' },
    lg: { padding: '18px 40px', fontSize: '17px' },
}

const VARIANT_BASE = {
    primary: {
        background: 'linear-gradient(135deg, #6C3BFF, #4B0ECC)',
        border: 'none',
        color: 'white',
        boxShadow: '0 0 30px rgba(108, 59, 255, 0.3), 0 4px 20px rgba(0, 0, 0, 0.3)',
    },
    outline: {
        background: 'rgba(108, 59, 255, 0.06)',
        border: '1px solid rgba(108, 59, 255, 0.4)',
        color: 'var(--text-primary)',
        boxShadow: 'none',
    },
    ghost: {
        background: 'rgba(108, 59, 255, 0.08)',
        border: '1px solid rgba(108, 59, 255, 0.15)',
        color: 'var(--text-primary)',
        boxShadow: 'none',
    },
}

export default function GlowButton({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    disabled = false,
    className = '',
    size = 'md',
}: GlowButtonProps) {
    const [hovered, setHovered] = useState(false)

    const sizeStyle = SIZE_STYLES[size]
    const variantStyle = VARIANT_BASE[variant]

    const hoverScale = disabled ? 'scale(1)' : hovered ? 'translateY(-2px) scale(1.02)' : 'scale(1)'

    const hoverShadow =
        variant === 'primary' && hovered && !disabled
            ? '0 0 50px rgba(108, 59, 255, 0.5), 0 4px 30px rgba(0, 0, 0, 0.4)'
            : variant === 'outline' && hovered && !disabled
                ? '0 0 30px rgba(108, 59, 255, 0.15)'
                : variantStyle.boxShadow

    const hoverBg =
        variant === 'outline' && hovered && !disabled
            ? 'rgba(108, 59, 255, 0.12)'
            : variant === 'ghost' && hovered && !disabled
                ? 'rgba(108, 59, 255, 0.15)'
                : variantStyle.background

    const hoverBorder =
        variant === 'outline' && hovered && !disabled
            ? '1px solid rgba(108, 59, 255, 0.6)'
            : variantStyle.border

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={className}
            style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 600,
                borderRadius: '12px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                transition: 'all 0.35s ease-out',
                fontFamily: "'Inter', system-ui, sans-serif",
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
                ...sizeStyle,
                background: hoverBg,
                border: hoverBorder,
                color: variantStyle.color,
                boxShadow: hoverShadow,
                transform: hoverScale,
            }}
        >
            {children}
        </button>
    )
}
