export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0A0A0F',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <div style={{ position: 'relative', width: 80, height: 80 }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const angle = (i / 5) * Math.PI * 2 - Math.PI / 2
            const x = 30 + Math.cos(angle) * 25
            const y = 30 + Math.sin(angle) * 25
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  borderRadius: '50%',
                  width: 8,
                  height: 8,
                  left: x,
                  top: y,
                  background: '#6C3BFF',
                  boxShadow: '0 0 12px rgba(108, 59, 255, 0.5)',
                  animation: `glow-breathe 1.5s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            )
          })}
          <div
            style={{
              position: 'absolute',
              borderRadius: '50%',
              width: 12,
              height: 12,
              left: 24,
              top: 24,
              background: '#00A3FF',
              boxShadow: '0 0 20px rgba(0, 163, 255, 0.4)',
              animation: 'glow-breathe 2s ease-in-out infinite',
            }}
          />
        </div>
        <span
          style={{
            fontSize: 13,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#555577',
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          Initializing Neural Network...
        </span>
      </div>
    </div>
  )
}