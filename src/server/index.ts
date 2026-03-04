import path from "node:path";
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
const isProduction = process.env.NODE_ENV === "production";

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

// Serve built UI and SPA fallback in production (e.g. Render.com).
// On Render: Build Command = "npm install --include=dev && npm run build", Start Command = "npm start".
if (isProduction) {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Start a single persistent WebSocket to Binance at boot,
// so the in-memory price map is already populated before any client connects.
connectTracker();

const port = Number(process.env.PORT) || API_PORT;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${port}`);
});
