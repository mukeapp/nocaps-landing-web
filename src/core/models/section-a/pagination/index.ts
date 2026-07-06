

export interface InfiniteFetching {
  data: any[];
  loading: boolean;
  hasMore: boolean;
  loadNext: () => Promise<void>;
  reset: () => Promise<void>;
};