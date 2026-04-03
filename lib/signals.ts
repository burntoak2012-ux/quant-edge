export type Signal = {
  id: number;
  match: string;
  prediction: string;
  confidence: number;
  league: string;
  kickoff: string;
};

export const signals: Signal[] = [
  {
    id: 1,
    match: "Arsenal vs Chelsea",
    prediction: "Over 2.5 Goals",
    confidence: 78,
    league: "Premier League",
    kickoff: "19:45",
  },
  {
    id: 2,
    match: "Barcelona vs Valencia",
    prediction: "Barcelona Win",
    confidence: 82,
    league: "La Liga",
    kickoff: "20:00",
  },
  {
    id: 3,
    match: "Inter vs Milan",
    prediction: "Both Teams to Score",
    confidence: 74,
    league: "Serie A",
    kickoff: "19:30",
  },
];