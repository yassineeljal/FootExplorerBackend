import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { getTeamOverview } from "../controllers/teams.controller";

const router = Router();


router.get("/:teamId/overview", requireAuth, getTeamOverview);

export default router;
