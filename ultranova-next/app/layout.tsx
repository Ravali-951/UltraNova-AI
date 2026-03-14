import './globals.css'
import { Inter, Outfit } from 'next/font/google'
import { ThemeProvider } from './components/ThemeContext'
import TopNavBar from './components/TopNavBar'
import PulseHeartbeat from './components/PulseHeartbeat'
import ParticleCanvas from './components/ParticleCanvas'
import NeoBrutalistBackground from './components/NeoBrutalistBackground'
import Chatbot from './components/Chatbot'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata = {
  title: 'UltraNova — Your AI Co-Founder | Think. Build. Grow.',
  description:
    'UltraNova is an AI Founder Operating System. Five AI agents debate, decide, and defend your startup vision. Join the waitlist.',
  keywords: 'AI, startup, co-founder, founder OS, decision making, AI agents',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
      <body
        className={inter.className}
        style={{
          background: 'var(--deep-space)',
          color: 'var(--text-primary)',
          margin: 0,
          padding: 0,
        }}
      >
        <ThemeProvider>
          <ParticleCanvas particleCount={100} interactive baseHue={260} />
          <NeoBrutalistBackground />
          <PulseHeartbeat />

          <TopNavBar />

          {/* RESPONSIVE WRAPPER */}
          <main
  style={{
    position: 'relative',
    zIndex: 2,
    paddingTop: 80,
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    paddingLeft: 'clamp(16px,4vw,32px)',
    paddingRight: 'clamp(16px,4vw,32px)',
  }}
>
            {children}
          </main>

          <Chatbot />
        </ThemeProvider>
      </body>
    </html>
  )
}