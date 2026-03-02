import { Router } from "express";
import { getTrackers } from "../controllers/trackers.controller";

const router = Router();

router.get("/", getTrackers);

export default router;
