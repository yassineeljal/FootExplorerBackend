import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import {
  getLeagueOverview,
  getLeagueStandings
} from "../controllers/leagues.controller";

const router = Router();

/**
 * @swagger
 * /leagues/{leagueId}/overview:
 *   get:
 *     summary: Récupérer les infos d'une ligue
 *     tags: [Leagues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leagueId
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: season
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Infos de la ligue
 *       401:
 *         description: Non autorisé
 */
router.get("/:leagueId/overview", requireAuth, getLeagueOverview);

/**
 * @swagger
 * /leagues/{leagueId}/standings:
 *   get:
 *     summary: Récupérer le classement d'une ligue
 *     tags: [Leagues]
 *     parameters:
 *       - in: path
 *         name: leagueId
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: season
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Classement de la ligue
 */
router.get("/:leagueId/standings", getLeagueStandings);

export default router;