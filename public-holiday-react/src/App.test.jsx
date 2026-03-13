import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the heading and loads a mock holiday after clicking the button', async () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Public Holiday React', level: 1 }),
    ).toBeInTheDocument()
    expect(screen.getByText("Today's public holiday")).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Load Mock Holiday' }))

    expect(screen.getByText('Loading mock holiday information...')).toBeInTheDocument()

    expect(await screen.findByText('Mock result: Independence Day')).toBeInTheDocument()
    expect(
      screen.getByText(/Observed as a national day off work in the United States\./),
    ).toBeInTheDocument()
  })
})