import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { getPlayerStats, getTopPlayers, search } from "../controllers/players.controller";

const router = Router();


router.get("/:playerId/stats", requireAuth, getPlayerStats);
router.get("/top", requireAuth, getTopPlayers);

router.get("/search", requireAuth, search);

export default router;
