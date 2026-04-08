'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

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

const VARIANTS = {
    primary: {
        background: 'linear-gradient(135deg, #6C3BFF, #4B0ECC)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#FFFFFF',
        shadow: '0 0 30px rgba(108, 59, 255, 0.3)',
        hoverShadow: '0 0 50px rgba(108, 59, 255, 0.5), 0 0 100px rgba(108, 59, 255, 0.2)'
    },
    outline: {
        background: 'rgba(108, 59, 255, 0.05)',
        border: '1px solid rgba(108, 59, 255, 0.3)',
        color: 'var(--text-primary)',
        shadow: '0 0 0px transparent',
        hoverShadow: '0 0 30px rgba(108, 59, 255, 0.15)'
    },
    ghost: {
        background: 'transparent',
        border: '1px solid transparent',
        color: 'var(--text-primary)',
        shadow: '0 0 0px transparent',
        hoverShadow: '0 0 15px rgba(108, 59, 255, 0.1)'
    }
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
    const v = VARIANTS[variant]
    const s = SIZE_STYLES[size]

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={className}
            whileHover={disabled ? {} : { 
                scale: 1.02, 
                y: -2,
                boxShadow: v.hoverShadow,
                background: variant === 'outline' ? 'rgba(108, 59, 255, 0.1)' : v.background
            }}
            whileTap={disabled ? {} : { scale: 0.96, y: 0 }}
            initial={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 15
            }}
            style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 600,
                borderRadius: '14px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
                fontFamily: "'Inter', system-ui, sans-serif",
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
                ...s,
                background: v.background,
                border: v.border,
                color: v.color,
                boxShadow: v.shadow,
                outline: 'none'
            }}
        >
            <motion.div
                initial={false}
                animate={{ opacity: disabled ? 0.5 : 1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
                {children}
            </motion.div>
        </motion.button>
    )
}
