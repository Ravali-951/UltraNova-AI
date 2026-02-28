'use client'

import { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    idea_description: '',
    stage: ''
  })

const [status, setStatus] = useState('idle') 
  
const handleSubmit = async (e) => {
  e.preventDefault()
  setStatus('loading')
  
  try {
    const response = await axios.post('http://localhost:8000/waitlist/join', {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      idea_description: formData.idea_description,
      stage: formData.stage
    })
    
    console.log('Success:', response.data)
    setStatus('success')
    
    // Clear form
    setFormData({
      name: '',
      email: '',
      role: '',
      idea_description: '',
      stage: ''
    })
    
  } catch (error) {
    console.error('Error:', error)
    alert(error.response?.data?.detail || 'Something went wrong')
    setStatus('idle')
  }
}

  return (
    <main className="min-h-screen bg-black text-white">
      
      {/* ===== HERO SECTION ===== */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Meet Ultranova —{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Your AI Co-Founder
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-8">
            Think. Build. Grow. Turn ideas into scalable startups.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#waitlist"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold hover:scale-105 transition"
            >
              🚀 Get Early Access
            </Link>
            
            <Link 
              href="#how-it-works"
              className="border border-gray-600 hover:border-gray-400 text-white px-8 py-4 rounded-lg font-bold transition"
            >
              🎥 See How It Works
            </Link>
          </div>
        </div>
      </div>

      {/* ===== BIG IDEA ===== */}
      <div className="py-24 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            This isn't another tool.<br />
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              This is your second brain for business.
            </span>
          </h2>
          <p className="text-xl text-gray-400">
            UltraNova is an AI Founder Operating System that helps founders validate ideas, 
            make decisions, plan roadmap, align teams, and avoid mistakes.
          </p>
        </div>
      </div>

      {/* ===== FEATURES ===== */}
      <div className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What UltraNova Does
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '🧠', title: 'Think', points: ['Idea validation', 'Market analysis', 'Competitor breakdown'] },
              { icon: '🛠️', title: 'Build', points: ['MVP structure', 'Landing pages', 'Tech architecture'] },
              { icon: '📈', title: 'Grow', points: ['Ad campaigns', 'Content generation', 'Funnel optimization'] },
              { icon: '🤖', title: 'Automate', points: ['AI sales agents', 'Customer support', 'Operations'] }
            ].map((item, i) => (
              <div key={i} className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <ul className="space-y-2 text-gray-400">
                  {item.points.map((point, j) => (
                    <li key={j}>• {point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <div id="how-it-works" className="py-24 px-4 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How UltraNova Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { step: '1', title: 'Input Your Idea', desc: 'Tell UltraNova what you want to build' },
              { step: '2', title: 'Strategy Agent', desc: 'AI analyzes and structures your idea' },
              { step: '3', title: 'Team Logic', desc: 'Marketing, Product, Sales, Tech, Ops evaluate' },
              { step: '4', title: 'Hard Truth Engine', desc: 'Get real feedback + confidence score' }
            ].map((item, i) => (
              <div key={i} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== WAITLIST FORM ===== */}
      <div id="waitlist" className="py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
            <h2 className="text-3xl font-bold text-center mb-4">
              Get Early Access
            </h2>
            
            <p className="text-gray-400 text-center mb-8">
              Join the waitlist for UltraNova Founder OS
            </p>

            {status === 'success' ? (
              <div className="bg-green-500/20 border border-green-500 text-green-400 p-8 rounded-xl text-center">
                <p className="text-2xl mb-2">🎉 You're on the list!</p>
                <p>Check your email for confirmation.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-4 bg-gray-900 rounded-lg border border-gray-700"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full p-4 bg-gray-900 rounded-lg border border-gray-700"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                
                <select
                  className="w-full p-4 bg-gray-900 rounded-lg border border-gray-700"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  required
                >
                  <option value="">Select your role</option>
                  <option value="founder">Founder</option>
                  <option value="developer">Developer</option>
                  <option value="marketer">Marketer</option>
                  <option value="other">Other</option>
                </select>
                
                <textarea
                  placeholder="What do you want to build?"
                  rows="3"
                  className="w-full p-4 bg-gray-900 rounded-lg border border-gray-700"
                  value={formData.idea_description}
                  onChange={(e) => setFormData({...formData, idea_description: e.target.value})}
                  required
                />
                
                <select
                  className="w-full p-4 bg-gray-900 rounded-lg border border-gray-700"
                  value={formData.stage}
                  onChange={(e) => setFormData({...formData, stage: e.target.value})}
                >
                  <option value="">Current stage (optional)</option>
                  <option value="idea">Just an idea</option>
                  <option value="mvp">Have MVP</option>
                  <option value="revenue">Generating revenue</option>
                </select>
                
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg font-bold"
                >
                  {status === 'loading' ? 'Joining...' : '🚀 Join Waitlist'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          <p>© 2026 UltraNova. Building the future with AI.</p>
        </div>
      </footer>
    </main>
  )
}