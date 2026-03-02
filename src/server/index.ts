import express from "express";
import cors from "cors";
import { API_PORT } from "@shared/constants/app.constants";
import { ENDPOINTS } from "@shared/constants/api.constants";
import tickerRoutes from "./routes/ticker.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use(ENDPOINTS.TICKERS, tickerRoutes);

app.listen(API_PORT, () => {
  console.log(`Server running at http://localhost:${API_PORT}`);
});
