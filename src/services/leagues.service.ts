import LeagueModel from "../models/League";
import { fetchFromApi } from "../utils/api";

export async function getLeagueOverview(params: { leagueId: number; season: number }) {
 
  let league = await LeagueModel.findOne({ apiId: params.leagueId });

  
  if (!league) {
      const data = await fetchFromApi('/leagues', { id: params.leagueId });
      if (data && data.length > 0) {
          const lData = data[0].league;
          const countryData = data[0].country;
          
          league = await LeagueModel.create({
              apiId: lData.id,
              name: lData.name,
              country: countryData.name,
              logo: lData.logo,
              season: params.season 
          });
      }
  }
  return league;
}