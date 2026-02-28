import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 16px',
        background: '#0A0A0F',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 96,
            fontWeight: 700,
            marginBottom: 8,
            background: 'linear-gradient(135deg, #6C3BFF, #00A3FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </h1>
        <p style={{ fontSize: 18, marginBottom: 32, color: '#8888AA' }}>
          This sector of space is uncharted.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '14px 32px',
            borderRadius: 12,
            fontWeight: 600,
            textDecoration: 'none',
            background: 'linear-gradient(135deg, #6C3BFF, #4B0ECC)',
            color: 'white',
            boxShadow: '0 0 30px rgba(108, 59, 255, 0.3)',
            transition: 'all 0.3s ease',
          }}
        >
          Return to Base
        </Link>
      </div>
    </div>
  )
}