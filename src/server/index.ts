import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { API_PORT } from "@shared/constants/app.constants";
import { ENDPOINTS } from "@shared/constants/api.constants";
import authRoutes from "./routes/auth.routes";
import trackersRoutes from "./routes/trackers.routes";
import { requireAuth } from "./middleware/auth.middleware";
import { connectTracker } from "./services/trackers.service";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use(ENDPOINTS.AUTH, authRoutes);
app.use(ENDPOINTS.TRACKERS, requireAuth, trackersRoutes);

// Start a single persistent WebSocket to Binance at boot,
// so the in-memory price map is already populated before any client connects.
connectTracker();

app.listen(API_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://localhost:${API_PORT}`);
});
