'use client'

export default function PulseHeartbeat() {
    return (
        <div
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120vmax',
                height: '120vmax',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(108, 59, 255, 0.04) 0%, transparent 60%)',
                animation: 'neural-pulse 15s ease-in-out infinite',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        />
    )
}
