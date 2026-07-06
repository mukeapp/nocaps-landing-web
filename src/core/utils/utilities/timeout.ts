const MIN = 60_000;

export const Timeout = {
  generateHabitStacks:   10 * MIN,  // 10 min
  generateHabit:         10 * MIN,  // 10 min
  generateHabitLink:     10 * MIN,  // 10 min
  generateHabitLinkItem:  5 * MIN,  //  5 min
  swapHabit:             10 * MIN,  // 10 min
  swapHabitLink:         10 * MIN,  // 10 min
  swapHabitLinkItem:      5 * MIN,  //  5 min
  postOperation:         30_000,    // 30 sec
};

export const toSeconds = (ms: number) => ms / 1000;
