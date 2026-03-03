import { Router } from "express";
import {
  getTrackerHistoryHandler,
  getTrackersSymbols,
  getTrackersStreams,
} from "../controllers/trackers.controller";

const router = Router();

router.get("/symbols", getTrackersSymbols);
router.get("/streams", getTrackersStreams);
router.get("/:symbol", getTrackerHistoryHandler);

export default router;
