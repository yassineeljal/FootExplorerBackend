import { Request, Response, NextFunction } from "express";
import * as leaguesService from "../services/leagues.service"; // On importe tout le service

export async function getLeagueStandings(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const leagueId = Number(req.params.leagueId);
    
    const season = req.query.season ? Number(req.query.season) : 2025;

   
    if (!leagueId) {
      return res.status(400).json({
        status: "fail",
        message: "Paramètre manquant ou invalide : leagueId.",
      });
    }

    const standings = await leaguesService.getLeagueStandingsService({
      leagueId,
      season,
    });


    return res.status(200).json({
      status: "success",
      results: standings.length,
      data: standings,
    });
  } catch (err) {
  
    next(err);
  }
}

export async function getLeagueOverview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const leagueId = Number(req.params.leagueId);
    const season = req.query.season ? Number(req.query.season) : undefined;

    if (!leagueId || !season) {
      return res.status(400).json({ status: "fail", message: "Paramètres manquants." });
    }

    const overview = await leaguesService.getLeagueOverviewService({ leagueId, season });

    return res.status(200).json({
      status: "success",
      data: overview,
    });
  } catch (err) {
    next(err);
  }
}