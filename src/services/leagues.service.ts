import LeagueModel from "../models/League";
import TeamStatsModel from "../models/TeamStats";

interface IGetStandingsParams {
  leagueId: number;
  season: number;
}


export async function getLeagueStandingsService({ leagueId, season }: IGetStandingsParams) {
  const league = await LeagueModel.findOne({ apiId: leagueId });

  if (!league) {
    return []; 
  }

  const standings = await TeamStatsModel.find({
    league: league._id,
    season: season,
  })
    .populate("team", "name logo code") 
    .sort({ wins: -1, goalsFor: -1 })  
    .lean();

  return standings.map((item: any, index: number) => ({
    rank: index + 1,
    team: item.team,        
    stats: {
      wins: item.wins,
      goalsFor: item.goalsFor,
      formation: item.formation
    }
  }));
}

export async function getLeagueOverviewService(params: { leagueId: number; season: number }) {
  const league = await LeagueModel.findOne({ apiId: params.leagueId }).lean();
  return league;
}

