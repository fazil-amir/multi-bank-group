import { Router } from "express";
import { getTrackerPrices } from "../controllers/tracker.controller";

const router = Router();

router.get("/", getTrackerPrices);

export default router;
