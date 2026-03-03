import express from "express";
import cors from "cors";
import { API_PORT } from "@shared/constants/app.constants";
import { ENDPOINTS } from "@shared/constants/api.constants";
import trackersRoutes from "./routes/trackers.routes";
import { connectTracker } from "./services/trackers.service";

const app = express();

app.use(cors());
app.use(express.json());

app.use(ENDPOINTS.TRACKERS, trackersRoutes);

// Start a single persistent WebSocket to Binance at boot,
// so the in-memory price map is already populated before any client connects.
connectTracker();

app.listen(API_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://localhost:${API_PORT}`);
});
