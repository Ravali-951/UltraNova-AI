import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Ultranova AI - AI Agents That Run Your Business on Autopilot',
  description: '21-year-old AI engineer building custom AI agents for businesses. Skip the hype - get agents that actually work.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
