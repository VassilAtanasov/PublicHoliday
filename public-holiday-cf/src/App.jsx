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
  const [aiMode, setAiMode] = useState('mcp')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [systemPrompt, setSystemPrompt] = useState(`You are a precise world holiday reference database. Return ONLY the requested holiday information in clean Markdown format. Never add introductions, conclusions, disclaimers, or any commentary.

RULES:
1. List national public holidays (official non-working days) for the specified date worldwide
2. Always list United States holidays first (if any exist for the date)
3. Group holidays by name, then list affected countries as bullet points under each holiday
4. Within each holiday group, order countries by population (largest first)
5. For holidays unique to one country, list the holiday name with the country as a single bullet
6. Do not hallucinate! If no national public holidays exist for the date, return exactly: "No national public holidays found for this date."
7. Use this format:

## [Holiday Name]
- Country A
- Country B

## [Another Holiday]
- Country C`)
  const [userPrompt, setUserPrompt] = useState(`List national public holidays (off work) on ${getTodayDate()} worldwide.`)

  async function fetchHolidays() {
    if (!date) return
    setLoading(true)
    setError('')
    setResult('')
    try {
      // RAG mode requires userPrompt instead of date
      if (aiMode === 'rag') {
        const res = await fetch(`${API_BASE}/api/holidays-${aiMode}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            date,
            systemPrompt,
            userPrompt 
          })
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
          body: JSON.stringify({ 
            date,
            systemPrompt,
            userPrompt 
          })
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
            <button onClick={() => setAiMode('mcp')} className={aiMode==='mcp'? 'active':''}>MCP</button>
            <button onClick={() => setAiMode('rag')} className={aiMode==='rag'? 'active':''}>RAG</button>
            <button onClick={() => setAiMode('base')} className={aiMode==='base'? 'active':''}>Base</button>
            <button onClick={() => setAiMode('lora')} className={aiMode==='lora'? 'active':''}>LoRA</button>
            <button onClick={() => setAiMode('reasoning')} className={aiMode==='reasoning'? 'active':''}>Reasoning</button>
          </div>

          <button onClick={fetchHolidays} disabled={loading}>{loading? 'Loading...':'Find Holidays'}</button>
        </div>

        {/* Prompts Configuration Section */}
        <div className="prompts-config">
          <h3>Prompts Configuration (Editable)</h3>
          
          <div className="prompt-group">
            <label htmlFor="system-prompt-textarea">System Prompt</label>
            <textarea
              id="system-prompt-textarea"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              disabled={loading}
              className="prompt-textarea"
              placeholder="Enter custom system prompt..."
            />
          </div>

          <div className="prompt-group">
            <label htmlFor="user-prompt-textarea">User Prompt</label>
            <textarea
              id="user-prompt-textarea"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              disabled={loading}
              className="prompt-textarea"
              placeholder="Enter custom user prompt..."
            />
          </div>
        </div>

        <section className="results">
          {error ? <div className="error">{error}</div> : null}
          {result ? <MarkdownRenderer content={result} /> : <p>No results yet</p>}
        </section>
      </main>
    </div>
  )
}