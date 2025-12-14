import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { getTeamOverview, getTeamStats } from "../controllers/teams.controller";

const router = Router();

router.get("/stats", requireAuth, getTeamStats);
router.get("/:teamId/overview", requireAuth, getTeamOverview);

export default router;
