from api_client import get_data
from database import col_standings
from config import SEASON

def process_standings(league_id, mongo_league_id, team_api_to_mongo):
    
    standings_data = get_data("standings", {"league": league_id, "season": SEASON})
    if standings_data:
        first_group = standings_data[0]['league']['standings'][0]
        standings_added = 0
        standings_updated = 0
        standings_skipped = 0
        
        for rank_item in first_group:
            t_api_id = rank_item['team']['id']
            
            if t_api_id in team_api_to_mongo:
                standing_doc = {
                    "team": team_api_to_mongo[t_api_id],
                    "rank": rank_item['rank'],
                    "points": rank_item['points'],
                    "league": mongo_league_id,
                    "season": SEASON
                }
                
                existing_standing = col_standings.find_one({
                    "team": team_api_to_mongo[t_api_id], 
                    "league": mongo_league_id, 
                    "season": SEASON
                })
                
                if existing_standing:
                    if (existing_standing.get('rank') != rank_item['rank'] or 
                        existing_standing.get('points') != rank_item['points']):
                        col_standings.replace_one(
                            {"_id": existing_standing['_id']},
                            standing_doc
                        )
                        standings_updated += 1
                    else:
                        standings_skipped += 1
                else:
                    col_standings.insert_one(standing_doc)
                    standings_added += 1
        
