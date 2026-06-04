import React, { useState, useRef } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://holidays-app.v-atanasov.workers.dev'

function getTodayDate() {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  return new Date(now.getTime() - offset * 60000).toISOString().split('T')[0]
}

function formatDate(date) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${date}T00:00:00Z`))
  } catch (err) {
    return date
  }
}

// Lightweight Markdown renderer for streamed content
function MarkdownRenderer({ content }) {
  if (!content) return null

  const lines = content.split('\n')

  return (
    <div className="markdown" style={{ fontFamily: 'sans-serif', fontSize: '14px', lineHeight: '1.6', color: '#e2e8f0', textAlign: 'left' }}>
      {lines.map((line, idx) => {
        const trimmed = line.trim()

        // Headings (### or ## or #)
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} style={{ fontSize: '16px', fontWeight: 'bold', color: '#2dd4bf', marginTop: '16px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {renderInlineStyles(trimmed.slice(4))}
            </h4>
          )
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} style={{ fontSize: '18px', fontWeight: 'bold', color: '#38bdf8', marginTop: '20px', marginBottom: '8px', borderBottom: '1px solid #0f172a' }}>
              {renderInlineStyles(trimmed.slice(3))}
            </h3>
          )
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={idx} style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', marginTop: '24px', marginBottom: '12px', background: 'linear-gradient(to right, #38bdf8, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {renderInlineStyles(trimmed.slice(2))}
            </h2>
          )
        }

        // Unordered lists (- or * or •)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
          return (
            <ul key={idx} style={{ margin: '4px 0', paddingLeft: '20px' }}>
              <li key={idx} style={{ color: '#cbd5e1' }}>
                {renderInlineStyles(trimmed.slice(2))}
              </li>
            </ul>
          )
        }

        // Numbered lists (e.g. 1. )
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/)
        if (numMatch) {
          return (
            <ol key={idx} style={{ margin: '4px 0', paddingLeft: '20px', listStyle: 'decimal' }} start={parseInt(numMatch[1])}>
              <li key={idx} style={{ color: '#cbd5e1' }}>
                {renderInlineStyles(numMatch[2])}
              </li>
            </ol>
          )
        }

        // Blockquotes
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={idx} style={{ borderLeft: '4px solid #14b8a6', paddingLeft: '16px', paddingTop: '4px', paddingBottom: '4px', margin: '8px 0', background: 'rgba(2, 6, 23, 0.4)', borderRadius: '0 12px 12px 0', fontStyle: 'italic', color: '#94a3b8' }}>
              {renderInlineStyles(trimmed.slice(2))}
            </blockquote>
          )
        }

        // Empty line
        if (trimmed === '') {
          return <div key={idx} style={{ height: '8px' }} />
        }

        // Regular paragraph
        return (
          <p key={idx} style={{ color: '#cbd5e1', margin: '4px 0' }}>
            {renderInlineStyles(line)}
          </p>
        )
      })}
    </div>
  )
}

function renderInlineStyles(text) {
  if (!text) return ''

  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g)

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} style={{ fontWeight: 'bold', color: '#fff' }}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={idx} style={{ padding: '2px 6px', borderRadius: '4px', background: '#0f172a', border: '1px solid #1e293b', color: '#7dd3fc', fontFamily: 'monospace', fontSize: '12px' }}>{part.slice(1, -1)}</code>
    }
    return part
  })
}

function buildSystemPrompt(formattedDate, modeSuffix) {
  const basePrompt = `You are a precise world holiday reference database. Return ONLY the requested holiday information in clean Markdown format. Never add introductions, conclusions, disclaimers, or any commentary.

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
- Country C

Today is ${formattedDate}.`

  if (modeSuffix) {
    return `${basePrompt} ${modeSuffix}`
  }

  return basePrompt
}

function buildReasoningSystemPrompt(formattedDate) {
  return `You are an authoritative world public holiday database. Return the requested holiday data in clean Markdown.

DEFINITIONS:
- "National public holiday" = an official government-declared non-working day for the entire country.
- Include: independence days, republic days, national days, liberation days, constitution days, revolution days, and widely observed religious holidays that are official non-working days nationwide.
- Exclude: regional/state-only holidays, bank-only closures, school holidays.

STEP-BY-STEP REASONING APPROACH:
1. Identify the target date and day of week.
2. Check the United States first. If the US has a holiday on this date, list it first.
3. Sweep each region by explicitly checking the named countries below:
   - North America: USA, Canada, Mexico
   - South America: Brazil, Colombia, Argentina, Peru, Venezuela, Chile, Ecuador, Bolivia, Paraguay, Uruguay
   - Europe: Germany, France, UK, Italy, Spain, Poland, Romania, Netherlands, Belgium, Portugal, Sweden, Norway, Finland, Denmark, Austria, Switzerland, Czech Republic, Hungary, Greece, Croatia, Serbia, Bulgaria, Slovakia, Ireland, Luxembourg
   - Africa: Nigeria, Ethiopia, Egypt, DRC, Tanzania, Kenya, South Africa, Algeria, Sudan, Morocco, Ghana, Mozambique, Angola, Ivory Coast, Cameroon, Madagascar
   - Middle East: Turkey, Iran, Iraq, Saudi Arabia, Yemen, Syria, UAE, Jordan, Israel, Kuwait, Bahrain, Qatar, Oman, Lebanon
   - South & SE Asia: India, Indonesia, Pakistan, Bangladesh, Vietnam, Philippines, Thailand, Myanmar, Malaysia, Nepal, Sri Lanka, Cambodia, Laos
   - East Asia: China, Japan, South Korea, Taiwan, Mongolia
   - Oceania: Australia, New Zealand, Papua New Guinea, Fiji
4. For EACH named country, ask: "Does this country have a national public holiday on [date]?" Consider:
   a) Fixed-date national days: independence days, republic days, national days, liberation/revolution/constitution days
   b) Moveable holidays for the exact year: Easter-derived, Islamic Hijri calendar, lunar/Buddhist calendar
5. MANDATORY final cross-check: "Is [month] [day] the independence day, republic day, national day, or liberation day of ANY country?" — well-known fixed national days MUST be included even if you feel less than fully certain. It is better to include a genuine holiday than to omit it.
6. Write the output. For any well-known national day you recall (e.g. a republic day, independence day), include it confidently — these are established historical facts, not hallucinations.

OUTPUT FORMAT — use exactly this structure:

## [Holiday Name]
- [Largest-population country first]
- [Next country by population]

For a holiday in one country only:
## [Holiday Name]
- [Country]

If truly no national public holidays exist for this date (after completing all steps above):
No national public holidays found for this date.

OUTPUT RULES:
- Every holiday gets a ## heading. Never write "Holiday - Country" inline.
- Countries under each heading are ordered by population (largest first).
- United States holidays appear first, before all others.
- Do not list the same country under two different headings.

Today is ${formattedDate}.`
}

export default function App() {
  const [date, setDate] = useState(getTodayDate())
  const [aiMode, setAiMode] = useState('mcp')
  const [result, setResult] = useState('')
  const [source, setSource] = useState('')
  const [reasoningOutput, setReasoningOutput] = useState(null)

  // Prompts states
  const [systemPrompt, setSystemPrompt] = useState(() => {
    const formatted = formatDate(getTodayDate())
    return buildSystemPrompt(formatted)
  })
  const [userPrompt, setUserPrompt] = useState(() => {
    const formatted = formatDate(getTodayDate())
    return `List national public holidays (off work) on ${formatted} worldwide.`
  })

  // System prompts cache for each mode
  const [systemPrompts, setSystemPrompts] = useState(() => {
    const formatted = formatDate(getTodayDate())
    return {
      base: buildSystemPrompt(formatted),
      lora: buildSystemPrompt(formatted),
      mcp: buildSystemPrompt(formatted),
      rag: buildSystemPrompt(formatted),
      reasoning: buildReasoningSystemPrompt(formatted),
    }
  })

  // Execution cache for each mode
  const [executionCache, setExecutionCache] = useState(() => ({
    base: { result: '', source: '', rawRequest: null, rawResponse: null, reasoning: null, error: '' },
    lora: { result: '', source: '', rawRequest: null, rawResponse: null, reasoning: null, error: '' },
    mcp: { result: '', source: '', rawRequest: null, rawResponse: null, reasoning: null, error: '' },
    rag: { result: '', source: '', rawRequest: null, rawResponse: null, reasoning: null, error: '' },
    reasoning: { result: '', source: '', rawRequest: null, rawResponse: null, reasoning: null, error: '' },
  }))

  const [rawRequest, setRawRequest] = useState(null)
  const [rawResponse, setRawResponse] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [statusSteps, setStatusSteps] = useState([])
  const hasAutoLoaded = useRef(false)

  const isReasoningMode = aiMode === 'reasoning'

  function updatePromptsForDate(prevDateStr, newDateStr) {
    const prevFormatted = formatDate(prevDateStr)
    const newFormatted = formatDate(newDateStr)

    // Update the system prompts cache for each mode
    setSystemPrompts(prev => {
      const next = { ...prev }
      for (const mode of Object.keys(next)) {
        next[mode] = next[mode].replaceAll(prevFormatted, newFormatted)
      }
      return next
    })

    // Update the active system prompt
    setSystemPrompt(prev => prev.replaceAll(prevFormatted, newFormatted))

    // Update the shared user prompt
    setUserPrompt(prev => prev.replaceAll(prevFormatted, newFormatted))
  }

  function handleAiModeChange(newMode) {
    // Save current active system prompt & execution details into the cache of the OLD mode
    setSystemPrompts(prev => ({
      ...prev,
      [aiMode]: systemPrompt
    }))

    setExecutionCache(prev => ({
      ...prev,
      [aiMode]: { result, source, rawRequest, rawResponse, reasoning: reasoningOutput, error }
    }))

    // Load system prompt & execution details from the cache of the NEW mode
    setAiMode(newMode)
    setSystemPrompt(systemPrompts[newMode])

    const cached = executionCache[newMode]
    setResult(cached.result)
    setSource(cached.source)
    setRawRequest(cached.rawRequest)
    setRawResponse(cached.rawResponse)
    setReasoningOutput(cached.reasoning)
    setError(cached.error)
    setStatusSteps([])
  }

  async function fetchHolidays(
    selectedDate,
    customSystemPrompt,
    customUserPrompt
  ) {
    if (!selectedDate) {
      setError('Choose a date before checking holidays.')
      setResult('')
      setSource('')
      return
    }

    setLoading(true)
    setError('')
    setResult('')
    setSource(aiMode)
    setReasoningOutput(null)
    setStatusSteps([])
    setRawRequest(null)
    setRawResponse(null)

    const payload = {
      date: selectedDate,
      systemPrompt: customSystemPrompt ?? systemPrompt,
      userPrompt: customUserPrompt ?? userPrompt,
    }

    // For reasoning mode, add raw: true to get reasoning content
    const apiEndpoint = `${API_BASE}/api/holidays-${aiMode}`
    const requestBody = aiMode === 'reasoning'
      ? { ...payload, raw: true }
      : payload

    setRawRequest(requestBody)

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        let errText = `HTTP ${response.status}: Failed to connect.`
        try {
          const errData = await response.json()
          errText = errData.error || errText
        } catch (e) {}
        throw new Error(errText)
      }

      if (!response.body) {
        throw new Error('No response body received for streaming.')
      }

      // SSE Streaming: Read response body progressively
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      let currentResult = ''
      let currentReasoning = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed) continue

          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6).trim()
            if (dataStr === '[DONE]') {
              break
            }

            try {
              const dataJson = JSON.parse(dataStr)
              if (dataJson.type === 'status') {
                setStatusSteps(prev => [...prev, dataJson.message])
              } else if (dataJson.type === 'reasoning') {
                currentReasoning += dataJson.text
                setReasoningOutput(currentReasoning)
              } else if (dataJson.type === 'content') {
                currentResult += dataJson.text
                setResult(currentResult)
              } else if (dataJson.type === 'error') {
                throw new Error(dataJson.error || 'An error occurred during streaming.')
              } else if (dataJson.type === 'done') {
                break
              }
            } catch (e) {
              if (e instanceof SyntaxError) {
                console.warn('Failed to parse SSE data JSON line:', trimmed, e)
              } else {
                throw e // Propagate custom errors to outer catch
              }
            }
          }
        }
      }

      // Mock rawResponse layout for debug view
      const mockedResponse = {
        result: {
          response: currentResult,
          reasoning: currentReasoning || undefined
        },
        source: aiMode,
        streaming: true
      }
      setRawResponse(mockedResponse)

      // Cache this execution
      setExecutionCache(prev => ({
        ...prev,
        [aiMode]: {
          result: currentResult,
          source: aiMode,
          rawRequest: requestBody,
          rawResponse: mockedResponse,
          reasoning: currentReasoning || null,
          error: ''
        }
      }))

    } catch (error) {
      console.error('Error:', error)
      const errMessage = 'Could not check holidays right now.' + (error instanceof Error ? ` Details: ${error.message}` : '')
      setError(errMessage)

      // Cache this error
      setExecutionCache(prev => ({
        ...prev,
        [aiMode]: {
          result: '',
          source: '',
          rawRequest: requestBody,
          rawResponse: null,
          reasoning: null,
          error: errMessage
        }
      }))
    } finally {
      setLoading(false)
    }
  }

  function handleDateChange(newDate) {
    if (!newDate) return
    updatePromptsForDate(date, newDate)
    setDate(newDate)
  }

  function handleSubmit() {
    void fetchHolidays(date, systemPrompt, userPrompt)
  }

  function changeDate(days) {
    if (!date) return
    try {
      const current = new Date(`${date}T00:00:00Z`)
      if (isNaN(current.getTime())) return
      current.setUTCDate(current.getUTCDate() + days)
      const newDateStr = current.toISOString().split('T')[0]

      updatePromptsForDate(date, newDateStr)
      setDate(newDateStr)
    } catch (err) {
      console.error('Failed to navigate date:', err)
    }
  }

  function handlePresetClick(presetDate) {
    updatePromptsForDate(date, presetDate)
    setDate(presetDate)
  }

  const PRESETS = [
    { label: 'New Year 2026', date: '2026-01-01' },
    { label: 'US Independence 2026', date: '2026-07-04' },
    { label: 'Christmas 2026', date: '2026-12-25' },
    { label: 'New Year 2027', date: '2027-01-01' },
  ]

  // Source badge styling
  function getSourceBadgeStyle(src) {
    if (src === 'mcp')
      return { background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)' }
    if (src === 'model' || src === 'base')
      return { background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.2)' }
    if (src === 'lora')
      return { background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.2)' }
    if (src === 'rag')
      return { background: 'rgba(45, 212, 191, 0.1)', color: '#2dd4bf', border: '1px solid rgba(45, 212, 191, 0.2)' }
    if (src === 'reasoning')
      return { background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.2)' }
    return { background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.2)' }
  }

  function getSourceLabel(src) {
    if (src === 'mcp') return 'MCP Worker Data Verified'
    if (src === 'model' || src === 'base') return 'AI Pretrained Knowledge'
    if (src === 'lora') return 'LoRA Model Output'
    if (src === 'rag') return 'Vector-RAG Knowledge'
    if (src === 'reasoning') return 'Qwen Reasoning Model'
    return 'AI Model Fallback'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#020617',
      color: '#e2e8f0',
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Aurora glow elements */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.1)', filter: 'blur(120px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', filter: 'blur(120px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '30%', right: '10%', width: '30%', height: '30%', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.05)', filter: 'blur(100px)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%',
        maxWidth: '900px',
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(30, 41, 59, 0.8)',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
      }}>

        {/* Header */}
        <header style={{ gap: '16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 'bold',
              textTransform: 'uppercase', letterSpacing: '0.05em',
              background: 'rgba(14, 165, 233, 0.1)', color: '#38bdf8', border: '1px solid rgba(14, 165, 233, 0.2)'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', animation: 'pulse 2s infinite' }} />
              MCP Enabled API
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 'bold',
              textTransform: 'uppercase', letterSpacing: '0.05em',
              background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.2)'
            }}>
              Llama 3.1 8B Instruct
            </span>
          </div>

          <h1 style={{
            fontSize: '36px', fontWeight: 'bold', letterSpacing: '-0.025em',
            background: 'linear-gradient(to right, #fff, #e2e8f0, #94a3b8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            World Public Holidays
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '600px', lineHeight: '1.6' }}>
            Instantly query live holiday data via Model Context Protocol or fallback dynamically to AI general knowledge for unsupported dates.
          </p>
        </header>

        {/* Date Selector and Navigation */}
        <section style={{
          background: 'rgba(2, 6, 23, 0.4)', border: '1px solid rgba(30, 41, 59, 0.5)',
          borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', sm: 'flexDirection: row' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <label htmlFor="holiday-date-input" style={{ fontSize: '14px', fontWeight: 'bold', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Choose Reference Date
                </label>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  background: '#0f172a', padding: '4px', borderRadius: '12px', border: '1px solid #1e293b'
                }}>
                  {['base', 'lora', 'mcp', 'rag', 'reasoning'].map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => handleAiModeChange(mode)}
                      style={{
                        padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', borderRadius: '8px',
                        textTransform: 'capitalize',
                        background: aiMode === mode ? (mode === 'base' ? '#6b7280' : mode === 'lora' ? '#0ea5e9' : mode === 'mcp' ? '#6366f1' : mode === 'rag' ? '#14b8a6' : '#8b5cf6') : 'transparent',
                        color: aiMode === mode ? '#fff' : '#94a3b8',
                        border: aiMode === mode ? 'none' : 'none',
                        cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Previous Day Button */}
                <button
                  type="button"
                  onClick={() => changeDate(-1)}
                  disabled={loading || aiMode === 'rag'}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '48px', height: '48px', borderRadius: '16px',
                    background: '#0f172a', border: '1px solid #1e293b',
                    color: loading || aiMode === 'rag' ? '#475569' : '#94a3b8',
                    cursor: loading || aiMode === 'rag' ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                  aria-label="Previous Day"
                >
                  ‹
                </button>

                <input
                  id="holiday-date-input"
                  type="date"
                  value={date}
                  onChange={(event) => handleDateChange(event.target.value)}
                  disabled={loading || aiMode === 'rag'}
                  style={{
                    flex: 1, height: '48px', borderRadius: '16px',
                    border: '1px solid #1e293b', background: 'rgba(15, 23, 42, 0.9)',
                    padding: '0 16px', fontSize: '16px', color: '#fff',
                    outline: 'none', transition: 'all 0.2s'
                  }}
                />

                {/* Next Day Button */}
                <button
                  type="button"
                  onClick={() => changeDate(1)}
                  disabled={loading || aiMode === 'rag'}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '48px', height: '48px', borderRadius: '16px',
                    background: '#0f172a', border: '1px solid #1e293b',
                    color: loading || aiMode === 'rag' ? '#475569' : '#94a3b8',
                    cursor: loading || aiMode === 'rag' ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                  aria-label="Next Day"
                >
                  ›
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !date}
              style={{
                height: '48px', borderRadius: '16px',
                background: loading ? '#475569' : 'linear-gradient(to right, #0ea5e9, #4f46e5)',
                color: '#fff', fontWeight: 'bold', padding: '0 24px',
                border: 'none', cursor: loading || !date ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', whiteSpace: 'nowrap'
              }}
            >
              {loading ? 'Analyzing...' : 'Find Holidays'}
            </button>
          </div>

          {/* Quick presets */}
          <div style={{ gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
              Quick Verified Presets
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {PRESETS.map((preset) => (
                <button
                  key={preset.date}
                  type="button"
                  disabled={loading}
                  onClick={() => handlePresetClick(preset.date)}
                  style={{
                    padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 'medium',
                    background: date === preset.date ? 'rgba(14, 165, 233, 0.2)' : 'rgba(15, 23, 42, 0.8)',
                    color: date === preset.date ? '#7dd3fc' : '#94a3b8',
                    border: date === preset.date ? '1px solid rgba(14, 165, 233, 0.4)' : '1px solid rgba(30, 41, 59, 0.8)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Prompts Configuration Section (Editable) */}
        <section style={{
          background: 'rgba(2, 6, 23, 0.4)', border: '1px solid rgba(30, 41, 59, 0.5)',
          borderRadius: '20px', padding: '24px', gap: '16px', display: 'flex', flexDirection: 'column'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚙ Prompts Configuration (Editable)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="system-prompt-textarea" style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                System Prompt
              </label>
              <textarea
                id="system-prompt-textarea"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                disabled={loading}
                style={{
                  width: '100%', minHeight: '96px', borderRadius: '16px',
                  border: '1px solid #1e293b', background: 'rgba(15, 23, 42, 0.9)',
                  padding: '16px', fontSize: '12px', fontFamily: 'monospace',
                  lineHeight: '1.6', color: '#e2e8f0', outline: 'none',
                  resize: 'vertical', transition: 'all 0.2s'
                }}
                placeholder="Enter custom system prompt..."
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="user-prompt-textarea" style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                User Prompt
              </label>
              <textarea
                id="user-prompt-textarea"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                disabled={loading}
                style={{
                  width: '100%', minHeight: '128px', borderRadius: '16px',
                  border: '1px solid #1e293b', background: 'rgba(15, 23, 42, 0.9)',
                  padding: '16px', fontSize: '12px', fontFamily: 'monospace',
                  lineHeight: '1.6', color: '#e2e8f0', outline: 'none',
                  resize: 'vertical', transition: 'all 0.2s'
                }}
                placeholder="Enter custom user prompt..."
              />
            </div>
          </div>
        </section>

        {/* Dynamic Result Panel */}
        <section style={{
          minHeight: '240px', borderRadius: '20px',
          background: 'rgba(2, 6, 23, 0.6)', border: '1px solid rgba(30, 41, 59, 0.5)',
          padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px',
          position: 'relative', overflow: 'hidden'
        }}>
          {/* Header of results showing status / badges */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #0f172a', paddingBottom: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {loading && <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>}
              {loading ? 'Querying AI Model...' : 'Query Results'}
            </span>

            {source ? (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 'bold',
                ...getSourceBadgeStyle(source)
              }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: source === 'mcp' ? '#34d399' : source === 'reasoning' ? '#a78bfa' : '#94a3b8',
                  animation: source === 'mcp' ? 'ping 2s infinite' : 'none'
                }} />
                {getSourceLabel(source)}
              </span>
            ) : null}
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Execution status steps */}
            {statusSteps.length > 0 && (
              <div style={{
                gap: '8px', padding: '16px',
                background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(30, 41, 59, 0.8)',
                borderRadius: '16px', marginBottom: '16px'
              }}>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: '4px' }}>
                  System Execution Progress
                </span>
                <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#cbd5e1', gap: '6px', display: 'flex', flexDirection: 'column' }}>
                  {statusSteps.map((step, idx) => {
                    const isLast = idx === statusSteps.length - 1
                    return (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isLast && loading ? (
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', animation: 'ping 2s infinite', flexShrink: 0 }} />
                        ) : (
                          <span style={{ color: '#34d399', flexShrink: 0 }}>✓</span>
                        )}
                        <span style={{ color: isLast && loading ? '#7dd3fc' : '#cbd5e1' }}>{step}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading && !result && !(isReasoningMode && reasoningOutput) ? (
              <div style={{ gap: '16px', padding: '16px 0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '16px', background: '#0f172a', borderRadius: '4px', animation: 'pulse 1.5s infinite', width: '75%' }} />
                <div style={{ height: '16px', background: '#0f172a', borderRadius: '4px', animation: 'pulse 1.5s infinite', width: '83%' }} />
                <div style={{ height: '16px', background: '#0f172a', borderRadius: '4px', animation: 'pulse 1.5s infinite', width: '66%' }} />
                <p style={{ fontSize: '14px', color: '#64748b', textAlign: 'center', animation: 'pulse 1.5s infinite', paddingTop: '8px' }}>
                  LLM model processing your query...
                </p>
              </div>
            ) : null}

            {/* Error Display */}
            {!loading && error ? (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                color: '#fb7185', background: 'rgba(244, 63, 94, 0.05)',
                border: '1px solid rgba(244, 63, 94, 0.1)',
                borderRadius: '16px', padding: '16px', marginBottom: '16px'
              }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>⚠</span>
                <div style={{ gap: '4px', display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '14px' }}>Query Execution Failed</p>
                  <p style={{ fontSize: '12px', color: '#fda4af', lineHeight: '1.6' }}>{error}</p>
                </div>
              </div>
            ) : null}

            {/* Reasoning Mode grid or Regular Result */}
            {isReasoningMode && (reasoningOutput || result) ? (
              <div style={{ padding: '4px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', width: '100%' }}>
                  {/* Reasoning Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 'bold', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 0' }}>
                      💭 Thinking Process
                    </div>
                    <div style={{
                      color: '#e9d5ff', background: 'rgba(139, 92, 246, 0.05)',
                      padding: '24px', border: '1px solid rgba(139, 92, 246, 0.2)',
                      borderRadius: '20px', overflowY: 'auto', maxHeight: '480px',
                      fontFamily: 'monospace', fontSize: '11px', whiteSpace: 'pre-wrap', lineHeight: '1.6'
                    }}>
                      {reasoningOutput || (loading ? 'Thinking in progress...' : 'No thinking process returned.')}
                    </div>
                  </div>

                  {/* Result Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 0' }}>
                      ✓ Holiday Results
                    </div>
                    <div style={{
                      color: '#cbd5e1', background: 'rgba(15, 23, 42, 0.3)',
                      padding: '24px', border: '1px solid rgba(15, 23, 42, 0.8)',
                      borderRadius: '20px', overflowY: 'auto', maxHeight: '480px',
                      minHeight: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'center'
                    }}>
                      {result ? (
                        <MarkdownRenderer content={result} />
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '14px', padding: '32px' }}>
                          <span style={{ fontSize: '32px', animation: 'pulse 2s infinite', display: 'block', marginBottom: '8px' }}>⋯</span>
                          Waiting for results...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : !isReasoningMode && result ? (
              <div style={{ padding: '4px', overflowX: 'auto' }}>
                <div style={{
                  color: '#cbd5e1', background: 'rgba(15, 23, 42, 0.3)',
                  padding: '24px', border: '1px solid rgba(15, 23, 42, 0.8)',
                  borderRadius: '20px', overflowY: 'auto', maxHeight: '480px'
                }}>
                  <MarkdownRenderer content={result} />
                </div>
              </div>
            ) : null}

            {/* Empty State */}
            {!loading && !error && !result && !(isReasoningMode && reasoningOutput) ? (
              <div style={{ textAlign: 'center', padding: '32px', gap: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: '#0f172a', border: '1px solid #1e293b', color: '#475569'
                }}>
                  📅
                </div>
                <p style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 'medium' }}>
                  No date selected
                </p>
                <p style={{ fontSize: '12px', color: '#64748b', maxWidth: '300px' }}>
                  Pick a date above or click one of the verified presets to list public holidays worldwide.
                </p>
              </div>
            ) : null}
          </div>
        </section>

        {/* Raw Request & Response JSONs (Debug) */}
        {!loading && (rawRequest || rawResponse) && (
          <section style={{
            width: '100%', background: 'rgba(2, 6, 23, 0.4)',
            border: '1px solid rgba(30, 41, 59, 0.5)', borderRadius: '20px',
            padding: '24px', gap: '16px', display: 'flex', flexDirection: 'column'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔧 Raw Model Request & Response Debugger
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {/* Request JSON */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Raw Request JSON
                </label>
                <pre style={{
                  width: '100%', height: '320px', overflow: 'auto',
                  borderRadius: '16px', border: '1px solid #1e293b',
                  background: 'rgba(15, 23, 42, 0.5)', padding: '16px',
                  fontSize: '11px', fontFamily: 'monospace', lineHeight: '1.6',
                  color: '#cbd5e1'
                }}>
                  {rawRequest ? JSON.stringify(rawRequest, null, 2) : 'No request payload'}
                </pre>
              </div>

              {/* Response JSON */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Raw Response JSON
                </label>
                <pre style={{
                  width: '100%', height: '320px', overflow: 'auto',
                  borderRadius: '16px', border: '1px solid #1e293b',
                  background: 'rgba(15, 23, 42, 0.5)', padding: '16px',
                  fontSize: '11px', fontFamily: 'monospace', lineHeight: '1.6',
                  color: '#cbd5e1'
                }}>
                  {rawResponse ? JSON.stringify(rawResponse, null, 2) : 'No response payload'}
                </pre>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer style={{
          display: 'flex', flexDirection: 'column', sm: 'flexDirection: row',
          justifyContent: 'space-between', alignItems: 'center',
          fontSize: '12px', color: '#64748b', borderTop: '1px solid rgba(30, 41, 59, 0.4)',
          paddingTop: '24px', gap: '8px'
        }}>
          <span>Standard JSON-RPC 2.0 Client over HTTP</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
            MCP Server: Active
          </span>
        </footer>
      </div>

      {/* Inline keyframe animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
        textarea::-webkit-scrollbar, pre::-webkit-scrollbar {
          width: 8px;
        }
        textarea::-webkit-scrollbar-thumb, pre::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 4px;
        }
        textarea::-webkit-scrollbar-track, pre::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  )
}