import os
from dotenv import load_dotenv
load_dotenv()
API_KEY = os.getenv("API_KEY", "d4520e044824e926c9242fa33f38475d")
API_URL = os.getenv("API_URL", "https://v3.football.api-sports.io")
HEADERS = {"x-apisports-key": API_KEY}
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "footexplorer")
TARGET_LEAGUE_IDS = [int(id) for id in os.getenv("TARGET_LEAGUE_IDS", "61,39,135,78,140").split(",")]
SEASON = int(os.getenv("SEASON", "2025"))

