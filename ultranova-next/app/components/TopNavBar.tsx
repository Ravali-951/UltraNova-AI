'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from './ThemeContext'
import ThemeToggle from './ThemeToggle'
import UltraNovaLogo from './UltraNovaLogo'

const NAV_LINKS = [
    { label: 'Console', href: '/console', icon: '🖥️', color: '#6C3BFF', desc: 'Decision war room' },
    { label: 'Roadmap', href: '/roadmap', icon: '🗺️', color: '#00A3FF', desc: 'Timeline nexus' },
    { label: 'Team', href: '/team', icon: '👥', color: '#00FF9D', desc: 'Agent council' },
    { label: 'Decisions', href: '/decisions', icon: '⭐', color: '#FF6B3B', desc: 'Memory palace' },
]

const ALL_PAGES = [
    { label: 'Home', href: '/', icon: '🏠', color: '#F0F0FF', desc: 'The Horizon' },
    { label: 'Waitlist', href: '/waitlist', icon: '🚀', color: '#8A2BE2', desc: 'Neural signature' },
    ...NAV_LINKS,
]

export default function TopNavBar() {
    const pathname = usePathname()
    const router = useRouter()
    const { theme } = useTheme()
    const isDark = theme === 'dark'
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [hoveredLink, setHoveredLink] = useState<string | null>(null)
    const [scrolled, setScrolled] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => {
            document.removeEventListener('mousedown', handleClick)
            document.body.style.overflow = 'auto' // Reset overflow on unmount
        }
    }, [])

    // Prevent scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [mobileMenuOpen])

    // Scroll detection for background opacity
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const isHome = pathname === '/'

    return (
        <>
            <nav
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100, // Increased for overall nav
                    padding: '0 24px',
                    transition: 'all 0.4s ease',
                    background: scrolled ? 'var(--glass-bg)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(24px)' : 'blur(12px)',
                    borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
                }}
            >
                <div
                    style={{
                        maxWidth: 1280,
                        margin: '0 auto',
                        height: 64,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                    }}
                >
                    {/* ─── Left Side: Back + Logo ─── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                        {!isHome && (
                            <button
                                onClick={() => router.back()}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: 38, height: 38, borderRadius: '50%',
                                    background: 'var(--glass-bg)', border: '1px solid var(--border-subtle)',
                                    color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                    e.currentTarget.style.background = 'var(--hover-bg)'
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.background = 'var(--glass-bg)'
                                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'
                                }}
                                title="Go back"
                                aria-label="Go back"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translateX(-1px)' }}>
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                        )}
                        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            <UltraNovaLogo height={60} />
                        </Link>
                    </div>

                    {/* ─── Center Nav Links (Desktop) ─── */}
                    {!isMobile && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            {NAV_LINKS.map((link) => {
                                const isActive = pathname === link.href
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        style={{
                                            textDecoration: 'none',
                                            padding: '8px 16px',
                                            borderRadius: 8,
                                            fontSize: 14,
                                            fontWeight: 500,
                                            fontFamily: "'Inter', sans-serif",
                                            color: isActive ? link.color : 'var(--text-secondary)',
                                            background: isActive ? `${link.color}10` : 'transparent',
                                            border: `1px solid ${isActive ? `${link.color}25` : 'transparent'}`,
                                            transition: 'all 0.3s ease',
                                            whiteSpace: 'nowrap',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.color = 'var(--text-primary)'
                                                e.currentTarget.style.background = 'var(--hover-bg)'
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.color = 'var(--text-secondary)'
                                                e.currentTarget.style.background = 'transparent'
                                            }
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            })}
                        </div>
                    )}

                    {/* ─── Right Side: Theme Toggle + Explore Dropdown ─── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                        {!isMobile && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginRight: 4 }}>
                                <span 
                                    key={theme} // Key forces re-render for animation
                                    style={{ 
                                        fontSize: 10, fontWeight: 700, textTransform: 'uppercase', 
                                        letterSpacing: '0.12em', 
                                        color: 'var(--text-muted)', // Reverted to match theme
                                        userSelect: 'none',
                                        animation: 'fade-slide-in 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                        opacity: 0.8
                                    }}
                                >
                                    {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                </span>
                                <ThemeToggle />
                            </div>
                        )}
                        
                        {/* Hamburger Button (Mobile) */}
                        {isMobile && (
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                style={{
                                    width: 40, height: 40, borderRadius: 10,
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5,
                                    background: mobileMenuOpen ? 'rgba(108,59,255,0.15)' : 'rgba(255,255,255,0.05)',
                                    border: `1px solid ${mobileMenuOpen ? 'rgba(108,59,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
                                    color: mobileMenuOpen ? '#6C3BFF' : 'white',
                                    cursor: 'pointer', transition: 'all 0.3s ease',
                                    zIndex: 201, // Always stay on top of drawer
                                }}
                            >
                                <span style={{ 
                                    width: 20, height: 2, background: 'currentColor', borderRadius: 2,
                                    transition: 'all 0.3s ease',
                                    transform: mobileMenuOpen ? 'translateY(7px) rotate(45deg)' : 'none'
                                }} />
                                <span style={{ 
                                    width: 20, height: 2, background: 'currentColor', borderRadius: 2,
                                    transition: 'all 0.3s ease',
                                    opacity: mobileMenuOpen ? 0 : 1
                                }} />
                                <span style={{ 
                                    width: 20, height: 2, background: 'currentColor', borderRadius: 2,
                                    transition: 'all 0.3s ease',
                                    transform: mobileMenuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none'
                                }} />
                            </button>
                        )}

                        {/* Explore Dropdown (Desktop) ... */}
                        {!isMobile && (
                            <div ref={dropdownRef} style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 10,
                                        fontSize: 14, fontWeight: 600, fontFamily: "'Inter', sans-serif", cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        background: dropdownOpen ? 'rgba(108,59,255,0.15)' : 'rgba(255,255,255,0.04)',
                                        border: `1px solid ${dropdownOpen ? 'rgba(108,59,255,0.35)' : 'rgba(255,255,255,0.08)'}`,
                                        color: dropdownOpen ? '#6C3BFF' : 'var(--text-secondary)',
                                    }}
                                >
                                    <span>Explore</span>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transition: 'transform 0.35s ease', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </button>
                                {/* ... dropdown menu content ... */}
                                <div
                                    style={{
                                        position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: 300, borderRadius: 16, overflow: 'hidden',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        opacity: dropdownOpen ? 1 : 0, transform: dropdownOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.96)',
                                        pointerEvents: dropdownOpen ? 'auto' : 'none',
                                        background: 'rgba(15,15,22,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(108,59,255,0.2)',
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                                    }}
                                >
                                    <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>Navigate to</span>
                                    </div>
                                    <div style={{ padding: '8px 8px 12px' }}>
                                        {ALL_PAGES.map((page) => (
                                            <Link key={page.href} href={page.href} onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 10, textDecoration: 'none', transition: 'all 0.2s ease', background: pathname === page.href ? 'rgba(108,59,255,0.1)' : 'transparent' }}>
                                                <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>{page.icon}</div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 14, fontWeight: 600, color: pathname === page.href ? page.color : 'white' }}>{page.label}</div>
                                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{page.desc}</div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* ─── Mobile Menu Backdrop ─── */}
            <div
                onClick={() => setMobileMenuOpen(false)}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(12px)',
                    zIndex: 149, // Just below Sidebar
                    opacity: mobileMenuOpen ? 1 : 0,
                    pointerEvents: mobileMenuOpen ? 'auto' : 'none',
                    transition: 'opacity 0.4s ease',
                }}
            />

            {/* ─── Mobile Menu Sidebar (Drawer) ─── */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: 'min(340px, 85vw)',
                    backgroundColor: '#0A0A0F', // Explicit solid color
                    zIndex: 150, // Above everything
                    padding: '100px 20px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 24,
                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
                    boxShadow: '-10px 0 50px rgba(0,0,0,0.8)',
                    borderLeft: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                {/* Explicit Close Button for Sidebar */}
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                        position: 'absolute',
                        top: 24,
                        right: 24,
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    }}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
                {/* Background Decor */}
                <div style={{
                    position: 'absolute', bottom: '-5%', left: '-5%',
                    width: '300px', height: '300px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(108,59,255,0.1) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: -1,
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: 8, paddingLeft: 10 }}>
                        System Access
                    </span>
                    {ALL_PAGES.map((page) => (
                        <Link
                            key={page.href}
                            href={page.href}
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 16,
                                padding: '16px', borderRadius: 16,
                                textDecoration: 'none',
                                background: pathname === page.href ? 'rgba(108,59,255,0.12)' : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${pathname === page.href ? 'rgba(108,59,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <span style={{ fontSize: 22 }}>{page.icon}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 16, fontWeight: 700, color: pathname === page.href ? '#6C3BFF' : 'white' }}>
                                    {page.label}
                                </div>
                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{page.desc}</div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '14px 18px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Appearance</span>
                        <ThemeToggle />
                    </div>
                    <Link
                        href="/waitlist"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: 12, padding: '18px', borderRadius: 16,
                            textDecoration: 'none', fontSize: 15, fontWeight: 800, color: 'white',
                            background: 'linear-gradient(135deg, #6C3BFF, #4B10DD)',
                            boxShadow: '0 15px 40px rgba(108,59,255,0.25)',
                        }}
                    >
                        🚀 Join Genesis Phase
                    </Link>
                </div>
            </div>
        </>
    )
}
