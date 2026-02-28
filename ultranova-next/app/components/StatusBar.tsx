'use client'

import ConfidenceBar from './ConfidenceBar'

interface StatusBarProps {
    runway?: string
    confidence?: number
    status?: string
}

export default function StatusBar({
    runway = '18 months',
    confidence = 82,
    status = 'All systems operational',
}: StatusBarProps) {
    return (
        <div
            className="glass-panel"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 24,
                flexWrap: 'wrap',
                padding: '14px 24px',
            }}
        >
            {/* Runway */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>
                    Runway
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--growth-green)' }}>
                    {runway}
                </span>
            </div>

            {/* Confidence */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, maxWidth: 280 }}>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    Confidence
                </span>
                <ConfidenceBar value={confidence} showPercentage={true} size="sm" />
            </div>

            {/* System Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'var(--growth-green)',
                        boxShadow: '0 0 8px var(--growth-green-dim)',
                    }}
                />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {status}
                </span>
            </div>
        </div>
    )
}
