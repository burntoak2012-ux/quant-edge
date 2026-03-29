import json
from typing import Any, Dict, List


LEAGUE_BONUS = {
    "Premier League": 4,
    "La Liga": 3,
    "Serie A": 3,
    "Bundesliga": 3,
    "Ligue 1": 2,
    "Championship": 1,
}


def clamp(value: float, low: int = 60, high: int = 99) -> int:
    return max(low, min(high, round(value)))


def age_adjustment(age: int) -> int:
    if not isinstance(age, (int,
float)):
        return 0
    
    if 24 <= age <= 29:
        return 2
    if 21 <= age <= 23 or 30 <= age <= 32:
        return 1
    return 0


def get_league_bonus(league: str) -> int:
    return LEAGUE_BONUS.get(league, 0)


def attacker_score(player: Dict[str, Any]) -> float:
    return (
        player.get("goals", 0) * 2.5 +
        player.get("assists", 0) * 0.6 +
        player.get("key_passes", 0) * 0.10
    )


def midfielder_score(player):
    return (
        player.get("assists", 0) * 1.1 + # was 1.0
        player.get("key_passes", 0) * 0.25 + # was 0.20
        player.get("recoveries", 0) * 0.06 # was 0.05
    )


def defender_score(player):
    return (
        player.get("tackles", 0) * 0.16 +
        player.get("interceptions", 0) * 0.16 +
        player.get("clearances", 0) * 0.09 +
        player.get("goals", 0) * 0.7
    )


def goalkeeper_score(player: Dict[str, Any]) -> float:
    return (
        player.get("saves", 0) * 0.15 +
        player.get("clean_sheets", 0) * 0.8
    )


def position_output_score(player: Dict[str, Any]) -> float:
    position = player.get("position", "").upper()

    if position in {"ST", "CF", "LW", "RW"}:
        return attacker_score(player)
    if position in {"CM", "CAM", "CDM"}:
        return midfielder_score(player)
    if position in {"CB", "LB", "RB", "LWB", "RWB"}:
        return defender_score(player)
    if position == "GK":
        return goalkeeper_score(player)

    return 0.0


def player_raw_score(player):
    base = 50
    form_score = min(player.get("form", 0) * 2.5, 20)
    minutes_score = min(player.get("minutes", 0) / 300, 10)
    league_bonus = min(get_league_bonus(player.get("league", "")), 4)
    age_bonus = min(age_adjustment(player.get("age", 0)), 2)
    output_score = position_output_score(player) * 1.2

    return base + form_score + minutes_score + league_bonus + age_bonus + output_score



def scale_to_soccerwiki(raw_score):
    scaled = 60 + (raw_score - 50) * 1.03

    if scaled > 90:
        scaled = 90 + (scaled - 90) * 0.55

    return clamp(scaled, 60, 96)



def player_rating(player):
    raw = player_raw_score(player)
    return scale_to_soccerwiki(raw)


def enrich_players(players: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    enriched = []
    for player in players:
        p = dict(player)
        p["rating"] = player_rating(player)
        enriched.append(p)
    return enriched


def load_players(path: str = "players_live.json") -> List[Dict[str, Any]]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def players_by_team(players: List[Dict[str, Any]], team: str) -> List[Dict[str, Any]]:
    return [p for p in players if p.get("team") == team]


def lineup_rating(lineup: List[Dict[str, Any]]) -> float:
    if not lineup:
        return 0.0
    return round(sum(p["rating"] for p in lineup) / len(lineup), 1)


def team_squad_rating(players: List[Dict[str, Any]], team: str) -> float:
    squad = players_by_team(players, team)
    if not squad:
        return 0.0
    return round(sum(p["rating"] for p in squad) / len(squad), 1)


def best_xi(players: List[Dict[str, Any]], team: str, size: int = 11) -> List[Dict[str, Any]]:
    squad = players_by_team(players, team)
    squad_sorted = sorted(squad, key=lambda p: p["rating"], reverse=True)
    return squad_sorted[:size]
