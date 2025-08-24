import React from 'react'
import ReactDOM from 'react-dom/client'

// Jednoduchá komponenta na zobrazenie
function App() {
  return (
    <div>
      <h1>Vítejte v Lakovňa!</h1>
      <p>Frontend je úspešne spustený.</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
