import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { getLeagueOverview } from "../controllers/leagues.controller";

const router = Router();

router.get("/:leagueId/overview", requireAuth, getLeagueOverview);

export default router;
