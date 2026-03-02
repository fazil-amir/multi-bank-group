import express from "express"
import cors from "cors"
import { API_PORT, ENDPOINTS } from "@shared/constants/api.constants.js"
import tickerRoutes from "./routes/ticker.routes.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use(ENDPOINTS.TICKERS, tickerRoutes)

app.listen(API_PORT, () => {
  console.log(`Server running at http://localhost:${API_PORT}`)
})
