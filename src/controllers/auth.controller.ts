import { Request, Response } from "express";
import { registerUser, loginUser, getMe } from "../services/auth.service";
import { AuthReq } from "../middlewares/auth";

export async function register(req: Request, res: Response) {
  const { email, username, password, name } = req.body || {};
  if (!email || !username || !password || !name)
    return res
      .status(400)
      .json({ message: "Champs requis manquants", code: 400 });

  try {
    const result = await registerUser({ email, username, name, password });
    if ("conflict" in result)
      return res
        .status(409)
        .json({ message: "Email/username déjà utilisé", code: 409 });
    return res.status(201).json(result);
  } catch (e) {
    return res.status(500).json({ message: (e as Error).message });
  }
}

export async function login(req: Request, res: Response) {
  const { email, username, password } = req.body || {};
  if ((!email && !username) || !password)
    return res
      .status(400)
      .json({ message: "Identifiants requis manquants", code: 400 });

  try {
    const result = await loginUser({ email, username, password });
    if ("invalid" in result)
      return res
        .status(401)
        .json({ message: "Identifiants invalides", code: 401 });
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ message: (e as Error).message });
  }
}

export async function me(req: AuthReq, res: Response) {
  try {
    const user = await getMe(req.user!.sub);
    if (!user)
      return res.status(404).json({ message: "User not found", code: 404 });
    res.json({ user });
  } catch (e) {
    return res.status(500).json({ message: (e as Error).message });
  }
}
