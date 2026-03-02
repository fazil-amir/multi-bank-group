import { Router } from "express";
import { getTrackersSymbols, getTrackersStreams } from "../controllers/trackers.controller";

const router = Router();

router.get("/symbols", getTrackersSymbols);
router.get("/streams", getTrackersStreams);

export default router;
