import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { me, patchMe, toggleFavorite, getFavorites } from "../controllers/users.controller";

const router = Router();

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Récupérer mon profil
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *       401:
 *         description: Non autorisé
 */
router.get("/me", requireAuth, me);

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Modifier mon profil
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil modifié
 *       401:
 *         description: Non autorisé
 */
router.patch("/me", requireAuth, patchMe);

/**
 * @swagger
 * /users/favorites:
 *   post:
 *     summary: Ajouter ou retirer un favori
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - apiId
 *               - action
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [team, player, league]
 *               apiId:
 *                 type: number
 *               action:
 *                 type: string
 *                 enum: [add, remove]
 *     responses:
 *       200:
 *         description: Favori ajouté ou retiré
 *       400:
 *         description: Champs manquants
 *       401:
 *         description: Non autorisé
 */
router.post("/favorites", requireAuth, toggleFavorite);

/**
 * @swagger
 * /users/favorites:
 *   get:
 *     summary: Récupérer mes favoris
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des favoris (teams, players, leagues)
 *       401:
 *         description: Non autorisé
 */
router.get("/favorites", requireAuth, getFavorites);

export default router;