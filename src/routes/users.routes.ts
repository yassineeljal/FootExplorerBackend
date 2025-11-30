import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { me, patchMe } from "../controllers/users.controller";

const router = Router();

router.get("/me", requireAuth, me);
router.patch("/me", requireAuth, patchMe); 

export default router;