from api_client import get_data
from database import col_team_stats
from config import SEASON

def process_team_stats(league_id, mongo_league_id, team_api_to_mongo):
    
    team_count = 0
    stats_added = 0
    stats_skipped = 0
    
    for api_t_id, mongo_t_id in team_api_to_mongo.items():
        team_count += 1
        
        existing_stats = col_team_stats.find_one({
            "team": mongo_t_id, 
            "league": mongo_league_id, 
            "season": SEASON
        })
        
        if existing_stats:
            stats_skipped += 1
            continue
        
        ts_data = get_data("teams/statistics", {"league": league_id, "season": SEASON, "team": api_t_id})
        if ts_data:
            ts_doc = {
                "team": mongo_t_id,
                "league": mongo_league_id,
                "season": SEASON,
                "wins": ts_data['fixtures']['wins']['total'],
                "goalsFor": ts_data['goals']['for']['total']['total'],
                "formation": ts_data['lineups'][0]['formation'] if ts_data['lineups'] else "N/A"
            }

            col_team_stats.insert_one(ts_doc)
            stats_added += 1
    
