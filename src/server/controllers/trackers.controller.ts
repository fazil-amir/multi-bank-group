import type { Request, Response } from "express";
import { TRACKERS } from "@shared/constants/tracker-symbols.constants";

export function getTrackers(_req: Request, res: Response): void {
  res.json(TRACKERS);
}
