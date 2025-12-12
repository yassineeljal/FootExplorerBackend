import schedule
import time
from config import TARGET_LEAGUE_IDS
from leagues import process_league
from teams import process_teams
from standings import process_standings
from team_stats import process_team_stats
from players import process_players

def process_ingestion():
    print("Le cron commence")
    for league_id in TARGET_LEAGUE_IDS:
        mongo_league_id = process_league(league_id)
        if not mongo_league_id:
            continue

        team_api_to_mongo = process_teams(league_id)
        process_standings(league_id, mongo_league_id, team_api_to_mongo)
        process_team_stats(league_id, mongo_league_id, team_api_to_mongo)
        process_players(league_id, mongo_league_id, team_api_to_mongo)
    
def job():
    try:
        process_ingestion()
    except Exception as e:
        print(f"{e}")


if __name__ == "__main__":
    schedule.every(24).hours.do(job)
    job()
    
    while True:
        schedule.run_pending()
        time.sleep(60)
