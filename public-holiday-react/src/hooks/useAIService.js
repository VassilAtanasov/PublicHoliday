import { useState } from 'react'

const LAMBDA_URL = 'https://obeo6mf6wgez53kqen5bcjfyou0pfmem.lambda-url.eu-north-1.on.aws/'
const DEV_PROXY_URL = '/api/holiday'
const SERVICE_URL = import.meta.env.DEV || import.meta.env.VITE_BUILD_TARGET === 'docker'
  ? DEV_PROXY_URL
  : LAMBDA_URL

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

export function useAIService() {
  const [holiday, setHoliday] = useState(initialHoliday)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadMockHoliday = async () => {
    setLoading(true)
    setError('')

    try {
      const question = buildQuestion()
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
          : 'Failed to fetch holiday data from AWS Lambda.',
      )
    } finally {
      setLoading(false)
    }
  }

  return {
    holiday,
    loading,
    error,
    loadMockHoliday,
  }
}