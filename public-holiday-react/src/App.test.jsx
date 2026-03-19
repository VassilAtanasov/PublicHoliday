import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { RecentResultsProvider } from './context/RecentResultsContext'

function renderWithProvider(ui) {
  return render(<RecentResultsProvider>{ui}</RecentResultsProvider>)
}

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

    renderWithProvider(<App />)

    expect(
      screen.getByRole('heading', { name: 'Public Holiday React', level: 1 }),
    ).toBeInTheDocument()
    expect(screen.getByText("Today's public holiday")).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: "Load Today's Holiday" }))

    expect(screen.getByText('Loading live holiday information...')).toBeInTheDocument()

    expect(
      await screen.findByRole('heading', { name: 'Lambda result: Independence Day', level: 2 }),
    ).toBeInTheDocument()
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

    renderWithProvider(<App />)

    fireEvent.click(screen.getByRole('button', { name: "Load Today's Holiday" }))

    expect(await screen.findByText('Request failed')).toBeInTheDocument()
    expect(screen.getByText('HTTP error! status: 500')).toBeInTheDocument()
  })

  it('adds a result to the recent results list after a successful load', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => 'St. Patrick\'s Day\nIreland\nNational holiday in Ireland.',
    })

    renderWithProvider(<App />)

    expect(screen.queryByText('Recent Results')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: "Load Today's Holiday" }))

    expect(await screen.findByText('Recent Results')).toBeInTheDocument()
    const allMatches = screen.getAllByText("St. Patrick's Day")
    expect(allMatches.length).toBeGreaterThanOrEqual(2)
  })

  it('prepends newer results to the top of the recent results list', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        text: async () => 'First Holiday\nFirst country.',
      })
      .mockResolvedValueOnce({
        ok: true,
        text: async () => 'Second Holiday\nSecond country.',
      })

    renderWithProvider(<App />)

    fireEvent.click(screen.getByRole('button', { name: "Load Today's Holiday" }))
    expect(await screen.findByRole('heading', { name: 'First Holiday', level: 2 })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: "Load Today's Holiday" }))
    expect(await screen.findByRole('heading', { name: 'Second Holiday', level: 2 })).toBeInTheDocument()

    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('Second Holiday')
    expect(items[1]).toHaveTextContent('First Holiday')
  })

  it('does not add to recent results when the request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => '',
    })

    renderWithProvider(<App />)

    fireEvent.click(screen.getByRole('button', { name: "Load Today's Holiday" }))

    expect(await screen.findByText('Request failed')).toBeInTheDocument()
    expect(screen.queryByText('Recent Results')).not.toBeInTheDocument()
  })
})