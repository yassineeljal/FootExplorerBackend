import LeagueModel from "../models/League";
 
export async function getLeagueOverview(params: { leagueId: number; season: number }) {

  let league = await LeagueModel.findOne({ apiId: params.leagueId }).lean();
 
  return league;
}