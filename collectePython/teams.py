from api_client import get_data
from database import col_teams
from config import SEASON

def process_teams(league_id):
    existing_teams = list(col_teams.find({}))
    
    team_api_to_mongo = {}
    teams_to_fetch = False
    
    teams_count = col_teams.count_documents({})
    if teams_count == 0:
        teams_to_fetch = True
    else:
        teams_to_fetch = True
    
    if teams_to_fetch:
        teams_data = get_data("teams", {"league": league_id, "season": SEASON})
        
        if teams_data:
            teams_added = 0
            teams_updated = 0
            teams_skipped = 0
            
            for item in teams_data:
                t = item['team']
                v = item['venue']

                team_doc = {
                    "apiId": t['id'],
                    "name": t['name'],
                    "code": t['code'],
                    "country": t['country'],
                    "founded": t['founded'],
                    "logo": t['logo'],
                    "venue": v['name']
                }

                existing_team = col_teams.find_one({"apiId": t['id']})
                
                if existing_team:
                    needs_update = False
                    for key, value in team_doc.items():
                        if existing_team.get(key) != value:
                            needs_update = True
                            break
                    
                    if needs_update:
                        col_teams.replace_one({"apiId": t['id']}, team_doc)
                        teams_updated += 1
                    else:
                        teams_skipped += 1
                    
                    mongo_team_id = existing_team['_id']
                else:
                    result = col_teams.insert_one(team_doc)
                    mongo_team_id = result.inserted_id
                    teams_added += 1
                
                team_api_to_mongo[t['id']] = mongo_team_id
            
    else:
        for team in existing_teams:
            team_api_to_mongo[team['apiId']] = team['_id']
    
    return team_api_to_mongo
