import requests
import time
from config import API_URL, HEADERS

def get_data(endpoint, params=None):
    response = requests.get(f"{API_URL}/{endpoint}", headers=HEADERS, params=params)
    if response.status_code != 200:
        return None
    
    data = response.json()
    if "errors" in data and data["errors"]:
        return None
    
    time.sleep(6)
    return data['response']
