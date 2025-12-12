from api_client import get_data
from database import col_leagues
from config import SEASON

def process_league(league_id):
    existing_league = col_leagues.find_one({"apiId": league_id, "season": SEASON})
    
    if existing_league:
        mongo_league_id = existing_league['_id']
        
        leagues_data = get_data("leagues", {"id": league_id, "season": SEASON})
        if leagues_data:
            l_data = leagues_data[0]
            league_info = l_data['league']
            country_info = l_data['country']
            
            if (existing_league.get('name') != league_info['name'] or 
                existing_league.get('country') != country_info['name'] or
                existing_league.get('logo') != league_info['logo']):
                
                league_doc = {
                    "apiId": league_info['id'],
                    "name": league_info['name'],
                    "country": country_info['name'],
                    "logo": league_info['logo'],
                    "season": SEASON
                }
                col_leagues.replace_one({"_id": mongo_league_id}, league_doc)

    else:
        leagues_data = get_data("leagues", {"id": league_id, "season": SEASON})
        if not leagues_data:
            return None
        
        l_data = leagues_data[0]
        league_info = l_data['league']
        country_info = l_data['country']

        league_doc = {
            "apiId": league_info['id'],
            "name": league_info['name'],
            "country": country_info['name'],
            "logo": league_info['logo'],
            "season": SEASON
        }

        existing = col_leagues.find_one({"apiId": league_info['id']})
        if existing:
            col_leagues.replace_one({"apiId": league_info['id']}, league_doc)
            mongo_league_id = existing['_id']
        else:
            result = col_leagues.insert_one(league_doc)
            mongo_league_id = result.inserted_id
    
    return mongo_league_id
