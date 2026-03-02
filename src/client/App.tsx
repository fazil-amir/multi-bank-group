import { useEffect, useState } from "react"
import type { Ticker } from "@shared/types/market.types.js"
import { fetchTickers } from "@shared/api/tickers.api.js"

export default function App() {
  const [tickers, setTickers] = useState<Ticker[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTickers().then(setTickers).catch((err: Error) => setError(err.message))
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
