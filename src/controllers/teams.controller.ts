import { Request, Response, NextFunction } from "express";
import * as teamsService from "../services/teams.service";

export async function getTeamOverview(req: Request, res: Response, next: NextFunction) {
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
