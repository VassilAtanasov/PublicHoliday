import { useRecentResults } from '../context/RecentResultsContext'

function RecentResults() {
  const recentResults = useRecentResults()

  if (recentResults.length === 0) {
    return null
  }

  return (
    <div className="mt-4">
      <h2 className="mb-3 text-lg font-semibold text-gray-700">Recent Results</h2>
      <ul className="space-y-2">
        {recentResults.map((result) => (
          <li key={result.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="font-medium text-gray-800">{result.title}</p>
            <p className="mt-1 text-xs text-gray-500">
              {new Date(result.loadedAt).toLocaleTimeString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecentResults
