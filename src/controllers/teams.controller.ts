import { Request, Response, NextFunction } from "express";
import * as teamsService from "../services/teams.service";

export async function getTeamOverview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const teamId = Number(req.params.teamId);
    const leagueId = req.query.league ? Number(req.query.league) : undefined;
    const season = req.query.season ? Number(req.query.season) : undefined;

    if (!teamId || !leagueId || !season) {
      return res.status(400).json({
        status: "fail",
        message: "Paramètres manquants (teamId, league, season).",
      });
    }

    const overview = await teamsService.getTeamOverview({
      teamId,
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

export async function getTeamStats(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const teamName = req.query.team as string;
    const season = req.query.season ? Number(req.query.season) : undefined;

    if (!teamName || !season) {
      return res.status(400).json({
        status: "fail",
        message: "Paramètres manquants (team, season).",
      });
    }

    const stats = await teamsService.getTeamStats({
      teamName,
      season,
    });

    return res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (err: any) {
    return res.status(404).json({
      status: "fail",
      message: err.message || "Erreur lors de la récupération des statistiques",
    });
  }
}
