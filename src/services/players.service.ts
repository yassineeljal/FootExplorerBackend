import PlayerModel from "../models/Player";
import PlayerStatsModel from "../models/PlayerStats";
import TeamModel from "../models/Team";
import LeagueModel from "../models/League";
import { fetchFromApi } from "../utils/api";

export async function getTopPlayers(params: { leagueId: number; season: number; type?: string }) {
  const { leagueId, season } = params;

  const data = await fetchFromApi('/players/topscorers', { league: leagueId, season: season });

  if (!data || data.length === 0) return [];

  const results = [];

  let league = await LeagueModel.findOne({ apiId: leagueId });
  

  if (!league) {
     league = await LeagueModel.findOneAndUpdate(
         { apiId: leagueId },
         { apiId: leagueId, name: `League ${leagueId}`, season: season },
         { upsert: true, new: true }
     );
  }

  for (const item of data) {
    const pInfo = item.player;
    const sInfo = item.statistics[0];
    const tInfo = sInfo.team;

    let team = await TeamModel.findOneAndUpdate(
      { apiId: tInfo.id },
      { 
        name: tInfo.name, 
        logo: tInfo.logo, 
        apiId: tInfo.id,
        
      },
      { upsert: true, new: true }
    );

    let player = await PlayerModel.findOneAndUpdate(
      { apiId: pInfo.id },
      {
        name: pInfo.name,
        firstname: pInfo.firstname,
        lastname: pInfo.lastname,
        age: pInfo.age,
        nationality: pInfo.nationality,
        photo: pInfo.photo, 
        apiId: pInfo.id
      },
      { upsert: true, new: true }
    );

    if (player && team && league) {
       await PlayerStatsModel.findOneAndUpdate(
        { player: player._id, season: season, league: league._id },
        {
          team: team._id,
          goals: sInfo.goals.total || 0,
          minutes: sInfo.games.minutes || 0,
          rating: sInfo.games.rating ? String(sInfo.games.rating).substring(0, 3) : null,
          season: season
        },
        { upsert: true }
      );
    }

    results.push({
      player: {
        id: pInfo.id,
        name: pInfo.name,
        photo: pInfo.photo,
        firstname: pInfo.firstname,
        lastname: pInfo.lastname
      },
      statistics: [
        {
          team: {
            id: tInfo.id,
            name: tInfo.name,
            logo: tInfo.logo 
          },
          games: {
            rating: sInfo.games.rating 
          },
          goals: {
            total: sInfo.goals.total 
          }
        }
      ]
    });
  }

  return results;
}

export async function searchPlayers(query: string) {
    let players = await PlayerModel.find({ name: { $regex: query, $options: 'i' } }).limit(10);

    if (players.length === 0) {
        const data = await fetchFromApi('/players', { search: query, season: 2023 }); 
        
        if (data && data.length > 0) {
            for (const item of data) {
                const pInfo = item.player;
                await PlayerModel.findOneAndUpdate(
                    { apiId: pInfo.id },
                    {
                        name: pInfo.name,
                        firstname: pInfo.firstname,
                        lastname: pInfo.lastname,
                        nationality: pInfo.nationality,
                        photo: pInfo.photo,
                        apiId: pInfo.id
                    },
                    { upsert: true }
                );
            }
             players = await PlayerModel.find({ name: { $regex: query, $options: 'i' } }).limit(10);
        }
    }
    return players;
}

export async function getPlayerStats(params: { playerId: number; season: number; leagueId?: number }) {
    const data = await fetchFromApi('/players', { id: params.playerId, season: params.season });
    if(!data || !data[0]) return null;
    
    return data[0]; 
}