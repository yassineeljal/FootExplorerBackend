import PlayerModel from "../models/Player";
import PlayerStatsModel from "../models/PlayerStats";
import LeagueModel from "../models/League";

export async function getTopPlayers(params: {
  leagueId: number;
  season: number;
  type?: string;
}) {
  const { leagueId, season } = params;

  const league = await LeagueModel.findOne({ apiId: leagueId });

  if (!league) {
    return [];
  }

  const topStats = await PlayerStatsModel.find({
    league: league._id,
    season: season,
  })
    .sort({ goals: -1 })
    .limit(20)
    .populate("player")
    .populate("team")
    .lean();

  return topStats.map((stats: any) => {
    if (!stats.player) return null;

    return {
      player: {
        id: stats.player.apiId,
        name: stats.player.name,
        photo: stats.player.photo,
        firstname: stats.player.firstname,
        lastname: stats.player.lastname,
      },
      statistics: [
        {
          team: {
            id: stats.team?.apiId,
            name: stats.team?.name,
            logo: stats.team?.logo,
          },
          games: {
            rating: stats.rating || "N/A",
          },
          goals: {
            total: stats.goals || 0,
          },
        },
      ],
    };
  }).filter(p => p !== null);
}

export async function searchPlayers(query: string) {
  const lowerQuery = query.toLowerCase();
  const players = await PlayerModel.find({
    name: { $regex: lowerQuery, $options: 'i' },
  })
    .limit(10)
    .lean();

  return players.map((p: any) => ({
    id: p.apiId,
    ...p
  }));
}

export async function getPlayerStats(params: {
  playerId: number;
  season: number;
  leagueId?: number;
}) {
  const player = await PlayerModel.findOne({ apiId: params.playerId }).lean();

  if (!player) return null;

  const stats = await PlayerStatsModel.find({
    player: player._id,
    season: params.season,
  })
    .populate("team")
    .populate("league")
    .lean();

  return {
    player: player,
    stats: stats,
    statistics: stats
  };
}