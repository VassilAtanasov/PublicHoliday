import { useState } from 'react'

const LAMBDA_URL = 'https://45f2opaos26j5odxxk3ldbjs5q0zavtg.lambda-url.eu-north-1.on.aws/'

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

export function useMockHoliday() {
  const [holiday, setHoliday] = useState(initialHoliday)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadMockHoliday = async () => {
    setLoading(true)
    setError('')

    try {
      const question = buildQuestion()
      const response = await fetch(`${LAMBDA_URL}?question=${encodeURIComponent(question)}`, {
        method: 'POST',
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