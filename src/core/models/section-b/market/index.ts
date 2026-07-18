import {HabitStackComponent} from "../habit";


export interface HabitStackMarketComponent {
  habitStackId?: string;
  updated?: boolean;
  marketInProgress?: boolean;
  marketPending?: boolean;
  marketPublished?: boolean;
  message?: string;
}

export interface HabitStackComponentPagination {
  habitStackComponents?: HabitStackComponent[];
  numberOfPages?: number;
  pageSize?: number;
  pageNumber?: number;
  totalNumberOfHabitStackComponents?: number;
  sectorId?: string;
}