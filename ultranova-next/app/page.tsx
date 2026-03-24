'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTheme } from './components/ThemeContext'
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
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [hoveredOrb, setHoveredOrb] = useState<number | null>(null)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
  const [viewportSize, setViewportSize] = useState({ width: 1200, height: 800 })

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    
    const handleMouse = (e: MouseEvent) => {
      setMouseOffset({
        x: (e.clientX - window.innerWidth / 2) * 0.02,
        y: (e.clientY - window.innerHeight / 2) * 0.02
      })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState("");
  const [hoveredOrb, setHoveredOrb] = useState<number | null>(null)

  const handleSubmit = async () => {
  try {
    const res = await fetch("https://ultranova-ai-r9rx.onrender.com/founder/think", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idea: idea,
        business_id: "demo",
        runway_months: 6,
        product_clarity: 7,
        features: [],
      }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  } catch (error: any) {
    console.error(error);
  }
};



  const isSmallMobile = viewportSize.width < 480
  const isTablet = viewportSize.width < 1024

  return (
    <>

      {/* ═══════ HERO SECTION ═══════ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 clamp(16px,4vw,48px)', overflow: 'hidden' }}>
        {/* Ambient gradient behind hero */}
        <div
          style={{
            position: 'absolute',
            width: isTablet ? '120vw' : '800px',
            height: isTablet ? '120vw' : '800px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(108,59,255,0.08) 0%, transparent 70%)',
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${mouseOffset.x}px), calc(-50% + ${mouseOffset.y}px))`,
            transition: 'transform 0.3s ease-out',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
<div
  style={{
    position: 'absolute',
    width: 800,
    height: 800,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(108,59,255,0.08) 0%, transparent 70%)',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',  // Fixed position, no mouse tracking
    pointerEvents: 'none',
  }}
/>

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 960, margin: '0 auto', zIndex: 3, padding: isSmallMobile ? '80px 0 40px' : '40px 0' }}>
          {/* Eyebrow */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: isSmallMobile ? '6px 12px' : '8px 16px',
              borderRadius: 999,
              marginBottom: isSmallMobile ? 24 : 32,
              background: 'rgba(108, 59, 255, 0.1)',
              border: '1px solid rgba(108, 59, 255, 0.2)',
              animation: 'fade-in-up 0.8s ease-out forwards',
            }}
          >
            <div
              style={{ width: 8, height: 8, borderRadius: '50%', background: '#00FF9D', boxShadow: '0 0 8px rgba(0,255,157,0.5)' }}
            />
            <span style={{ fontSize: isSmallMobile ? 11 : 13, color: 'var(--text-secondary)' }}>
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
              fontSize: 'clamp(1.2rem, 3.5vw, 2.5rem)',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              marginBottom: isSmallMobile ? 16 : 24,
              animation: 'fade-in-up 0.8s ease-out 0.25s backwards',
            }}
          >
            Your AI Co-Founder
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: isSmallMobile ? 15 : 17,
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              maxWidth: 600,
              padding: isSmallMobile ? '0 10px' : '0',
              margin: isSmallMobile ? '0 auto 32px' : '0 auto 48px',
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
              gap: isSmallMobile ? 12 : 32,
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
                    width: isSmallMobile ? 92 : 115,
                    height: isSmallMobile ? 92 : 115,
                    width: 'clamp(80px,20vw,110px)',
height: 'clamp(80px,20vw,110px)',
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // Use filled theme colors - significantly darker/richer in light mode as requested
                    backgroundColor: isDark ? `${orb.color}25` : `${orb.color}48`,
                    border: 'none', 
                    boxShadow: hoveredOrb === i
                      ? `0 15px 45px ${orb.glow}, inset 0 0 20px ${orb.glow}`
                      : (isDark ? `0 8px 25px rgba(0,0,0,0.3)` : `0 10px 30px ${orb.color}15`),
                    transform: hoveredOrb === i ? 'translateY(-10px) scale(1.1)' : 'translateY(0)',
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    animation: `float-heavy 4s ease-in-out infinite`,
                    animationDelay: `${i * 0.5}s`,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <span style={{ 
                    fontSize: isSmallMobile ? 26 : 34, 
                    marginBottom: 4,
                    filter: isDark ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' : 'drop-shadow(0 4px 10px rgba(0,0,0,0.15))'
                  }}>{orb.icon}</span>
                  <span
                    style={{
                      fontSize: isSmallMobile ? 11 : 13,
                      fontWeight: 800,
                      color: isDark ? 'white' : orb.color,
                      fontFamily: "'Outfit', sans-serif",
                      letterSpacing: '0.02em',
                      textShadow: isDark ? `0 2px 8px ${orb.color}80` : 'none'
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
                    width: 'min(200px,80vw)',
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
              <GlowButton variant="primary" size={isSmallMobile ? "md" : "lg"}>
                🚀 Get Early Access
              </GlowButton>
              <GlowButton  variant="primary" size="lg" onClick={handleSubmit}>
  🚀 Get Early Access
</GlowButton>
            </Link>
            <Link href="/console" style={{ textDecoration: 'none' }}>
              <GlowButton variant="outline" size={isSmallMobile ? "md" : "lg"}>
                🎥 See the Console
              </GlowButton>
            </Link>
          </div>
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
                      width: 56,
                      height: 56,
                      borderRadius: '50%', // Strictly circular as requested
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      background: isDark ? feature.glowBg : `${feature.color}45`,
                      border: 'none',
                      marginBottom: 16,
                      boxShadow: isDark ? `0 0 20px ${feature.color}20` : `0 4px 12px ${feature.color}20`,
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
      <section style={{ position: 'relative', padding: '100px 24px 140px', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isDark 
              ? 'linear-gradient(180deg, transparent, rgba(108,59,255,0.03), transparent)'
              : 'linear-gradient(180deg, transparent, rgba(108,59,255,0.02), transparent)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: 840, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <RevealSection>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: 16,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)'
              }}
            >
              How UltraNova Works
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 70, fontSize: 16 }}>
              From initial spark to battle-hardened strategy in four phases.
            </p>
          </RevealSection>

          <div style={{ position: 'relative' }}>
            {/* Vertical connecting line - Theme adaptive */}
            <div style={{ 
              position: 'absolute', left: 40, top: 40, bottom: 40, width: 2, 
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)', 
              zIndex: 1 
            }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {HOW_IT_WORKS.map((item, i) => (
                <RevealSection key={i} delay={i * 0.15}>
                  <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', position: 'relative' }}>
                    {/* Synchronized Step Node - Theme adaptive */}
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        backgroundColor: isDark ? 'rgba(10, 10, 15, 0.4)' : `${item.color}08`,
                        border: isDark 
                          ? `1.5px solid ${item.color}40` 
                          : `1.5px solid ${item.color}80`, // Stronger border in light mode
                        boxShadow: isDark 
                          ? `0 0 30px ${item.color}15, inset 0 0 15px ${item.color}10` 
                          : `0 4px 15px ${item.color}15`,
                        position: 'relative',
                        zIndex: 2,
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 900,
                          color: item.color,
                          fontFamily: 'monospace',
                          letterSpacing: '0.05em'
                        }}
                      >
                        {item.step}
                      </span>
                      
                      {/* Section line highlight */}
                      {i < HOW_IT_WORKS.length - 1 && (
                        <div style={{ 
                          position: 'absolute', top: 80, width: 2, height: 32, 
                          background: `linear-gradient(to bottom, ${item.color}, ${HOW_IT_WORKS[i+1].color})`,
                          opacity: isDark ? 0.5 : 0.4 
                        }} />
                      )}
                    </div>

                    <GlassPanel style={{ 
                      flex: 1, 
                      padding: '32px 40px', 
                      border: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(0,0,0,0.03)',
                      background: isDark ? 'var(--glass-bg)' : '#ffffff',
                      boxShadow: isDark ? 'var(--glass-shadow)' : '0 10px 30px rgba(0,0,0,0.04)'
                    }}>
                      <h3
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          fontFamily: "'Outfit', sans-serif",
                          marginBottom: 10,
                          color: 'var(--text-primary)',
                          letterSpacing: '-0.01em'
                        }}
                      >
                        {item.title}
                      </h3>
                      <p style={{ 
                        fontSize: 15, 
                        color: isDark ? 'rgba(255,255,255,0.5)' : '#4B5563', 
                        lineHeight: 1.6, 
                        margin: 0, 
                        fontWeight: 400 
                      }}>
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