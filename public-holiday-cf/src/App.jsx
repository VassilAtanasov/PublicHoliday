import React, { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://holidays-app.v-atanasov.workers.dev'

function getTodayDate() {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  return new Date(now.getTime() - offset * 60000).toISOString().split('T')[0]
}

function MarkdownRenderer({ content }) {
  if (!content) return null
  const lines = content.split('\n')
  return (
    <div className="markdown">
      {lines.map((l, i) => (
        <p key={i}>{l}</p>
      ))}
    </div>
  )
}

export default function App() {
  const [date, setDate] = useState(getTodayDate())
  const [aiMode, setAiMode] = useState('base')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function fetchHolidays() {
    if (!date) return
    setLoading(true)
    setError('')
    setResult('')
    try {
      // RAG mode requires userPrompt instead of date
      if (aiMode === 'rag') {
        const userPrompt = `List national public holidays on ${date}.`
        const res = await fetch(`${API_BASE}/api/holidays-${aiMode}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userPrompt })
        })

        if (!res.ok) {
          const txt = await res.text()
          throw new Error(txt || `HTTP ${res.status}`)
        }

        const data = await res.json()
        setResult(typeof data.result === 'string' ? data.result : JSON.stringify(data.result, null, 2))
      } else {
        const res = await fetch(`${API_BASE}/api/holidays-${aiMode}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date })
        })

        if (!res.ok) {
          const txt = await res.text()
          throw new Error(txt || `HTTP ${res.status}`)
        }

        const data = await res.json()
        setResult(typeof data.result === 'string' ? data.result : JSON.stringify(data.result, null, 2))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>World Public Holidays</h1>
        <p>Query global national public holidays (uses remote MCP API)</p>
      </header>

      <main className="app-main">
        <div className="controls">
          <div>
            <label>Reference date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>

          <div className="modes">
            <button onClick={() => setAiMode('base')} className={aiMode==='base'? 'active':''}>Base</button>
            <button onClick={() => setAiMode('lora')} className={aiMode==='lora'? 'active':''}>LoRA</button>
            <button onClick={() => setAiMode('mcp')} className={aiMode==='mcp'? 'active':''}>MCP</button>
            <button onClick={() => setAiMode('rag')} className={aiMode==='rag'? 'active':''}>RAG</button>
            <button onClick={() => setAiMode('reasoning')} className={aiMode==='reasoning'? 'active':''}>Reasoning</button>
          </div>

          <button onClick={fetchHolidays} disabled={loading}>{loading? 'Loading...':'Find Holidays'}</button>
        </div>

        <section className="results">
          {error ? <div className="error">{error}</div> : null}
          {result ? <MarkdownRenderer content={result} /> : <p>No results yet</p>}
        </section>
      </main>
    </div>
  )
}