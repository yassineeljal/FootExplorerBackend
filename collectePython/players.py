from api_client import get_data
from database import col_players, col_player_stats
from config import SEASON

def process_players(league_id, mongo_league_id, team_api_to_mongo):
    current_page = 1
    players_added = 0
    players_updated = 0
    players_skipped = 0
    player_stats_added = 0
    player_stats_updated = 0
    player_stats_skipped = 0
    
    while current_page <= 50:
        players_resp = get_data("players", {"league": league_id, "season": SEASON, "page": current_page})
        if not players_resp or len(players_resp) == 0: 
            break
        
        for p_item in players_resp:
            p_info = p_item['player']
            stats_info = p_item['statistics'][0]
            team_api_id = stats_info['team']['id']
            
            player_doc = {
                "apiId": p_info['id'],
                "name": p_info['name'],
                "firstname": p_info['firstname'],
                "lastname": p_info['lastname'],
                "age": p_info['age'],
                "birth": {
                    "date": p_info['birth']['date'],
                    "place": p_info['birth']['place'],
                    "country": p_info['birth']['country']
                },
                "nationality": p_info['nationality'],
                "photo": p_info['photo']
            }
            
            existing_player = col_players.find_one({"apiId": p_info['id']})
            
            if existing_player:
                needs_update = False
                for key, value in player_doc.items():
                    if key == 'birth':
                        if existing_player.get(key) != value:
                            needs_update = True
                            break
                    elif existing_player.get(key) != value:
                        needs_update = True
                        break
                
                if needs_update:
                    col_players.replace_one({"apiId": p_info['id']}, player_doc)
                    players_updated += 1
                else:
                    players_skipped += 1
                
                mongo_player_id = existing_player['_id']
            else:
                result = col_players.insert_one(player_doc)
                mongo_player_id = result.inserted_id
                players_added += 1

            if team_api_id in team_api_to_mongo:
                p_stats_doc = {
                    "player": mongo_player_id,
                    "goals": stats_info['goals']['total'] or 0,
                    "minutes": stats_info['games']['minutes'] or 0,
                    "season": SEASON,
                    "team": team_api_to_mongo[team_api_id],
                    "league": mongo_league_id,
                    "rating": stats_info['games']['rating'] or "N/A"
                }
                
                existing_pstats = col_player_stats.find_one({
                    "player": mongo_player_id, 
                    "season": SEASON, 
                    "team": team_api_to_mongo[team_api_id]
                })
                
                if existing_pstats:
                    if (existing_pstats.get('goals') != p_stats_doc['goals'] or
                        existing_pstats.get('minutes') != p_stats_doc['minutes'] or
                        existing_pstats.get('rating') != p_stats_doc['rating']):
                        col_player_stats.replace_one({"_id": existing_pstats['_id']}, p_stats_doc)
                        player_stats_updated += 1
                    else:
                        player_stats_skipped += 1
                else:
                    col_player_stats.insert_one(p_stats_doc)
                    player_stats_added += 1

        current_page += 1
        