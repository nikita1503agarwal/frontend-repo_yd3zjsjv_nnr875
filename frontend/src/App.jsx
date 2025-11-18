import React, { useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { MessageSquare, FlaskConical, Calendar, Drama, Menu, Send, Bot, Settings } from 'lucide-react'

const Nav = ({ current, onChange }) => {
  const items = [
    { key: 'home', label: 'Home' },
    { key: 'chat', label: 'Chat' },
    { key: 'research', label: 'Deep Research' },
    { key: 'planner', label: 'Weekly Planner' },
    { key: 'roleplay', label: 'Role-play' },
  ]
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 glass rounded-2xl px-3 py-2 flex items-center gap-1">
      {items.map(it => (
        <button key={it.key} onClick={() => onChange(it.key)} className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${current===it.key? 'bg-white/15' : 'hover:bg-white/10'}`}>
          {it.label}
        </button>
      ))}
      <button className="ml-2 p-2 rounded-xl hover:bg-white/10"><Settings size={18} /></button>
    </div>
  )
}

const Hero = ({ onExplore }) => {
  return (
    <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.12),transparent_60%)]" />

      <div className="relative z-10 text-center px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight">
            Fluid AI Workspace
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/70">
            Sleek, modern tools for Chat, Deep Research, Weekly Planning and Role‑play — designed with motion and clarity.
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <button onClick={onExplore} className="btn">
              <MessageSquare size={18} />
              Explore Tools
            </button>
            <a href="#research" className="btn"> <FlaskConical size={18}/> Deep Research</a>
          </div>
        </div>
      </div>
    </section>
  )
}

const Card = ({ title, icon, children, footer }) => (
  <div className="relative rounded-2xl p-6 glass">
    <div className="gradient-ring rounded-2xl" />
    <div className="relative z-10">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white/10">{icon}</div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <div className="mt-4">
        {children}
      </div>
      {footer && (<div className="mt-4 pt-4 border-t border-white/10">{footer}</div>)}
    </div>
  </div>
)

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function ChatPage(){
  const [session] = useState(() => Math.random().toString(36).slice(2))
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if(!input.trim()) return
    const user = { role: 'user', content: input }
    setMessages(m => [...m, user])
    setInput('')
    setLoading(true)
    try{
      const res = await fetch(`${API_BASE}/chat`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ session_id: session, message: user.content }) })
      const data = await res.json()
      setMessages(m => [...m, { role:'assistant', content: data.reply }])
    }catch(e){
      setMessages(m => [...m, { role:'assistant', content: 'Error contacting backend.' }])
    }finally{ setLoading(false) }
  }

  return (
    <div className="grid gap-4 md:grid-cols-5">
      <div className="md:col-span-3 space-y-4">
        <Card title="Conversation" icon={<Bot size={18}/> }>
          <div className="h-72 overflow-y-auto space-y-3 pr-2">
            {messages.map((m,i)=> (
              <div key={i} className={`p-3 rounded-xl ${m.role==='user'? 'bg-white/10' : 'bg-white/5'}`}>{m.content}</div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && send()} className="flex-1 px-3 py-2 rounded-xl bg-white/10 focus:outline-none" placeholder="Ask anything..." />
            <button onClick={send} className="btn"> <Send size={16}/> Send</button>
          </div>
          {loading && <p className="mt-2 text-sm text-white/60">Thinking…</p>}
        </Card>
      </div>
      <div className="md:col-span-2 space-y-4">
        <Card title="Tips" icon={<MessageSquare size={18}/> }>
          <ul className="list-disc list-inside text-white/70 text-sm space-y-1">
            <li>Use precise prompts for better answers.</li>
            <li>Try the research tool for long‑form outputs.</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

function ResearchPage(){
  const [session] = useState(() => Math.random().toString(36).slice(2))
  const [topic, setTopic] = useState('Autonomous agents in product research')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    setResult('')
    try{
      const res = await fetch(`${API_BASE}/research`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ session_id: session, topic }) })
      const data = await res.json()
      setResult(data.result)
    }catch(e){ setResult('Error contacting backend.') }
    finally{ setLoading(false) }
  }

  return (
    <div id="research" className="grid gap-4 md:grid-cols-5">
      <div className="md:col-span-3 space-y-4">
        <Card title="Deep Research" icon={<FlaskConical size={18}/> }>
          <div className="flex gap-2">
            <input value={topic} onChange={e=>setTopic(e.target.value)} className="flex-1 px-3 py-2 rounded-xl bg-white/10 focus:outline-none" />
            <button onClick={run} className="btn">Run</button>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-white/5 whitespace-pre-wrap text-sm max-h-80 overflow-y-auto">{loading? 'Analyzing…' : result}</div>
        </Card>
      </div>
      <div className="md:col-span-2 space-y-4">
        <Card title="Guidance" icon={<FlaskConical size={18}/> }>
          <p className="text-white/70 text-sm">Provide a clear topic. The system will draft a structured brief with key points and next steps.</p>
        </Card>
      </div>
    </div>
  )
}

function PlannerPage(){
  const [session] = useState(() => Math.random().toString(36).slice(2))
  const [focus, setFocus] = useState('Launch a side‑project in 4 weeks')
  const [plan, setPlan] = useState('')
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    setPlan('')
    try{
      const res = await fetch(`${API_BASE}/planner`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ session_id: session, focus }) })
      const data = await res.json()
      setPlan(data.plan)
    }catch(e){ setPlan('Error contacting backend.') }
    finally{ setLoading(false) }
  }

  return (
    <div className="grid gap-4 md:grid-cols-5">
      <div className="md:col-span-3 space-y-4">
        <Card title="Weekly Planner" icon={<Calendar size={18}/> }>
          <div className="flex gap-2">
            <input value={focus} onChange={e=>setFocus(e.target.value)} className="flex-1 px-3 py-2 rounded-xl bg-white/10 focus:outline-none" />
            <button onClick={run} className="btn">Generate</button>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-white/5 whitespace-pre-wrap text-sm max-h-80 overflow-y-auto">{loading? 'Planning…' : plan}</div>
        </Card>
      </div>
      <div className="md:col-span-2 space-y-4">
        <Card title="Note" icon={<Calendar size={18}/> }>
          <p className="text-white/70 text-sm">Outputs may be JSON-like. Paste into your task tool or keep it here.</p>
        </Card>
      </div>
    </div>
  )
}

function RoleplayPage(){
  const [session] = useState(() => Math.random().toString(36).slice(2))
  const [persona, setPersona] = useState('Seasoned product manager')
  const [message, setMessage] = useState('Help me refine the onboarding flow for a mobile app.')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    setReply('')
    try{
      const res = await fetch(`${API_BASE}/roleplay`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ session_id: session, persona, message }) })
      const data = await res.json()
      setReply(data.reply)
    }catch(e){ setReply('Error contacting backend.') }
    finally{ setLoading(false) }
  }

  return (
    <div className="grid gap-4 md:grid-cols-5">
      <div className="md:col-span-3 space-y-4">
        <Card title="Role‑play" icon={<Drama size={18}/> }>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input value={persona} onChange={e=>setPersona(e.target.value)} className="px-3 py-2 rounded-xl bg-white/10 focus:outline-none md:col-span-1" />
            <input value={message} onChange={e=>setMessage(e.target.value)} className="px-3 py-2 rounded-xl bg-white/10 focus:outline-none md:col-span-2" />
          </div>
          <div className="mt-3"><button onClick={run} className="btn">Start</button></div>
          <div className="mt-4 p-4 rounded-xl bg-white/5 whitespace-pre-wrap text-sm max-h-80 overflow-y-auto">{loading? 'Acting…' : reply}</div>
        </Card>
      </div>
      <div className="md:col-span-2 space-y-4">
        <Card title="Examples" icon={<Drama size={18}/> }>
          <ul className="list-disc list-inside text-white/70 text-sm space-y-1">
            <li>Socratic tutor for algorithms.</li>
            <li>UX researcher interviewing you.</li>
            <li>Career coach running a mock interview.</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default function App(){
  const [page, setPage] = useState('home')

  return (
    <div className="min-h-screen">
      <Nav current={page} onChange={setPage} />

      {page==='home' && (
        <>
          <Hero onExplore={() => setPage('chat')} />
          <section className="px-6 max-w-6xl mx-auto -mt-16 relative z-10">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card title="Chat" icon={<MessageSquare size={18}/> } footer={<button onClick={()=>setPage('chat')} className="btn">Open</button>}>
                <p className="text-white/70 text-sm">Fast, conversational interface that connects to your local models via Ollama.</p>
              </Card>
              <Card title="Deep Research" icon={<FlaskConical size={18}/> } footer={<button onClick={()=>setPage('research')} className="btn">Open</button>}>
                <p className="text-white/70 text-sm">Structured briefs with key points, sources and next steps.</p>
              </Card>
              <Card title="Weekly Planner" icon={<Calendar size={18}/> } footer={<button onClick={()=>setPage('planner')} className="btn">Open</button>}>
                <p className="text-white/70 text-sm">Generate a crisp weekly plan tailored to your goals.</p>
              </Card>
              <Card title="Role‑play" icon={<Drama size={18}/> } footer={<button onClick={()=>setPage('roleplay')} className="btn">Open</button>}>
                <p className="text-white/70 text-sm">Practice scenarios with dynamic personas that stay in character.</p>
              </Card>
            </div>
          </section>
        </>
      )}

      {page==='chat' && <section className="px-6 max-w-6xl mx-auto py-10"><ChatPage/></section>}
      {page==='research' && <section className="px-6 max-w-6xl mx-auto py-10"><ResearchPage/></section>}
      {page==='planner' && <section className="px-6 max-w-6xl mx-auto py-10"><PlannerPage/></section>}
      {page==='roleplay' && <section className="px-6 max-w-6xl mx-auto py-10"><RoleplayPage/></section>}

      <footer className="px-6 py-10 text-center text-white/40">Built for local models via Ollama. Configure your backend URL in settings.</footer>
    </div>
  )
}
