import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { 
  getLeagueOverview, 
  getLeagueStandings 
} from "../controllers/leagues.controller";

const router = Router();


router.get("/:leagueId/overview", requireAuth, getLeagueOverview);

router.get("/:leagueId/standings", getLeagueStandings);

export default router;