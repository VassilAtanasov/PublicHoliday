import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('App', () => {
  it('renders the heading and loads a holiday from AWS Lambda after clicking the button', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => 'Lambda result: Independence Day\nUnited States\nObserved as a national day off work in the United States.',
    })

    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Public Holiday React', level: 1 }),
    ).toBeInTheDocument()
    expect(screen.getByText("Today's public holiday")).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: "Load Today's Holiday" }))

    expect(screen.getByText('Loading live holiday information...')).toBeInTheDocument()

    expect(await screen.findByText('Lambda result: Independence Day')).toBeInTheDocument()
    expect(
      screen.getByText(/Observed as a national day off work in the United States\./),
    ).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('question='), {
      method: 'POST',
    })
  })

  it('shows an error state when the AWS Lambda request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => '',
    })

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: "Load Today's Holiday" }))

    expect(await screen.findByText('Request failed')).toBeInTheDocument()
    expect(screen.getByText('HTTP error! status: 500')).toBeInTheDocument()
  })
})