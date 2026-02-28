'use client'

import { useTheme } from './ThemeContext'

const RAYS = [0, 45, 90, 135, 180, 225, 270, 315]
const STARS = [
    { x: 3, y: 5, r: 1, d: 0 },
    { x: 20, y: 4, r: 0.7, d: 0.1 },
    { x: 5, y: 20, r: 0.9, d: 0.15 },
]

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <button
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            style={{
                position: 'relative',
                width: 42,
                height: 42,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
                overflow: 'hidden',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,200,50,0.12)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,180,0,0.25)'}`,
                boxShadow: isDark
                    ? 'none'
                    : '0 0 20px rgba(255,200,50,0.15), inset 0 0 12px rgba(255,200,50,0.05)',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)'
                e.currentTarget.style.boxShadow = isDark
                    ? '0 0 20px rgba(192,200,255,0.15)'
                    : '0 0 25px rgba(255,200,50,0.25)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = isDark
                    ? 'none'
                    : '0 0 20px rgba(255,200,50,0.15), inset 0 0 12px rgba(255,200,50,0.05)'
            }}
        >
            {/* Rotating icon container */}
            <div
                style={{
                    width: 22,
                    height: 22,
                    position: 'relative',
                    transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: `rotate(${isDark ? '40' : '90'}deg)`,
                }}
            >
                <svg viewBox="0 0 24 24" width="22" height="22" style={{ overflow: 'visible' }}>
                    <defs>
                        <mask id="celestial-mask">
                            <rect width="24" height="24" fill="white" />
                            <circle
                                cx="15"
                                cy="9"
                                r="5"
                                fill="black"
                                style={{
                                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transform: isDark ? 'translateX(0)' : 'translateX(14px)',
                                }}
                            />
                        </mask>
                    </defs>

                    {/* Sun rays — animate outward in light mode */}
                    {RAYS.map((angle, i) => {
                        const rad = (angle * Math.PI) / 180
                        return (
                            <line
                                key={i}
                                x1={12 + Math.cos(rad) * 9}
                                y1={12 + Math.sin(rad) * 9}
                                x2={12 + Math.cos(rad) * 11.5}
                                y2={12 + Math.sin(rad) * 11.5}
                                stroke="#FFB800"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                style={{
                                    transition: `opacity 0.35s ease ${isDark ? '0s' : `${i * 0.03}s`}, transform 0.4s ease`,
                                    opacity: isDark ? 0 : 1,
                                    transformOrigin: '12px 12px',
                                    transform: isDark ? 'scale(0.3)' : 'scale(1)',
                                }}
                            />
                        )
                    })}

                    {/* Core celestial body — circle with mask for crescent */}
                    <circle
                        cx="12"
                        cy="12"
                        r="5.5"
                        fill={isDark ? '#C0C8FF' : '#FFB800'}
                        mask="url(#celestial-mask)"
                        style={{ transition: 'fill 0.5s ease' }}
                    />

                    {/* Stars — visible in dark mode */}
                    {STARS.map((star, i) => (
                        <circle
                            key={`s${i}`}
                            cx={star.x}
                            cy={star.y}
                            r={star.r}
                            fill="#C0C8FF"
                            style={{
                                transition: `opacity 0.4s ease ${isDark ? `${star.d + 0.3}s` : '0s'}, transform 0.4s ease`,
                                opacity: isDark ? 0.7 : 0,
                                transformOrigin: `${star.x}px ${star.y}px`,
                                transform: isDark ? 'scale(1)' : 'scale(0)',
                            }}
                        />
                    ))}
                </svg>
            </div>
        </button>
    )
}
