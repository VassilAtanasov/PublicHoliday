import { useEffect, useRef, useState } from 'react'

const LAMBDA_URL = 'https://obeo6mf6wgez53kqen5bcjfyou0pfmem.lambda-url.eu-north-1.on.aws/'
const DEV_PROXY_URL = '/api/holiday'
const DEV_STREAM_URL = '/api/ask/stream'
const SERVICE_URL = import.meta.env.DEV || import.meta.env.VITE_BUILD_TARGET === 'docker'
  ? DEV_PROXY_URL
  : LAMBDA_URL
const STREAM_URL = import.meta.env.DEV || import.meta.env.VITE_BUILD_TARGET === 'docker'
  ? DEV_STREAM_URL
  : null
const CAN_STREAM = typeof EventSource !== 'undefined' && Boolean(STREAM_URL)

const initialHoliday = {
  title: 'Today\'s public holiday',
  description: 'No live holiday data is loaded yet. Click the button to fetch today\'s results.',
}

const buildQuestion = () => {
  const now = new Date()
  const formattedDate = now.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })

  return `Return a plain-text list (no other Markdown). List national public holidays (off work) on ${formattedDate} worldwide. Always put United States holidays first (if any). Verify it is a non-working day in the country. Group by holiday name with countries in parentheses, ordered by popularity. No explanations.`
}

const parseHolidayText = (text) => {
  const trimmedText = text.trim()

  if (!trimmedText) {
    return {
      title: 'No holiday data available',
      description: 'The AWS Lambda response was empty.',
    }
  }

  const lines = trimmedText.split('\n')

  return {
    title: lines[0] || 'No holiday data available',
    description: lines.slice(1).join('\n').trim(),
  }
}

const streamHolidayText = (question, onChunk) => new Promise((resolve, reject) => {
  if (!STREAM_URL || typeof EventSource === 'undefined') {
    reject(new Error('Streaming is not available in this environment.'))
    return
  }

  const eventSource = new EventSource(`${STREAM_URL}?question=${encodeURIComponent(question)}`)
  let accumulated = ''

  eventSource.onmessage = (event) => {
    if (event.data === '[DONE]') {
      eventSource.close()
      resolve(accumulated)
      return
    }

    if (event.data.startsWith('[ERROR]')) {
      eventSource.close()
      reject(new Error(event.data.replace('[ERROR]', '').trim() || 'Streaming request failed.'))
      return
    }

    accumulated += event.data
    onChunk(accumulated)
  }

  eventSource.onerror = () => {
    eventSource.close()
    reject(new Error('SSE connection failed. Falling back to non-stream request.'))
  }
})

export function useAIService() {
  const [holiday, setHoliday] = useState(initialHoliday)
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState('')
  const streamRequestRef = useRef(0)

  useEffect(() => () => {
    streamRequestRef.current += 1
  }, [])

  const loadMockHoliday = async () => {
    setLoading(true)
    setStreaming(false)
    setError('')

    try {
      const question = buildQuestion()

      if (CAN_STREAM) {
        streamRequestRef.current += 1
        const requestId = streamRequestRef.current

        setStreaming(true)
        setHoliday({
          title: 'Live holiday stream',
          description: '',
        })

        try {
          await streamHolidayText(question, (partialText) => {
            if (streamRequestRef.current !== requestId) {
              return
            }

            setHoliday({
              title: 'Live holiday stream',
              description: partialText,
            })
          })

          if (streamRequestRef.current === requestId) {
            setStreaming(false)
            setLoading(false)
            return
          }
        } catch {
          if (streamRequestRef.current === requestId) {
            setStreaming(false)
          }
        }
      }

      const response = await fetch(`${SERVICE_URL}?question=${encodeURIComponent(question)}`, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const text = await response.text()
      setHoliday(parseHolidayText(text))
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Failed to fetch holiday data from AI service.',
      )
    } finally {
      setStreaming(false)
      setLoading(false)
    }
  }

  return {
    holiday,
    loading,
    streaming,
    error,
    loadMockHoliday,
  }
}