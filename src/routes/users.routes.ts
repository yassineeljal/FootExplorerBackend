import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { me, patchMe, toggleFavorite, getFavorites } from "../controllers/users.controller";

const router = Router();

router.get("/me", requireAuth, me);
router.patch("/me", requireAuth, patchMe); 
// POST: Pour ajouter ou retirer un favori (le body contient {action: 'add' ou 'remove'})
router.post("/favorites", requireAuth, toggleFavorite);

// GET: Pour récupérer la liste de tous tes favoris (Joueurs, Teams, Ligues)
router.get("/favorites", requireAuth, getFavorites);

export default router;