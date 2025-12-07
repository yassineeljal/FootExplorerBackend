import { Request, Response, NextFunction } from "express";
import * as playersService from "../services/players.service";

const ALLOWED_TYPES = ["scorers", "assists", "young"] as const;
type TopPlayerType = (typeof ALLOWED_TYPES)[number];

// 1. Détails d'un joueur
export async function getPlayerStats(req: Request, res: Response, next: NextFunction) {
  try {
    const playerId = Number(req.params.playerId);
    const leagueId = req.query.league ? Number(req.query.league) : undefined;
    const season = req.query.season ? Number(req.query.season) : undefined;

    if (!playerId || !season) {
      return res.status(400).json({
        status: "fail",
        message: "Paramètres manquants (playerId, season).",
      });
    }

    const stats = await playersService.getPlayerStats({
      playerId,
      leagueId,
      season,
    });

    return res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (err) {
    next(err);
  }
}

// 2. Top joueurs (Meilleurs buteurs, etc.)
export async function getTopPlayers(req: Request, res: Response, next: NextFunction) {
  try {
    const leagueId = req.query.league ? Number(req.query.league) : undefined;
    const season = req.query.season ? Number(req.query.season) : undefined;

    let type = req.query.type as TopPlayerType | undefined;

    if (!type || !ALLOWED_TYPES.includes(type)) {
      type = "scorers";
    }

    if (!leagueId || !season) {
      return res.status(400).json({
        status: "fail",
        message: "Paramètres manquants (league, season).",
      });
    }

    const result = await playersService.getTopPlayers({
      leagueId,
      season,
      type,
    });

    return res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

// --- AJOUT DE LA FONCTION RECHERCHE ---
export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    // On récupère le paramètre 'q' dans l'URL (ex: /players/search?q=mbappe)
    const query = req.query.q as string;

    if (!query || query.length < 3) {
      return res.status(400).json({
        status: "fail",
        message: "La recherche doit contenir au moins 3 caractères.",
      });
    }

    const result = await playersService.searchPlayers(query);

    return res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    next(err);
  }
}