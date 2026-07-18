

export interface StatItem {
  name: string;
  value: number;
}

export interface StatGroup {
  case1: StatItem;
  case2: StatItem;
  case3: StatItem;
}

export interface StatsRowProps {
  stats?: {
    postStats: StatGroup;
    habitStats: StatGroup;
  };
  activeToggle: "post" | "habitStacks";
}