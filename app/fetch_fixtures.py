def fetch_fixtures():
    url = "https://v3.football.api-sports.io/fixtures"

    params = {
        "league": 39, # Premier League
        "season": 2024,
        "next": 20 # ⬅️ increase this
    }

    headers = {
        "x-apisports-key": API_KEY
    }

    response = requests.get(url, headers=headers, params=params)
    data = response.json()

    fixtures = []

    for match in data.get("response", []):
        home = match["teams"]["home"]["name"]
        away = match["teams"]["away"]["name"]

        fixtures.append({
            "home": home,
            "away": away
        })

    print(f"Loaded {len(fixtures)} fixtures") # 👈 debug

    return fixtures