import { Response } from "express";
import { 
    getMeService, 
    patchMeService, 
    manageFavoriteService, 
    getMyFavoritesService 
} from "../services/users.service"; 
import { AuthReq } from "../middlewares/auth";

// Récupérer son propre profil
export async function me(req: AuthReq, res: Response) {
  try {
      const user = await getMeService(req.user!.sub);
      if (!user) return res.status(404).json({ message: "User not found", code: 404 });
      res.json({ user });
  } catch(e) {
      return res.status(500).json({ message: (e as Error).message });
  }
}

// Modifier son profil
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

// --- GESTION DES FAVORIS ---

// Ajouter ou Retirer un favori
// Exemple Body: { "type": "player", "apiId": 1234, "action": "add" }
export async function toggleFavorite(req: AuthReq, res: Response) {
    try {
        const { type, apiId, action } = req.body;
        
        // Validation basique
        if (!type || !apiId || !action) {
            return res.status(400).json({ message: "Champs manquants. Requis: type, apiId, action." });
        }

        const result = await manageFavoriteService(req.user!.sub, type, apiId, action);
        res.json(result);
    } catch(e) {
        return res.status(500).json({ message: (e as Error).message });
    }
}

// Récupérer la liste complète de mes favoris
export async function getFavorites(req: AuthReq, res: Response) {
    try {
        const data = await getMyFavoritesService(req.user!.sub);
        if (!data) return res.status(404).json({ message: "Utilisateur introuvable" });
        
        res.json(data);
    } catch(e) {
        return res.status(500).json({ message: (e as Error).message });
    }
}