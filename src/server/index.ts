import express from "express"
import cors from "cors"
import tickerRoutes from "./routes/ticker.routes.js"

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

app.use("/api/tickers", tickerRoutes)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
