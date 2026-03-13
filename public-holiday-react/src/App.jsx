import HolidayResult from './components/HolidayResult'
import { useMockHoliday } from './hooks/useMockHoliday'

function App() {
  const { holiday, loading, loadMockHoliday } = useMockHoliday()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center">
        <div className="w-full overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h1 className="text-center text-2xl font-bold">Public Holiday React</h1>
            <p className="mt-2 text-center text-sm text-blue-100">
              Phase 3: components with props and a custom hook.
            </p>
          </div>

          <div className="space-y-4 p-6">
            <HolidayResult
              title={holiday.title}
              description={holiday.description}
              loading={loading}
            />

            <button
              type="button"
              onClick={loadMockHoliday}
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition duration-200 hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Loading...' : 'Load Mock Holiday'}
            </button>
          </div>

          <div className="bg-gray-50 px-6 py-4 text-center text-sm text-gray-600">
            <p>Learning focus: props, custom hooks, and separation of concerns.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App