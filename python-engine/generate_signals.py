import json
import os

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")
OUTPUT_DIR = os.path.join(BASE_DIR, "output")
OUTPUT_PATH = os.path.join(OUTPUT_DIR, "signals.json")

FIXTURES_PATH = os.path.join(DATA_DIR, "fixtures.json")
TEAMS_PATH = os.path.join(DATA_DIR, "teams.json")
ADJUSTMENTS_PATH = os.path.join(DATA_DIR, "lineup_adjustments.json")


def load_json(path, default):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def build_candidate(market, confidence, value, strength_score, market_gap):
    return {
        "market": market,
        "confidence": round(confidence),
        "value": round(value, 3),
        "strength_score": round(strength_score, 3),
        "market_gap": round(market_gap, 3),
    }


def generate_signal(match, i, teams, adjustments):
    teams_data = match.get("teams", {})

    home = teams_data.get("home", {}).get("name")
    away = teams_data.get("away", {}).get("name")

    print("RAW HOME:", home, "RAW AWAY:", away)

    if not home or not away:
        print("Missing teams in match:", match)
        return None

    home_key = home.strip().lower()
    away_key = away.strip().lower()

    print("LOOKUP HOME:", home_key, "LOOKUP AWAY:", away_key)
    print("AVAILABLE TEAM KEYS:", list(teams.keys()))

    home_team = teams.get(home_key)
    away_team = teams.get(away_key)

    print("HOME TEAM DATA:", home_team)
    print("AWAY TEAM DATA:", away_team)

    if not home_team or not away_team:
        print(f"Missing ratings for {home_key} vs {away_key}")
        return None

    home_attack = home_team.get("attack", 50)
    home_defense = home_team.get("defense", 50)
    away_attack = away_team.get("attack", 50)
    away_defense = away_team.get("defense", 50)

    home_adj = adjustments.get(home_key, {})
    away_adj = adjustments.get(away_key, {})

    home_attack += home_adj.get("attack", 0)
    home_defense += home_adj.get("defense", 0)

    away_attack += away_adj.get("attack", 0)
    away_defense += away_adj.get("defense", 0)

    lineup_adjusted = bool(home_adj or away_adj)

    home_edge = home_attack - away_defense
    away_edge = away_attack - home_defense

    net_edge = home_edge - away_edge

    base_confidence = 50 + (net_edge * 0.6)
    base_confidence = max(40, min(75, base_confidence))

    home_value = net_edge / 100
    away_value = -net_edge / 100

    market_gap = abs(net_edge) / 100

    home_candidate = build_candidate(
        market="home_win",
        confidence=base_confidence,
        value=home_value,
        strength_score=home_edge,
        market_gap=market_gap,
    )

    away_candidate = build_candidate(
        market="away_win",
        confidence=100 - base_confidence,
        value=away_value,
        strength_score=away_edge,
        market_gap=market_gap,
    )

    btts_candidate = build_candidate(
        market="btts_yes",
        confidence=48 + ((home_attack + away_attack - home_defense - away_defense) * 0.15),
        value=((home_attack + away_attack) - (home_defense + away_defense)) / 120,
        strength_score=(home_attack + away_attack) / 2,
        market_gap=abs((home_attack + away_attack) - (home_defense + away_defense)) / 100,
    )

    over_candidate = build_candidate(
        market="over_2_5",
        confidence=47 + ((home_attack + away_attack) * 0.12),
        value=((home_attack + away_attack) - 140) / 100,
        strength_score=(home_attack + away_attack),
        market_gap=abs((home_attack + away_attack) - 140) / 100,
    )

    candidates = [
        home_candidate,
        away_candidate,
        btts_candidate,
        over_candidate,
    ]

    candidates = [c for c in candidates if c["confidence"] >= 40]
    print("CANDIDATES AFTER FILTER:", candidates)

    if not candidates:
        print(f"No candidates left for {home} vs {away}, using home fallback")
        candidates = [{
            "market": "home_win",
            "confidence": 45,
            "value": 0.01,
            "strength_score": 1,
            "market_gap": 0.01,
        }]

    best = sorted(
        candidates,
        key=lambda c: (
            c["strength_score"],
            c["confidence"],
            c["market_gap"],
            c["value"],
        ),
        reverse=True,
    )[0]

    prediction = best["market"]
    confidence = int(best["confidence"])
    value = float(best["value"])
    market_gap = float(best["market_gap"])

    if confidence >= 60:
        grade = "A"
        strength_label = "High"
    elif confidence >= 52:
        grade = "B"
        strength_label = "Medium"
    else:
        grade = "C"
        strength_label = "Low"

    if lineup_adjusted:
        value_reason = "Lineup edge"
    elif market_gap >= 0.08:
        value_reason = "Model >> Market"
    elif market_gap >= 0.04:
        value_reason = "Clear edge"
    else:
        value_reason = "Small edge"

    if market_gap >= 0.08:
        gap_label = "Big gap"
    elif market_gap >= 0.04:
        gap_label = "Clear gap"
    else:
        gap_label = "Small gap"

    kickoff = match.get("fixture", {}).get("date", "")
    league_name = match.get("league", {}).get("name", "Unknown League")

    reasoning = f"{home} attack ({home_attack}) vs {away} defense ({away_defense}) creates edge"

    return {
        "id": i,
        "match": f"{home} vs {away}",
        "league": league_name,
        "prediction": prediction,
        "confidence": confidence,
        "kickoff": kickoff,
        "reasoning": reasoning,
        "grade": grade,
        "value_reason": value_reason,
        "gap_label": gap_label,
        "market_gap": round(market_gap, 3),
        "matchup_bias": "Home attacking advantage" if net_edge >= 0 else "Away attacking advantage",
        "home_lineup_reason": adjustments.get(home_key),
        "away_lineup_reason": adjustments.get(away_key),
        "strength_score": round(best["strength_score"], 3),
        "strength_label": strength_label,
        "home_attack": home_attack,
        "home_defense": home_defense,
        "away_attack": away_attack,
        "away_defense": away_defense,
        "lineup_adjusted": lineup_adjusted,
        "value": round(value, 3),
    }


def main():
    fixtures = load_json(FIXTURES_PATH, [])
    teams = load_json(TEAMS_PATH, {})
    adjustments = load_json(ADJUSTMENTS_PATH, {})

    if not fixtures:
        print("No fixtures found.")
        fixtures = []

    # normalize team keys once
    teams = {str(k).strip().lower(): v for k, v in teams.items()}
    adjustments = {str(k).strip().lower(): v for k, v in adjustments.items()}

    signals = []

    for i, match in enumerate(fixtures, start=1):
        signal = generate_signal(match, i, teams, adjustments)

        if signal:
            signals.append(signal)
        else:
            print("Skipped match:", match)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(signals, f, indent=2)

    print(f"Generated {len(signals)} signals")
    print(f"Saved to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
