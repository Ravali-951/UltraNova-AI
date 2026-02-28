'use client'

export type AgentType = 'marketing' | 'product' | 'sales' | 'tech' | 'ops'
export type AgentStatus = 'active' | 'waiting' | 'calculating' | 'vetoing' | 'idle'

interface AgentAvatarProps {
    type: AgentType
    status?: AgentStatus
    size?: 'sm' | 'md' | 'lg'
    showLabel?: boolean
    className?: string
}

const AGENT_CONFIG: Record<AgentType, { label: string; icon: string; color: string; glowColor: string }> = {
    marketing: { label: 'Marketing', icon: '🔥', color: '#FF6B3B', glowColor: 'rgba(255, 107, 59, 0.4)' },
    product: { label: 'Product', icon: '💎', color: '#00A3FF', glowColor: 'rgba(0, 163, 255, 0.4)' },
    sales: { label: 'Sales', icon: '🌿', color: '#00FF9D', glowColor: 'rgba(0, 255, 157, 0.4)' },
    tech: { label: 'Tech', icon: '⚡', color: '#E0E0FF', glowColor: 'rgba(224, 224, 255, 0.3)' },
    ops: { label: 'Ops', icon: '🔮', color: '#8A2BE2', glowColor: 'rgba(138, 43, 226, 0.4)' },
}

const STATUS_TEXT: Record<AgentStatus, string> = {
    active: 'Active',
    waiting: 'Waiting...',
    calculating: 'Calculating...',
    vetoing: 'VETO',
    idle: 'Idle',
}

const sizeMap = {
    sm: { outer: 40, inner: 28, fontSize: 14, iconSize: 12 },
    md: { outer: 56, inner: 40, fontSize: 16, iconSize: 16 },
    lg: { outer: 72, inner: 52, fontSize: 20, iconSize: 22 },
}

export default function AgentAvatar({
    type,
    status = 'idle',
    size = 'md',
    showLabel = true,
    className = '',
}: AgentAvatarProps) {
    const config = AGENT_CONFIG[type]
    const s = sizeMap[size]
    const isActive = status === 'active' || status === 'vetoing'

    const statusDotColor =
        status === 'active' ? '#00FF9D' :
            status === 'vetoing' ? '#FF3B3B' :
                status === 'calculating' ? '#00A3FF' :
                    '#555577'

    const statusDotShadow =
        status === 'active' ? '0 0 8px rgba(0,255,157,0.5)' :
            status === 'vetoing' ? '0 0 8px rgba(255,59,59,0.5)' :
                'none'

    const statusTextColor =
        status === 'vetoing' ? '#FF3B3B' :
            status === 'active' ? '#00FF9D' :
                '#555577'

    return (
        <div className={className} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Avatar circle */}
            <div style={{ position: 'relative', width: s.outer, height: s.outer, flexShrink: 0 }}>
                {/* Outer glow ring */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${config.glowColor} 0%, transparent 70%)`,
                        opacity: isActive ? 1 : 0.3,
                        animation: isActive ? 'glow-breathe 2s ease-in-out infinite' : 'none',
                        transition: 'opacity 0.5s ease',
                    }}
                />

                {/* Inner circle */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: s.inner,
                        height: s.inner,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(20,20,34,0.9), rgba(20,20,34,0.6))',
                        border: `2px solid ${config.color}`,
                        boxShadow: isActive
                            ? `0 0 15px ${config.glowColor}, inset 0 0 10px ${config.glowColor}`
                            : `0 0 5px ${config.glowColor}`,
                        transition: 'all 0.5s ease',
                        fontSize: s.iconSize,
                    }}
                >
                    {config.icon}
                </div>

                {/* Status dot */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: size === 'sm' ? 8 : 10,
                        height: size === 'sm' ? 8 : 10,
                        borderRadius: '50%',
                        background: statusDotColor,
                        boxShadow: statusDotShadow,
                        border: '2px solid #0A0A0F',
                    }}
                />
            </div>

            {/* Label + status */}
            {showLabel && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span
                        style={{
                            fontWeight: 600,
                            color: config.color,
                            fontSize: s.fontSize,
                            fontFamily: "'Outfit', sans-serif",
                        }}
                    >
                        {config.label}
                    </span>
                    <span
                        style={{
                            fontSize: 11,
                            color: statusTextColor,
                            fontWeight: status === 'vetoing' ? 700 : 400,
                        }}
                    >
                        {STATUS_TEXT[status]}
                    </span>
                </div>
            )}
        </div>
    )
}
