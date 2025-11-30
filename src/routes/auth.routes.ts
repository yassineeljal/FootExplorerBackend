import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { register, login, me } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);

export default router;