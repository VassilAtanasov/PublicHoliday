import { createContext, useContext, useReducer } from 'react'

const RecentResultsContext = createContext(null)
const RecentResultsDispatchContext = createContext(null)

function recentResultsReducer(state, action) {
  switch (action.type) {
    case 'ADD_RESULT':
      return [action.result, ...state]
    default:
      return state
  }
}

export function RecentResultsProvider({ children }) {
  const [recentResults, dispatch] = useReducer(recentResultsReducer, [])

  return (
    <RecentResultsContext.Provider value={recentResults}>
      <RecentResultsDispatchContext.Provider value={dispatch}>
        {children}
      </RecentResultsDispatchContext.Provider>
    </RecentResultsContext.Provider>
  )
}

export function useRecentResults() {
  const context = useContext(RecentResultsContext)
  if (context === null) {
    throw new Error('useRecentResults must be used within a RecentResultsProvider')
  }
  return context
}

export function useRecentResultsDispatch() {
  const context = useContext(RecentResultsDispatchContext)
  if (context === null) {
    throw new Error('useRecentResultsDispatch must be used within a RecentResultsProvider')
  }
  return context
}
