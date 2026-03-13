import { useState } from 'react'

const mockResults = [
  {
    title: 'Today\'s public holiday',
    description: 'No worldwide holiday is loaded yet. Click the button to load a mock result.',
  },
  {
    title: 'Mock result: Independence Day',
    description: 'United States\nObserved as a national day off work in the United States.',
  },
  {
    title: 'Mock result: Labour Day',
    description: 'Bulgaria, Germany, France\nObserved as a public holiday in many countries on May 1.',
  },
  {
    title: 'Mock result: Christmas Day',
    description: 'Worldwide\nA widely observed public holiday celebrated in many countries.',
  },
  {
    title: 'Mock result: My Birthday',
    description: 'Worldwide\nA widely observed public holiday celebrated in many countries. :-)',
  },
]

export function useMockHoliday() {
  const [holiday, setHoliday] = useState(mockResults[0])
  const [loading, setLoading] = useState(false)
  const [nextResultIndex, setNextResultIndex] = useState(1)

  const loadMockHoliday = () => {
    setLoading(true)

    window.setTimeout(() => {
      setHoliday(mockResults[nextResultIndex])
      setNextResultIndex((currentIndex) => {
        if (currentIndex >= mockResults.length - 1) {
          return 1
        }

        return currentIndex + 1
      })
      setLoading(false)
    }, 400)
  }

  return {
    holiday,
    loading,
    loadMockHoliday,
  }
}