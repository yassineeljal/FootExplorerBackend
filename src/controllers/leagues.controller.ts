import { Request, Response, NextFunction } from "express";
import * as leaguesService from "../services/leagues.service";

export async function getLeagueOverview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const leagueId = Number(req.params.leagueId);
    const season = req.query.season ? Number(req.query.season) : undefined;

    if (!leagueId || !season) {
      return res.status(400).json({
        status: "fail",
        message: "Paramètres manquants (leagueId, season).",
      });
    }

    const overview = await leaguesService.getLeagueOverview({
      leagueId,
      season,
    });

    return res.status(200).json({
      status: "success",
      data: overview,
    });
  } catch (err) {
    next(err);
  }
}
