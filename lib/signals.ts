export type Signal = {
  id: number;
  match: string;
  prediction: string;
  confidence: number;
  league: string;
  kickoff: string;
};

export const signals = [
  {
    id: 1,
    match: "Arsenal vs Chelsea",
    league: "Premier League",
    kickoff: "19:45",
    prediction: "Over 2.5 Goals",
    confidence: 78,
  },
  {
    id: 2,
    match: "Barcelona vs Valencia",
    league: "La Liga",
    kickoff: "20:00",
    prediction: "Barcelona Win",
    confidence: 82,
  },
  {
    id: 3,
    match: "Inter vs Milan",
    league: "Serie A",
    kickoff: "19:30",
    prediction: "Both Teams to Score",
    confidence: 74,
  },
];