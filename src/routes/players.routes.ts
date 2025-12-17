import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { getPlayerStats, getTopPlayers, search } from "../controllers/players.controller";

const router = Router();

/**
 * @swagger
 * /players/top:
 *   get:
 *     summary: Récupérer les meilleurs joueurs
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
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
 *         description: Liste des top joueurs
 *       401:
 *         description: Non autorisé
 */
router.get("/top", requireAuth, getTopPlayers);

/**
 * @swagger
 * /players/search:
 *   get:
 *     summary: Rechercher un joueur
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Résultats de recherche
 *       401:
 *         description: Non autorisé
 */
router.get("/search", requireAuth, search);

/**
 * @swagger
 * /players/{playerId}/stats:
 *   get:
 *     summary: Récupérer les stats d'un joueur
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playerId
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
 *         description: Stats du joueur
 *       401:
 *         description: Non autorisé
 */
router.get("/:playerId/stats", requireAuth, getPlayerStats);

export default router;
