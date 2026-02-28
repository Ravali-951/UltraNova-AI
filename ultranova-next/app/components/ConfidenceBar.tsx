'use client'

interface ConfidenceBarProps {
    value: number  // 0-100
    label?: string
    color?: string
    showPercentage?: boolean
    className?: string
    size?: 'sm' | 'md'
}

export default function ConfidenceBar({
    value,
    label,
    color = '#6C3BFF',
    showPercentage = true,
    className = '',
    size = 'md',
}: ConfidenceBarProps) {
    const clampedValue = Math.max(0, Math.min(100, value))
    const height = size === 'sm' ? 4 : 6

    return (
        <div className={className} style={{ width: '100%' }}>
            {(label || showPercentage) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    {label && (
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                            {label}
                        </span>
                    )}
                    {showPercentage && (
                        <span style={{ fontSize: 13, fontWeight: 600, color, fontVariantNumeric: 'tabular-nums' }}>
                            {clampedValue}%
                        </span>
                    )}
                </div>
            )}
            <div
                style={{
                    width: '100%',
                    height,
                    borderRadius: height / 2,
                    background: 'var(--border-subtle)',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        borderRadius: height / 2,
                        width: `${clampedValue}%`,
                        background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                        boxShadow: `0 0 12px ${color}60`,
                        transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                    }}
                >
                    {/* Sonar pulse at tip */}
                    <div
                        style={{
                            position: 'absolute',
                            right: -3,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: color,
                            boxShadow: `0 0 10px ${color}`,
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
