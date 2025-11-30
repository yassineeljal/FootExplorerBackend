// src/routes/players.routes.ts
import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { getPlayerStats, getTopPlayers } from "../controllers/players.controller";

const router = Router();


router.get("/:playerId/stats", requireAuth, getPlayerStats);


router.get("/top", requireAuth, getTopPlayers);

export default router;
