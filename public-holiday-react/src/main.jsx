import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/base.css'
import './assets/main.css'
import { RecentResultsProvider } from './context/RecentResultsContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecentResultsProvider>
      <App />
    </RecentResultsProvider>
  </React.StrictMode>,
)