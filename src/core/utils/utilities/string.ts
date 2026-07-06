

// create a method for a substring that returns the first n characters of a string followed by "..." if the string is longer than n characters
export const truncateString = (str: string, num: number): string => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
}