import os
import json
from datetime import datetime, timedelta
from pathlib import Path

import requests
from dotenv import load_dotenv

# Load root .env.local
load_dotenv(Path(__file__).resolve().parents[1] / ".env.local")

API_KEY = os.getenv("API_FOOTBALL_KEY")
BASE_URL = "https://v3.football.api-sports.io/fixtures"

# Broader coverage for testing / production
LEAGUE_IDS = [39, 140, 135, 78, 61, 88, 94] # EPL, La Liga, Serie A, Bundesliga, Ligue 1, Eredivisie, Primeira Liga

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")
OUTPUT_PATH = os.path.join(DATA_DIR, "fixtures.json")

os.makedirs(DATA_DIR, exist_ok=True)

HEADERS = {
    "x-apisports-key": API_KEY or "",
}

today = datetime.utcnow().date()
CANDIDATE_DATES = [str(today + timedelta(days=i)) for i in range(0, 7)]


def fallback_fixtures():
    return [
        {
            "fixture": {
                "id": 1001,
                "date": "2026-04-23T20:00:00+00:00",
            },
            "league": {
                "id": 39,
                "name": "Premier League",
            },
            "teams": {
                "home": {"id": 50, "name": "Arsenal"},
                "away": {"id": 49, "name": "Chelsea"},
            },
        },
        {
            "fixture": {
                "id": 1002,
                "date": "2026-04-29T20:00:00+00:00",
            },
            "league": {
                "id": 140,
                "name": "La Liga",
            },
            "teams": {
                "home": {"id": 529, "name": "Barcelona"},
                "away": {"id": 532, "name": "Valencia"},
            },
        },
        {
            "fixture": {
                "id": 1003,
                "date": "2026-04-28T19:45:00+00:00",
            },
            "league": {
                "id": 135,
                "name": "Serie A",
            },
            "teams": {
                "home": {"id": 505, "name": "Inter"},
                "away": {"id": 497, "name": "Roma"},
            },
        },
    ]


def infer_season(candidate_date: str) -> int:
    dt = datetime.strptime(candidate_date, "%Y-%m-%d").date()
    # Football season usually starts mid-year; API often expects the start year
    return dt.year if dt.month >= 7 else dt.year - 1


def fetch_for_date(candidate_date: str):
    all_matches = []

    for league_id in LEAGUE_IDS:
        params = {
            "league": league_id,
            "date": candidate_date,
            "season": infer_season(candidate_date),
        }

        try:
            response = requests.get(BASE_URL, headers=HEADERS, params=params, timeout=20)
            print(f"League {league_id} on {candidate_date} status: {response.status_code}")

            if response.status_code != 200:
                print(f"League {league_id} on {candidate_date} request failed")
                continue

            payload = response.json()
            print("FULL PAYLOAD:", payload)
            break
            fixtures = payload.get("response", [])
            print(f"League {league_id} on {candidate_date} fixtures returned: {len(fixtures)}")

            if fixtures:
                all_matches.extend(fixtures)

        except Exception as err:
            print(f"League {league_id} on {candidate_date} error: {err}")

    return all_matches


def main():
    if not API_KEY:
        raise ValueError("Missing API_FOOTBALL_KEY in environment variables")

    print("CANDIDATE_DATES:", CANDIDATE_DATES)

    fixtures = []
    for candidate_date in CANDIDATE_DATES:
        print(f"\n=== Trying date {candidate_date} ===")
        day_matches = fetch_for_date(candidate_date)
        if day_matches:
            fixtures.extend(day_matches)

    if not fixtures:
        print("⚠️ API returned no fixtures on free plan dates. Using fallback fixtures.")
        fixtures = fallback_fixtures()

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(fixtures, f, indent=2)

    print(f"✅ Saved {len(fixtures)} fixtures to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()