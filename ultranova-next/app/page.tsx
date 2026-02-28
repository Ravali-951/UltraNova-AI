'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import GlowButton from './components/GlowButton'
import GlassPanel from './components/GlassPanel'

/* ─── Feature orbs data ─── */
const ORBS = [
  {
    label: 'Think',
    icon: '🧠',
    color: '#6C3BFF',
    glow: 'rgba(108, 59, 255, 0.35)',
    points: ['Idea validation', 'Market analysis', 'Competitor breakdown'],
  },
  {
    label: 'Build',
    icon: '🛠️',
    color: '#00A3FF',
    glow: 'rgba(0, 163, 255, 0.35)',
    points: ['MVP structure', 'Landing pages', 'Tech architecture'],
  },
  {
    label: 'Grow',
    icon: '📈',
    color: '#00FF9D',
    glow: 'rgba(0, 255, 157, 0.35)',
    points: ['Ad campaigns', 'Content generation', 'Funnel optimization'],
  },
]

const FEATURES = [
  {
    icon: '🧠',
    title: 'Think',
    color: '#6C3BFF',
    glowBg: 'rgba(108,59,255,0.12)',
    points: ['Idea validation & scoring', 'Market opportunity analysis', 'Competitor landscape mapping'],
  },
  {
    icon: '🛠️',
    title: 'Build',
    color: '#00A3FF',
    glowBg: 'rgba(0,163,255,0.12)',
    points: ['MVP structure & priorities', 'Technical architecture planning', 'Resource allocation strategy'],
  },
  {
    icon: '📈',
    title: 'Grow',
    color: '#00FF9D',
    glowBg: 'rgba(0,255,157,0.12)',
    points: ['Go-to-market strategy', 'Content & campaign generation', 'Funnel optimization playbooks'],
  },
  {
    icon: '🤖',
    title: 'Automate',
    color: '#FF6B3B',
    glowBg: 'rgba(255,107,59,0.12)',
    points: ['AI-powered sales outreach', 'Automated customer support', 'Operations workflow agents'],
  },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Input Your Idea', desc: 'Tell UltraNova what you want to build — in your own words.', color: '#6C3BFF' },
  { step: '02', title: 'Strategy Agent Activates', desc: 'AI analyzes, structures, and stress-tests your concept.', color: '#00A3FF' },
  { step: '03', title: 'Team Logic Engages', desc: 'Marketing, Product, Sales, Tech, and Ops agents evaluate.', color: '#00FF9D' },
  { step: '04', title: 'Hard Truth Engine', desc: 'Get unfiltered feedback with a confidence score and action plan.', color: '#FF6B3B' },
]

/* ─── Scroll reveal hook ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

function RevealSection({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useScrollReveal()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `all 0.9s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const [hoveredOrb, setHoveredOrb] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <>
      {/* ═══════ HERO SECTION ═══════ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', overflow: 'hidden' }}>
        {/* Ambient gradient behind hero */}
        <div
          style={{
            position: 'absolute',
            width: 800,
            height: 800,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(108,59,255,0.08) 0%, transparent 70%)',
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${(mousePos.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.02}px), calc(-50% + ${(mousePos.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.02}px))`,
            transition: 'transform 0.3s ease-out',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 960, margin: '0 auto', zIndex: 3 }}>
          {/* Eyebrow */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 999,
              marginBottom: 32,
              background: 'rgba(108, 59, 255, 0.1)',
              border: '1px solid rgba(108, 59, 255, 0.2)',
              animation: 'fade-in-up 0.8s ease-out forwards',
            }}
          >
            <div
              style={{ width: 8, height: 8, borderRadius: '50%', background: '#00FF9D', boxShadow: '0 0 8px rgba(0,255,157,0.5)' }}
            />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              AI Founder Operating System — Now in Early Access
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 8,
              letterSpacing: '-0.03em',
              animation: 'fade-in-up 0.8s ease-out 0.15s backwards',
            }}
          >
            Meet{' '}
            <span style={{
              color: 'var(--text-primary)'
            }}>
              UltraNova
            </span>
          </h1>

          {/* Subtitle */}
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(1.4rem, 3.5vw, 2.5rem)',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              marginBottom: 24,
              animation: 'fade-in-up 0.8s ease-out 0.25s backwards',
            }}
          >
            Your AI Co-Founder
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              maxWidth: 600,
              margin: '0 auto 48px',
              animation: 'fade-in-up 0.8s ease-out 0.35s backwards',
            }}
          >
            Five AI agents debate, decide, and defend your startup vision.
            From idea validation to roadmap execution — with hard truths included.
          </p>

          {/* Floating orbs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 32,
              marginBottom: 48,
              animation: 'fade-in-up 0.8s ease-out 0.45s backwards',
            }}
          >
            {ORBS.map((orb, i) => (
              <div
                key={i}
                style={{ position: 'relative', cursor: 'pointer' }}
                onMouseEnter={() => setHoveredOrb(i)}
                onMouseLeave={() => setHoveredOrb(null)}
              >
                {/* Orb */}
                <div
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `radial-gradient(circle at 40% 35%, ${orb.glow}, rgba(20,20,34,0.8) 70%)`,
                    border: `1px solid ${hoveredOrb === i ? orb.color : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: hoveredOrb === i
                      ? `0 0 40px ${orb.glow}, inset 0 0 30px ${orb.glow}`
                      : `0 0 15px ${orb.glow.replace('0.35', '0.1')}`,
                    transform: hoveredOrb === i ? 'translateY(-8px) scale(1.08)' : 'translateY(0)',
                    transition: 'all 0.5s ease',
                    animation: `float-heavy 4s ease-in-out infinite`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                >
                  <span style={{ fontSize: 32, marginBottom: 4 }}>{orb.icon}</span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: orb.color,
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {orb.label}
                  </span>
                </div>

                {/* Hover tooltip */}
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: `translateX(-50%) translateY(${hoveredOrb === i ? 16 : 6}px)`,
                    width: 200,
                    padding: '12px 16px',
                    background: '#0a0a0a',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(108, 59, 255, 0.4)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    borderRadius: 12,
                    opacity: hoveredOrb === i ? 1 : 0,
                    pointerEvents: 'none',
                    transition: 'all 0.3s ease',
                    zIndex: 10,
                  }}
                >
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {orb.points.map((pt, j) => (
                      <li
                        key={j}
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: j < orb.points.length - 1 ? 6 : 0,
                        }}
                      >
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: orb.color, flexShrink: 0 }} />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              justifyContent: 'center',
              animation: 'fade-in-up 0.8s ease-out 0.6s backwards',
            }}
          >
            <Link href="/waitlist" style={{ textDecoration: 'none' }}>
              <GlowButton variant="primary" size="lg">
                🚀 Get Early Access
              </GlowButton>
            </Link>
            <Link href="/console" style={{ textDecoration: 'none' }}>
              <GlowButton variant="outline" size="lg">
                🎥 See the Console
              </GlowButton>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            animation: 'scroll-bounce 2s ease-in-out infinite',
            zIndex: 3,
          }}
        >
          <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Scroll to explore
          </span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555577" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ═══════ BIG IDEA SECTION ═══════ */}
      <section style={{ position: 'relative', padding: '120px 24px', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 0%, rgba(108,59,255,0.03) 50%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <RevealSection>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                marginBottom: 32,
              }}
            >
              This isn&apos;t another tool.
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #fff, #6C3BFF, #00A3FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                This is your second brain for business.
              </span>
            </h2>
          </RevealSection>
          <RevealSection delay={0.15}>
            <p style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
              UltraNova is an AI Founder Operating System that helps founders validate ideas,
              make decisions, plan roadmaps, align teams, and avoid costly mistakes — all through
              a council of specialized AI agents that debate <em>for you</em>.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* ═══════ FEATURES SECTION ═══════ */}
      <section style={{ position: 'relative', padding: '80px 24px 100px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <RevealSection>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              What UltraNova Does
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 56 }}>
              Five specialized agents. One powerful decision.
            </p>
          </RevealSection>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
            }}
          >
            {FEATURES.map((feature, i) => (
              <RevealSection key={i} delay={i * 0.1}>
                <GlassPanel style={{ padding: 28 }}>
                  {/* Icon */}
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      background: feature.glowBg,
                      border: `1px solid ${feature.color}30`,
                      marginBottom: 16,
                    }}
                  >
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: feature.color,
                      fontFamily: "'Outfit', sans-serif",
                      marginBottom: 12,
                    }}
                  >
                    {feature.title}
                  </h3>

                  {/* Points */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {feature.points.map((point, j) => (
                      <li
                        key={j}
                        style={{
                          fontSize: 13,
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          marginBottom: j < feature.points.length - 1 ? 8 : 0,
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            background: feature.color,
                            flexShrink: 0,
                          }}
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </GlassPanel>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section style={{ position: 'relative', padding: '80px 24px 100px', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent, rgba(108,59,255,0.02), transparent)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <RevealSection>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              How UltraNova Works
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 56 }}>
              From idea to action in four steps.
            </p>
          </RevealSection>

          <div style={{ position: 'relative' }}>
            {/* Vertical connecting line */}
            <div
              style={{
                position: 'absolute',
                left: 28,
                top: 0,
                bottom: 0,
                width: 2,
                background: 'linear-gradient(180deg, #6C3BFF, #00A3FF, #00FF9D, #FF6B3B)',
                opacity: 0.2,
                borderRadius: 1,
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {HOW_IT_WORKS.map((item, i) => (
                <RevealSection key={i} delay={i * 0.12}>
                  <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                    {/* Step number node */}
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        background: `radial-gradient(circle at 40% 35%, ${item.color}30, #141422 70%)`,
                        border: `2px solid ${item.color}40`,
                        boxShadow: `0 0 20px ${item.color}20`,
                        position: 'relative',
                        zIndex: 2,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: item.color,
                          fontFamily: "'Outfit', sans-serif",
                        }}
                      >
                        {item.step}
                      </span>
                    </div>

                    <GlassPanel style={{ flex: 1, padding: 24 }}>
                      <h3
                        style={{
                          fontSize: 17,
                          fontWeight: 700,
                          fontFamily: "'Outfit', sans-serif",
                          marginBottom: 6,
                          color: '#F0F0FF',
                        }}
                      >
                        {item.title}
                      </h3>
                      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                        {item.desc}
                      </p>
                    </GlassPanel>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CTA SECTION ═══════ */}
      <section style={{ position: 'relative', padding: '120px 24px' }}>
        <RevealSection>
          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(1.8rem, 5vw, 3rem)',
                fontWeight: 700,
                marginBottom: 24,
              }}
            >
              Ready to think{' '}
              <span style={{
                background: 'linear-gradient(135deg, #6C3BFF, #00A3FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                differently
              </span>
              ?
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text-secondary)', marginBottom: 40 }}>
              Join the waitlist and be among the first founders to have an AI council at their side.
            </p>
            <Link href="/waitlist" style={{ textDecoration: 'none' }}>
              <GlowButton variant="primary" size="lg">
                ⚡ Activate Your Beacon
              </GlowButton>
            </Link>
          </div>
        </RevealSection>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer
        style={{
          padding: '40px 24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif",
              color: 'var(--text-primary)',
            }}
          >
            UltraNova
          </span>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
            © 2026 UltraNova. Building the future with AI.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Console', 'Roadmap', 'Team'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#6C3BFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#555577')}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </>
  )
}