import TeamModel from "../models/Team";

export async function getTeamOverview(params: {
  teamId: number;
  leagueId: number;
  season: number;
}) {
  const { teamId } = params;

  const team = await TeamModel.findOne({ apiId: teamId }).lean();

  return team;
}
