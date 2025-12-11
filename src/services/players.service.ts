
import PlayerModel from "../models/Player";
import PlayerStatsModel from "../models/PlayerStats";
import TeamModel from "../models/Team";
import LeagueModel from "../models/League";
 
export async function getTopPlayers(params: { leagueId: number; season: number; type?: string }) {
    const { leagueId, season } = params;
 
    const league = await LeagueModel.findOne({ apiId: leagueId });
 
    if (!league) {
        return [];
    }
   
    const topStats = await PlayerStatsModel.find({
        league: league._id,
        season: season
    })
    .sort({ goals: -1 }) 
    .limit(20)
    .populate({
        path: 'player',
        select: 'apiId name photo firstname lastname'
    })
    .populate({
        path: 'team',
        select: 'apiId name logo'
    })
    .lean();
 
    return topStats.map((stats: any) => ({
        player: {
            id: stats.player.apiId,
            name: stats.player.name,
            photo: stats.player.photo,
            firstname: stats.player.firstname,
            lastname: stats.player.lastname
        },
        statistics: [
            {
                team: {
                    id: stats.team.apiId,
                    name: stats.team.name,
                    logo: stats.team.logo
                },
                games: {
                    rating: stats.rating
                },
                goals: {
                    total: stats.goals
                }
            }
        ]
    }));
}
 
export async function searchPlayers(query: string) {
    const players = await PlayerModel.find({
        name: { $regex: query, $options: 'i' }
    }).limit(10).lean();
 
    return players;
}
 
export async function getPlayerStats(params: { playerId: number; season: number; leagueId?: number }) {
    const player = await PlayerModel.findOne({ apiId: params.playerId }).lean();
 
    if (!player) return null;
 
    const stats = await PlayerStatsModel.find({
        player: player._id,
        season: params.season
    })
    .populate({
        path: 'team',
        select: 'apiId name logo'
    })
    .populate({
        path: 'league',
        select: 'apiId name'
    })
    .lean();
 
    return {
        player: player,
        stats: stats
    };
}