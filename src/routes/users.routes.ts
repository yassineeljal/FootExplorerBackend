import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { me, patchMe, toggleFavorite, getFavorites } from "../controllers/users.controller";

const router = Router();

router.get("/me", requireAuth, me);
router.patch("/me", requireAuth, patchMe); 
router.post("/favorites", requireAuth, toggleFavorite);
router.get("/favorites", requireAuth, getFavorites);

export default router;