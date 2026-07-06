import {ScoreResult} from "@/core/models/section-b";


const colorMap: Record<string, string> = {
  gray: "#4b5563", // GRAY -> UNKNOWN | UNKNOW
  red: "#f87171", // RED -> BAD
  purple: "#a855f7", // PURPLE -> POOR
  orange: "#fb923c", // ORANGE -> AVERAGE
  green: "#22c55e", // GREEN -> GOOD
  gold: "#fbbf24", // GOLD -> EXCELLENT | EXCELENT
};


export function getScoreCode(score: number): ScoreResult {
  let scoreCode: string;

  if (score === 0.0) {
    scoreCode = "UNKNOWN";
  } else if (score < 0.2) {
    scoreCode = "BAD";
  } else if (score < 0.6) {
    scoreCode = "POOR";
  } else if (score < 0.8) {
    scoreCode = "AVERAGE";
  } else if (score < 0.9) {
    scoreCode = "GOOD";
  } else {
    scoreCode = "EXCELLENT";
  }

  // round to 2 decimal places
  const scoreCalculated = Math.round(score * 100) / 100;

  return { scoreCalculated, scoreCode };
}

export function getScoreColor(scoreCode: string): string {
  switch (scoreCode) {
    case "UNKNOWN":
      return colorMap.gray;
    case "UNKNOW":
      return colorMap.gray;
    case "BAD":
      return colorMap.red;
    case "POOR":
      return colorMap.purple;
    case "AVERAGE":
      return colorMap.orange;
    case "GOOD":
      return colorMap.green;
    case "EXCELLENT":
      return colorMap.gold;
    case "EXCELENT":
      return colorMap.gold;
    default:
      return colorMap.gray;
  }
}