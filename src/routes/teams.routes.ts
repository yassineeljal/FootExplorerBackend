import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { getTeamOverview, getTeamStats } from "../controllers/teams.controller";

const router = Router();

/**
 * @swagger
 * /teams/stats:
 *   get:
 *     summary: Récupérer les stats d'une équipe
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: teamName
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: season
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Stats de l'équipe
 *       401:
 *         description: Non autorisé
 */
router.get("/stats", requireAuth, getTeamStats);

/**
 * @swagger
 * /teams/{teamId}/overview:
 *   get:
 *     summary: Récupérer les infos d'une équipe
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: leagueId
 *         schema:
 *           type: number
 *       - in: query
 *         name: season
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Infos de l'équipe
 *       401:
 *         description: Non autorisé
 */
router.get("/:teamId/overview", requireAuth, getTeamOverview);

export default router;
