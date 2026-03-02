import express from "express";
import cors from "cors";
import { API_PORT } from "@shared/constants/app.constants";
import { ENDPOINTS } from "@shared/constants/api.constants";
import trackerRoutes from "./routes/tracker.routes";
import { connectTracker } from "./services/tracker.service";

const app = express();

app.use(cors());
app.use(express.json());

app.use(ENDPOINTS.TRACKER, trackerRoutes);

connectTracker();

app.listen(API_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://localhost:${API_PORT}`);
});
