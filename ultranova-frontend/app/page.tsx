"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Rocket,
  Brain,
  Target,
  TrendingUp,
  AlertTriangle,
  MessageCircle,
  X,
  Sparkles
} from "lucide-react"

type Message = {
  role: "user" | "assistant"
  content: string
  timestamp: string
}



export default function Home() {
  const [idea, setIdea] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("vision")
  const [darkMode, setDarkMode] = useState(true)
  const [copilotOpen, setCopilotOpen] = useState(false)

  const [messages, setMessages] = useState<Message[]>([])

  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)

  const chatRef = useRef<HTMLDivElement>(null)

  // Auto scroll
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth"
    })
  }, [messages, chatLoading])

  const getTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const callBackend = async () => {
    setLoading(true)
    setResult(null)

    setTimeout(() => {
      setResult({
        vision: "Build the AI operating system for startup founders.",
        roadmap: {
          now: ["Validate ICP", "Launch Landing Page"],
          next: ["Build MVP", "Start Beta Users"],
          later: ["Fundraising", "Scale Growth"]
        },
        decision: {
          chosen: "Proceed",
          confidence: 0.82
        }
      })
      setLoading(false)
    }, 1500)
  }

  const sendMessage = async () => {
  if (!chatInput.trim()) return

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmb3VuZGVyXzEiLCJleHAiOjE3NzA5NDg4MDR9.oKAv5Yk8zFG2YNWJ0rqM1pxbPtCOmJanFG_xfmwpzEY"

  try {
    const response = await fetch("http://127.0.0.1:8000/founder/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        message: chatInput
      })
    })


    const data = await response.json()

    const aiMessage: Message = {
      role: "assistant",
      content: data.reply || "No response received.",
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages(prev => [...prev, aiMessage])
  } catch (error) {
    console.error(error)
  }

  setChatLoading(false)
}


  return (
    <div
      className={`min-h-screen transition-all duration-500 ${darkMode
          ? "bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white"
          : "bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-900"
        }`}
    >
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold flex items-center gap-2">
          UltraNova FounderOS <Rocket className="text-indigo-400" />
        </h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-10"
        >
          <h2 className="text-2xl mb-6 text-center">
            AI Startup Intelligence Platform
          </h2>

          <div className="flex gap-4 flex-col md:flex-row">
            <input
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Enter your startup idea..."
              className="flex-1 px-6 py-4 rounded-xl bg-white/20 border border-white/30 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={callBackend}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 shadow-xl hover:opacity-90 transition"
            >
              {loading ? "Thinking..." : "Generate Strategy"}
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Dashboard */}
      <AnimatePresence>
        {result && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 pb-20 max-w-4xl mx-auto space-y-10"
          >
            {/* Metrics */}
            <div className="grid md:grid-cols-3 gap-6">
              <MetricCard
                icon={<Brain />}
                label="Confidence"
                value={`${result.decision.confidence * 100}%`}
              />
              <MetricCard icon={<TrendingUp />} label="Market Readiness" value="High" />
              <MetricCard icon={<AlertTriangle />} label="Risk Level" value="Medium" />
            </div>

            {/* Tabs */}
            <div className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-2xl p-8">
              <div className="flex gap-6 mb-6 border-b border-white/20">
                {["vision", "roadmap", "decision"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 capitalize ${activeTab === tab
                        ? "border-b-2 border-indigo-400 text-indigo-400"
                        : "opacity-60"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === "vision" && result?.vision && (
  <div>
    <h3 className="text-lg font-semibold mb-2">Strategic Vision</h3>
    <p>{result.vision}</p>
  </div>
)}


              {activeTab === "roadmap" && (
                <div className="space-y-6">
                  {["now", "next", "later"].map((phase) => (
                    <div key={phase}>
                      <h4 className="text-indigo-400 font-semibold capitalize mb-2">
                        {phase}
                      </h4>
                      <ul className="space-y-2">
                        {result.roadmap[phase].map((item: string, i: number) => (
                          <li key={i} className="flex gap-2 items-center">
                            <Target size={16} /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "decision" && (
                <div>
                  <p className="text-xl font-semibold">
                    {result.decision.chosen}
                  </p>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-sm">
                    Confidence {result.decision.confidence}
                  </span>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Floating Copilot Button */}
      <button
        onClick={() => setCopilotOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 shadow-2xl flex items-center justify-center"
      >
        <MessageCircle />
      </button>

      {/* Copilot Panel */}
      <AnimatePresence>
        {copilotOpen && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="fixed top-0 right-0 w-full sm:w-96 h-full bg-[#0f172a] text-white shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-center p-5 border-b border-white/10">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles size={18} /> Founder Copilot
              </h3>
              <button onClick={() => setCopilotOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-xs text-sm ${msg.role === "user"
                        ? "bg-indigo-600"
                        : "bg-white/10 backdrop-blur-md"
                      }`}
                  >
                    <p>{msg.content}</p>
                    <div className="text-[10px] opacity-50 mt-1 text-right">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl bg-white/10 flex gap-1">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce delay-100">•</span>
                    <span className="animate-bounce delay-200">•</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 px-4 py-2 rounded-xl bg-white/10 outline-none"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MetricCard({ icon, label, value }: any) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl"
    >
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-sm opacity-70">{label}</span>
      </div>
      <div className="text-2xl font-semibold">{value}</div>
    </motion.div>
  )
}
