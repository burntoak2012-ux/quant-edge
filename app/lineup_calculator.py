from rating_engine import enrich_players, load_players, lineup_rating


def calculate_match_lineup_rating(home_lineup_names, away_lineup_names, path="players.json"):
    players = enrich_players(load_players(path))

    player_map = {p["name"]: p for p in players}

    home_lineup = [player_map[name] for name in home_lineup_names if name in player_map]
    away_lineup = [player_map[name] for name in away_lineup_names if name in player_map]

    return {
        "home_rating": lineup_rating(home_lineup),
        "away_rating": lineup_rating(away_lineup),
        "difference": round(lineup_rating(home_lineup) - lineup_rating(away_lineup), 1),
        "home_players": home_lineup,
        "away_players": away_lineup,
    }


if __name__ == "__main__":
    home = ["Bukayo Saka", "Martin Odegaard", "Declan Rice"]
    away = ["Mohamed Salah", "Virgil van Dijk", "Alisson"]

    result = calculate_match_lineup_rating(home, away)
    print(result)