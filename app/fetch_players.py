import json
import os
from pathlib import Path

import requests
from dotenv import load_dotenv

load_dotenv()

API_FOOTBALL_KEY = os.getenv("API_FOOTBALL_KEY")
BASE_URL = "https://v3.football.api-sports.io"

HEADERS = {
    "x-apisports-key": API_FOOTBALL_KEY or ""
}

OUTPUT_PATH = Path("app/players_live.json")


def fetch_teams():
    url = f"{BASE_URL}/teams"
    params = {
        "league": 39,
        "season": 2024
    }
    res = requests.get(url, headers=HEADERS, params=params, timeout=30)
    res.raise_for_status()
    return res.json()["response"]


def fetch_players(team_id):
    url = f"{BASE_URL}/players/squads"
    params = {"team": team_id}
    res = requests.get(url, headers=HEADERS, params=params, timeout=30)
    res.raise_for_status()
    return res.json()["response"]


def main():
    if not API_FOOTBALL_KEY:
        raise ValueError("API_FOOTBALL_KEY not found in .env")

    all_players = []
    teams = fetch_teams()

    for t in teams:
        team_id = t["team"]["id"]
        team_name = t["team"]["name"]

        print(f"Fetching {team_name}...")

        squad = fetch_players(team_id)

        for s in squad:
            for player in s["players"]:
                all_players.append({
                    "name": player["name"],
                    "team": team_name,
                    "position": player.get("position", ""),
                    "age": player.get("age", 0),
                    "league": "Premier League",
                    "form": 7.0,
                    "minutes": 0,
                    "goals": 0,
                    "assists": 0,
                    "key_passes": 0,
                    "recoveries": 0,
                    "tackles": 0,
                    "interceptions": 0,
                    "clearances": 0,
                    "saves": 0,
                    "clean_sheets": 0
                })

    OUTPUT_PATH.write_text(json.dumps(all_players, indent=2), encoding="utf-8")
    print(f"\nSaved {len(all_players)} players to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()