import { Router, type Request, type Response } from "express"
import type { Ticker } from "@shared/types/market.js"

const router = Router()

const tickers: Ticker[] = [
  { symbol: "AAPL", price: 150 },
  { symbol: "TSLA", price: 250 },
  { symbol: "BTC-USD", price: 60000 },
]

router.get("/", (_req: Request, res: Response<Ticker[]>) => {
  res.json(tickers)
})

export default router
