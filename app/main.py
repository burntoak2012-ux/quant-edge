import random 
import math 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import math

from app.rating_engine import (
    enrich_players,
    load_players,
    lineup_rating,
    best_xi,
    team_squad_rating,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEAM_FORM = {
    "Liverpool": 2.0,
    "Arsenal": 1.5,
    "Manchester City": 2.5,
    "Chelsea": -0.5,
    "Tottenham": -1.0,
}

HOME_AWAY_SPLIT = {
    "Liverpool": {"home": 1.2, "away": 0.3},
    "Arsenal": {"home": 1.0, "away": 0.5},
    "Manchester City": {"home": 1.3, "away": 0.8},
    "Chelsea": {"home": 0.4, "away": -0.2},
    "Tottenham": {"home": 0.3, "away": -0.4},
}
def adjust_for_lineups(team_rating, missing_players):
    penalty = 0

    for player in missing_players:
        if player["importance"] == "high":
            penalty += 5
        elif player["importance"] == "medium":
            penalty += 2
        elif player["importance"] == "low":
            penalty += 1

    return max(team_rating - penalty, 0)

missing_players_map = {
    "Arsenal": [
        {"name": "Saka", "importance": "high"}
    ],
    "Chelsea": [],
    "Manchester City": [
        {"name": "De Bruyne", "importance": "high"}
    ],
    "Aston Villa": [],
    "West Ham": [
        {"name": "Paqueta", "importance": "medium"}
    ],
    "Manchester United": [
        {"name": "Bruno Fernandes", "importance": "high"}
    ],
    "Everton": []
}

@app.get("/signal")
def signal():
    players = enrich_players(load_players("app/players_stats_live.json"))

    fixtures = [
    ("Liverpool", "Tottenham"),
    ("Arsenal", "Chelsea"),
    ("Manchester City", "Arsenal"),
    ("Newcastle", "Brighton"),
    ("Aston Villa", "West Ham"),
    ("Manchester United", "Everton"),
]


    market_odds_map = {
        "Liverpool vs Tottenham": {"home": 1.80, "draw": 3.80, "away": 4.50},
        "Arsenal vs Chelsea": {"home": 1.95, "draw": 3.60, "away": 4.20},
        "Manchester City vs Arsenal": {"home": 2.10, "draw": 3.50, "away": 3.30},
        "Newcastle vs Brighton": {"home": 2.2, "draw": 3.4, "away": 3.1},
"Aston Villa vs West Ham": {"home": 2.0, "draw": 3.5, "away": 3.8},
"Manchester United vs Everton": {"home": 1.9, "draw": 3.6, "away": 4.2},
    }

    results = []

    for home_team, away_team in fixtures:
        home_xi = best_xi(players, home_team)
        away_xi = best_xi(players, away_team)

        home_lineup = lineup_rating(home_xi)
        away_lineup = lineup_rating(away_xi)

        home_squad = team_squad_rating(players, home_team)
        away_squad = team_squad_rating(players, away_team)

        home_rating = round((home_lineup * 0.7 + home_squad * 0.3) * 1.03, 1)
        away_rating = round((away_lineup * 0.7 + away_squad * 0.3), 1)

        home_form_bonus = TEAM_FORM.get(home_team, 0)
        away_form_bonus = TEAM_FORM.get(away_team, 0)

        home_split = HOME_AWAY_SPLIT.get(home_team, {"home": 0, "away": 0})["home"]
        away_split = HOME_AWAY_SPLIT.get(away_team, {"home": 0, "away": 0})["away"]

        home_rating = round(home_rating + home_form_bonus + home_split, 1)
        away_rating = round(away_rating + away_form_bonus + away_split, 1)

        home_missing = missing_players_map.get(home_team, [])
        away_missing = missing_players_map.get(away_team, [])

        home_lineup_penalty = sum(
        5 if p["importance"] == "high"
        else 2 if p["importance"] == "medium"
        else 1
        for p in home_missing
)

        away_lineup_penalty = sum(
    5 if p["importance"] == "high"
    else 2 if p["importance"] == "medium"
    else 1
    for p in away_missing
)

        home_rating = adjust_for_lineups(home_rating, home_missing)
        away_rating = adjust_for_lineups(away_rating, away_missing)

        edge = round(home_rating - away_rating, 2)

        draw_prob = 0.30 * math.exp(-abs(edge) / 6)
        draw_prob = max(0.20, min(0.33, draw_prob))

        home_share = 1 / (1 + math.exp(-edge / 6))
        away_share = 1 - home_share

        non_draw = 1 - draw_prob
        home_win_prob = non_draw * home_share
        away_win_prob = non_draw * away_share

        total = home_win_prob + draw_prob + away_win_prob
        home_win_prob /= total
        draw_prob /= total
        away_win_prob /= total

        match_name = f"{home_team} vs {away_team}"
        market = market_odds_map[match_name]

        market_home_odds = market["home"]
        market_draw_odds = market["draw"]
        market_away_odds = market["away"]

        raw_home = 1 / market_home_odds
        raw_draw = 1 / market_draw_odds
        raw_away = 1 / market_away_odds

        market_total = raw_home + raw_draw + raw_away

        market_home_prob = raw_home / market_total
        market_draw_prob = raw_draw / market_total
        market_away_prob = raw_away / market_total

        home_edge = home_win_prob - market_home_prob
        draw_edge = draw_prob - market_draw_prob
        away_edge = away_win_prob - market_away_prob

        edges = {
            "HOME": home_edge,
            "DRAW": draw_edge,
            "AWAY": away_edge,
        }

        best_bet = max(edges, key=edges.get)
        best_edge = edges[best_bet]

        if best_edge > 0.10:
            confidence = "HIGH"
        elif best_edge > 0.05:
            confidence = "MEDIUM"
        else:
            confidence = "LOW"

        results.append({
            "match": match_name,
            "edge": edge,
            "home_rating": home_rating,
            "away_rating": away_rating,
            "home_win_probability": round(home_win_prob, 3),
            "draw_probability": round(draw_prob, 3),
            "away_win_probability": round(away_win_prob, 3),
            "home_fair_odds": round(1 / home_win_prob, 2),
            "draw_fair_odds": round(1 / draw_prob, 2),
            "away_fair_odds": round(1 / away_win_prob, 2),
            "market_home_odds": market_home_odds,
            "market_draw_odds": market_draw_odds,
            "market_away_odds": market_away_odds,
            "home_edge": round(home_edge, 3),
            "draw_edge": round(draw_edge, 3),
            "away_edge": round(away_edge, 3),
            "best_bet": best_bet,
            "best_edge": round(best_edge, 3),
            "confidence": confidence,
        })

        results = [r for r in results if r["best_edge"] > 0]
    results = sorted(results, key=lambda x: x["best_edge"], reverse=True)

    top_picks = results[:3]

    return {
        "top_picks": top_picks,
        "all": results
    }


@app.get("/table")
def table():
    players = enrich_players(load_players("app/players_stats_live.json"))
    teams = sorted(set(p["team"] for p in players))

    table_data = []

    for team in teams:
        squad_rating_value = team_squad_rating(players, team)
        best_xi_players = best_xi(players, team)
        best_xi_rating_value = lineup_rating(best_xi_players)

        table_data.append({
            "team": team,
            "squad_rating": round(squad_rating_value, 1),
            "best_xi_rating": round(best_xi_rating_value, 1),
        })

    table_data = sorted(table_data, key=lambda x: x["best_xi_rating"], reverse=True)

    for i, row in enumerate(table_data, start=1):
        row["rank"] = i

    return table_data