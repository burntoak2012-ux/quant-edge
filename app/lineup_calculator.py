from rating_engine import enrich_players, load_players, lineup_rating
import sys
import json


def calculate_match_lineup_rating(
    home_lineup_names,
    away_lineup_names,
    path="app/players.json"
):
    players = enrich_players(load_players(path))

    player_map = {p["name"]: p for p in players}

    home_lineup = [player_map[name] for name in home_lineup_names if name in player_map]
    away_lineup = [player_map[name] for name in away_lineup_names if name in player_map]

    return {
        "home_rating": lineup_rating(home_lineup),
        "away_rating": lineup_rating(away_lineup),
        "difference": round(lineup_rating(home_lineup) - lineup_rating(away_lineup), 1),
    }


def get_team_lineup(team_name):
    team_map = {
        "Arsenal": ["Bukayo Saka", "Martin Odegaard", "Declan Rice"],
        "Liverpool": ["Mohamed Salah", "Virgil van Dijk", "Alisson"],
    }

    if team_name in team_map:
        return team_map[team_name]

    return ["Bukayo Saka", "Declan Rice", "Virgil van Dijk"]


if __name__ == "__main__":
    home_team = sys.argv[1]
    away_team = sys.argv[2]

    home = get_team_lineup(home_team)
    away = get_team_lineup(away_team)

    result = calculate_match_lineup_rating(home, away)

    print(json.dumps({
        "home_rating": round(result["home_rating"]),
        "away_rating": round(result["away_rating"]),
        "difference": round(result["difference"])
    }))