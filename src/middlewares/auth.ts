import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "config"; 

const secret = config.get<string>("security.jwt.secret");

export interface AuthReq extends Request {
  user?: { sub: string }; 
}

export function requireAuth(req: AuthReq, res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) return res.status(401).json({ message: "Token manquant", code: 401 });
  
  try {
    const payload = jwt.verify(h.slice(7), secret) as { sub: string; iat: number; exp: number }; 
    req.user = { sub: payload.sub }; 
    next(); 
  } catch(error) {
    return res.status(401).json({ message: "Token invalide ou expiré", code: 401 });
  }
}