import TeamModel from "../models/Team";
import TeamStatsModel from "../models/TeamStats";

export async function getTeamOverview(params: {
  teamId: number;
  leagueId: number;
  season: number;
}) {
  const { teamId } = params;

  const team = await TeamModel.findOne({ apiId: teamId }).lean();

  return team;
}

export async function getTeamStats(params: {
  teamName: string;
  season: number;
}) {
  const { teamName, season } = params;

  const team = await TeamModel.findOne({ name: teamName }).lean();

  if (!team) {
    throw new Error(`Équipe "${teamName}" non trouvée`);
  }

  const teamStats = await TeamStatsModel.findOne({
    team: team._id,
    season: season,
  })
    .populate("team", "name logo")
    .populate("league", "name")
    .lean();

  if (!teamStats) {
    throw new Error(`Statistiques non trouvées pour ${teamName} en ${season}`);
  }

  return {
    team: teamStats.team,
    league: teamStats.league,
    season: teamStats.season,
    wins: teamStats.wins,
    goalsFor: teamStats.goalsFor,
    formation: teamStats.formation,
  };
}
