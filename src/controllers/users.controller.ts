import { Response } from "express";
import { getMeService, patchMeService } from "../services/users.service"; 
import { AuthReq } from "../middlewares/auth";

export async function me(req: AuthReq, res: Response) {
  try {
      const user = await getMeService(req.user!.sub);
      if (!user) return res.status(404).json({ message: "User not found", code: 404 });
      res.json({ user });
  } catch(e) {
      return res.status(500).json({ message: (e as Error).message });
  }
}

export async function patchMe(req: AuthReq, res: Response) {
  try {
      const result = await patchMeService(req.user!.sub, req.body);
      const error = (result as any).error;
      if (error) return res.status(error.status).json({ message: error.message, code: error.status });
      res.json({ user: (result as any).user });
  } catch(e) {
      return res.status(500).json({ message: (e as Error).message });
  }
}