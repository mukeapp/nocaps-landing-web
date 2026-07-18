export { wp, hp, fs, isTablet } from "./responsive";
import {apiRequest, handleApiError} from "./utilities/api";
import {getDaysInMonth, getFirstDayOfMonth, getWeeksInMonth} from "./utilities/calendar";
import {normalizeColor} from "./utilities/color";
import {compressImage} from "./utilities/compressImage";
import {ConstantsUtils} from "./utilities/constantUtils";
import { getEnv } from "./utilities/env";
import {canShowCopyButton, countItemsForHabit, countItemsForHabitStack, getHabitCategories, isHabitAIScored, isHabitLinkAIScored, isHabitStackAIScored} from "./utilities/habitUtils";
import { getDefaultImageUrl, getDefaultImageUrl2, getImageKey, imageKeyFromUrl, resolveImageSource } from "./utilities/images";
import { openPrivacy, openTOS } from "./utilities/links";
import {getHabitMarketActions} from "./utilities/marketUtils";
import {formatCost, formatCostAsNumber, formatCostAsNumberWithParamString, formatCredits} from "./utilities/numberUtils";
import {canEditScreen, canGoToSwapScreenFunc} from "./utilities/screenAccessCore";
import {truncateString} from "./utilities/string";
import { showToast, showToastError, showToastSuccess } from "./utilities/toast";
import {getGroupTotalCost} from "./utilities/totals";
import {ensureMinTotalCost, formatCostDecimal} from "./utilities/totalCost";
import { buildUserFromTempAndAuth } from "./utilities/user";
import uuidUtils from "./utilities/uuidUtils";
import { isStrongPassword, isValidEmail } from "./utilities/validation";

export {
  buildUserFromTempAndAuth,
  getEnv,
  isStrongPassword,
  isValidEmail,
  openPrivacy,
  openTOS,
  showToast,
  showToastError,
  showToastSuccess,
  imageKeyFromUrl,
  resolveImageSource,
  compressImage,
  uuidUtils,
  getImageKey,
  getGroupTotalCost,
  ensureMinTotalCost,
  formatCostDecimal,
  canEditScreen,
  getHabitCategories,
  formatCost,
  formatCostAsNumber,
  canShowCopyButton,
  isHabitLinkAIScored,
  isHabitAIScored,
  isHabitStackAIScored,
  countItemsForHabit,
  countItemsForHabitStack,
  getDefaultImageUrl,
  getDefaultImageUrl2,
  normalizeColor,
  truncateString,
  getWeeksInMonth,
  getDaysInMonth,
  getFirstDayOfMonth,
  handleApiError,
  apiRequest,
  getHabitMarketActions,
  ConstantsUtils,
  canGoToSwapScreenFunc,
  formatCostAsNumberWithParamString,
  formatCredits
};
