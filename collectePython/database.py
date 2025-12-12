from pymongo import MongoClient
from config import MONGO_URI, DB_NAME

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

col_leagues = db["leagues"]
col_teams = db["teams"]
col_players = db["players"]
col_player_stats = db["playerstats"]
col_standings = db["standings"]
col_team_stats = db["teamstats"]
