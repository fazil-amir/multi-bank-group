import { useEffect, useState } from "react"
import type { Ticker } from "@shared/types/market.js"

export default function App() {
  const [tickers, setTickers] = useState<Ticker[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("http://localhost:4000/api/tickers")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<Ticker[]>
      })
      .then(setTickers)
      .catch((err: Error) => setError(err.message))
  }, [])

  if (error) return <p>Error: {error}</p>

  return (
    <main>
      <h1>Tickers</h1>
      <ul>
        {tickers.map((t) => (
          <li key={t.symbol}>
            {t.symbol}: ${t.price.toLocaleString()}
          </li>
        ))}
      </ul>
    </main>
  )
}
