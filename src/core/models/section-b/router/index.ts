import {IUser} from "../../section-a";
import {HabitComponent, HabitLinkComponent, HabitLinkItemComponent, HabitStackComponent} from "../habit";
import {Sector} from "../sector";


export interface RouterData {
  destinationScreenTitle?: string;
  user?: IUser;
  userId?: string;
  habitStack?: HabitStackComponent;
  habit?: HabitComponent;
  habitLink?: HabitLinkComponent;
  habitLinkItem?: HabitLinkItemComponent;
  dataHasOnlySelfUser?: boolean;
  habitSectorId?: string;
  habitStackId?: string;
  habitId?: string;
  habitLinkId?: string;
  habitLinkItemId?: string;
  costSymbol?: string;
  sectorId?: string;
  habitCategories?: Array<{ id: number; name: string }>;
  sectors?: Sector[];
  selectedCategoryId?: number;
  canEdit?: boolean;
  preOriginScreenLevel1?: string;
  userIds?: string[];
  habitStackIds?: string[];
  habitStackSearchName?: string;
  postId?: string;
  steerDescription?: string;
  modelId?: string;
};