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

OUTPUT_PATH = Path("app/players_stats_live.json")

TOP_TEAMS = {
    "Arsenal": 42,
    "Liverpool": 40,
    "Manchester City": 50,
    "Chelsea": 49,
    "Tottenham": 47,
}

LEAGUE_ID = 39
SEASON = 2024


def safe_float(value, default=0.0):
    try:
        if value is None or value == "":
            return default
        return float(value)
    except (TypeError, ValueError):
        return default


def safe_int(value, default=0):
    try:
        if value is None or value == "":
            return default
        return int(float(value))
    except (TypeError, ValueError):
        return default


def fetch_players_for_team(team_id: int):
    url = f"{BASE_URL}/players"
    page = 1
    all_rows = []

    while True:
        params = {
            "team": team_id,
            "league": LEAGUE_ID,
            "season": SEASON,
            "page": page,
        }
        res = requests.get(url, headers=HEADERS, params=params, timeout=30)
        res.raise_for_status()
        data = res.json()

        rows = data.get("response", [])
        all_rows.extend(rows)

        paging = data.get("paging", {})
        current = paging.get("current", page)
        total = paging.get("total", page)

        if current >= total:
            break

        page += 1

    return all_rows


def normalize_player(row: dict, team_name: str) -> dict:
    player = row.get("player", {})
    stats_list = row.get("statistics", [])
    stats = stats_list[0] if stats_list else {}

    games = stats.get("games", {})
    goals = stats.get("goals", {})
    passes = stats.get("passes", {})
    tackles = stats.get("tackles", {})
    shots = stats.get("shots", {})

    return {
        "name": player.get("name"),
        "team": team_name,
        "position": games.get("position", "") or "",
        "age": player.get("age", 0),
        "league": "Premier League",

        "form": safe_float(games.get("rating"), 6.5),
        "minutes": safe_int(games.get("minutes"), 0),
        "goals": safe_int(goals.get("total"), 0),
        "assists": safe_int(goals.get("assists"), 0),
        "key_passes": safe_int(passes.get("key"), 0),
        "recoveries": 0, # add later if your endpoint/data includes it
        "tackles": safe_int(tackles.get("total"), 0),
        "interceptions": safe_int(tackles.get("interceptions"), 0),
        "clearances": 0, # add later if your endpoint/data includes it
        "saves": 0, # add later from goalkeeper-specific stats if needed
        "clean_sheets": 0,

        # optional extras for future use
        "shots_total": safe_int(shots.get("total"), 0),
        "shots_on": safe_int(shots.get("on"), 0),
    }


def main():
    if not API_FOOTBALL_KEY:
        raise ValueError("API_FOOTBALL_KEY not found in .env")

    all_players = []

    for team_name, team_id in TOP_TEAMS.items():
        print(f"Fetching stats for {team_name}...")
        rows = fetch_players_for_team(team_id)

        for row in rows:
            all_players.append(normalize_player(row, team_name))

    OUTPUT_PATH.write_text(
        json.dumps(all_players, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    print(f"\nSaved {len(all_players)} players to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()