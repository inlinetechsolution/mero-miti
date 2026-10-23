/**
 * Mero Miti Core Date Converter (BS <-> AD)
 */

import {
  BsDate,
  AdDate,
  BsFiscalYear,
  FiscalYearRange,
  FiscalQuarterRange,
  getMonthDaysForBsYear,
  getDaysInBsMonth,
  getTotalDaysInBsYear
} from './calendar-data';
import { toNepaliDigits } from './formatter';

// Anchor point: 2080 BS Baishakh 1 is 2023-04-14 AD
const ANCHOR_BS_YEAR = 2080;
const ANCHOR_BS_MONTH = 1;
const ANCHOR_BS_DAY = 1;
// UTC timestamp for 2023-04-14 00:00:00 UTC
const ANCHOR_AD_TIME = Date.UTC(2023, 3, 14); // Note: JS month is 0-indexed (3 = April)
const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Normalizes any Date or AdDate into UTC midnight timestamp.
 */
function toUtcMidnight(date: Date | AdDate): number {
  if (date instanceof Date) {
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  }
  return Date.UTC(date.year, date.month - 1, date.day);
}

/**
 * Converts a Gregorian (A.D.) date to Bikram Sambat (B.S.).
 */
export function adToBs(date: Date | AdDate): BsDate {
  const targetUtc = toUtcMidnight(date);
  let dayDiff = Math.round((targetUtc - ANCHOR_AD_TIME) / MS_PER_DAY);

  let currentYear = ANCHOR_BS_YEAR;
  let currentMonth = ANCHOR_BS_MONTH; // 1-indexed
  let currentDay = ANCHOR_BS_DAY;

  if (dayDiff >= 0) {
    // Forward in time
    while (true) {
      const { days } = getMonthDaysForBsYear(currentYear);
      const daysInCurrentMonth = days[currentMonth - 1];
      const remainingDaysInMonth = daysInCurrentMonth - currentDay;

      if (dayDiff <= remainingDaysInMonth) {
        currentDay += dayDiff;
        break;
      }

      dayDiff -= (remainingDaysInMonth + 1);
      currentDay = 1;
      currentMonth++;

      if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
      }
    }
  } else {
    // Backward in time
    dayDiff = Math.abs(dayDiff);
    while (dayDiff > 0) {
      if (currentDay > 1) {
        const canStep = Math.min(dayDiff, currentDay - 1);
        currentDay -= canStep;
        dayDiff -= canStep;
      } else {
        // Move to previous month
        currentMonth--;
        if (currentMonth < 1) {
          currentMonth = 12;
          currentYear--;
        }
        const { days } = getMonthDaysForBsYear(currentYear);
        currentDay = days[currentMonth - 1];
        dayDiff -= 1;
      }
    }
  }

  return {
    year: currentYear,
    month: currentMonth,
    day: currentDay
  };
}

/**
 * Converts a Bikram Sambat (B.S.) date to Gregorian (A.D.).
 */
export function bsToAd(bsDate: BsDate): AdDate {
  const { year, month, day } = bsDate;

  // Calculate day difference from ANCHOR_BS (2080-01-01)
  let dayDiff = 0;

  if (year >= ANCHOR_BS_YEAR) {
    // Forward from anchor year
    for (let y = ANCHOR_BS_YEAR; y < year; y++) {
      dayDiff += getTotalDaysInBsYear(y);
    }
    const { days } = getMonthDaysForBsYear(year);
    for (let m = 1; m < month; m++) {
      dayDiff += days[m - 1];
    }
    dayDiff += (day - 1);
  } else {
    // Backward from anchor year
    for (let y = ANCHOR_BS_YEAR - 1; y > year; y--) {
      dayDiff -= getTotalDaysInBsYear(y);
    }
    // Handle the current target year's remaining months
    const { days: targetDays } = getMonthDaysForBsYear(year);
    let daysInTargetYearAfter = 0;
    for (let m = month; m <= 12; m++) {
      if (m === month) {
        daysInTargetYearAfter += (targetDays[m - 1] - day + 1);
      } else {
        daysInTargetYearAfter += targetDays[m - 1];
      }
    }
    dayDiff -= daysInTargetYearAfter;
  }

  const resultTime = ANCHOR_AD_TIME + (dayDiff * MS_PER_DAY);
  const resultDate = new Date(resultTime);

  return {
    year: resultDate.getUTCFullYear(),
    month: resultDate.getUTCMonth() + 1,
    day: resultDate.getUTCDate()
  };
}

/**
 * Convenience helper to convert BS date directly into a native JavaScript Date object.
 */
export function bsToJsDate(bsDate: BsDate): Date {
  const ad = bsToAd(bsDate);
  return new Date(ad.year, ad.month - 1, ad.day);
}

/**
 * Resolves the Nepali Fiscal Year (आर्थिक वर्ष) for a given date.
 * If no date is passed, the current system date is evaluated.
 * In Nepal, the fiscal year starts on Shrawan 1 (month 4) of year Y and ends on Ashadh end of year Y+1.
 */
export function getFiscalYear(date?: Date | AdDate | BsDate): BsFiscalYear {
  let bs: BsDate;
  if (!date) {
    bs = adToBs(new Date());
  } else if ('year' in date && 'month' in date && 'day' in date) {
    if (date.year < 1973) {
      bs = adToBs(date as AdDate);
    } else {
      bs = date as BsDate;
    }
  } else if (date instanceof Date) {
    bs = adToBs(date);
  } else {
    bs = adToBs(new Date());
  }

  const startBsYear = bs.month >= 4 ? bs.year : bs.year - 1;
  const endBsYear = startBsYear + 1;
  const code = `${startBsYear}/${(endBsYear % 100).toString().padStart(2, '0')}`;
  const nepaliCode = toNepaliDigits(code);

  return {
    startBsYear,
    endBsYear,
    code,
    nepaliCode
  };
}

/**
 * Returns the exact Gregorian (A.D.) and Bikram Sambat (B.S.) date boundaries
 * for a given Nepali Fiscal Year (e.g. 2081, "2081/82", or a BsFiscalYear object).
 */
export function getFiscalYearRange(yearOrCode?: number | string | BsFiscalYear): FiscalYearRange {
  let startYear: number;
  if (!yearOrCode) {
    startYear = getFiscalYear().startBsYear;
  } else if (typeof yearOrCode === 'number') {
    startYear = yearOrCode;
  } else if (typeof yearOrCode === 'string') {
    startYear = parseInt(yearOrCode.trim().split('/')[0], 10);
  } else {
    startYear = yearOrCode.startBsYear;
  }

  const endYear = startYear + 1;
  const startBs: BsDate = { year: startYear, month: 4, day: 1 };
  const lastDayAshadh = getDaysInBsMonth(endYear, 3);
  const endBs: BsDate = { year: endYear, month: 3, day: lastDayAshadh };

  const startAd = bsToAd(startBs);
  const endAd = bsToAd(endBs);

  const fiscalYear = getFiscalYear(startBs);

  return {
    fiscalYear,
    startBs,
    endBs,
    startAd,
    endAd,
    startDate: bsToJsDate(startBs),
    endDate: bsToJsDate(endBs)
  };
}

/**
 * Calculates all 4 financial quarters (त्रैमासिक / चौमासिक) for a Nepali Fiscal Year
 * with exact Gregorian and Bikram Sambat start and end dates.
 */
export function getFiscalYearQuarters(yearOrCode?: number | string | BsFiscalYear): FiscalQuarterRange[] {
  const range = getFiscalYearRange(yearOrCode);
  const y1 = range.fiscalYear.startBsYear;
  const y2 = range.fiscalYear.endBsYear;

  const q1EndDay = getDaysInBsMonth(y1, 6);
  const q2EndDay = getDaysInBsMonth(y1, 9);
  const q3EndDay = getDaysInBsMonth(y1, 12);
  const q4EndDay = getDaysInBsMonth(y2, 3);

  const q1StartBs: BsDate = { year: y1, month: 4, day: 1 };
  const q1EndBs: BsDate = { year: y1, month: 6, day: q1EndDay };

  const q2StartBs: BsDate = { year: y1, month: 7, day: 1 };
  const q2EndBs: BsDate = { year: y1, month: 9, day: q2EndDay };

  const q3StartBs: BsDate = { year: y1, month: 10, day: 1 };
  const q3EndBs: BsDate = { year: y1, month: 12, day: q3EndDay };

  const q4StartBs: BsDate = { year: y2, month: 1, day: 1 };
  const q4EndBs: BsDate = { year: y2, month: 3, day: q4EndDay };

  return [
    {
      quarter: 1,
      name: "Q1 (Shrawan - Ashwin)",
      nepaliName: "प्रथम त्रैमासिक (साउन - असोज)",
      startBs: q1StartBs,
      endBs: q1EndBs,
      startAd: bsToAd(q1StartBs),
      endAd: bsToAd(q1EndBs),
      startDate: bsToJsDate(q1StartBs),
      endDate: bsToJsDate(q1EndBs)
    },
    {
      quarter: 2,
      name: "Q2 (Kartik - Poush)",
      nepaliName: "दोस्रो त्रैमासिक (कात्तिक - पुस)",
      startBs: q2StartBs,
      endBs: q2EndBs,
      startAd: bsToAd(q2StartBs),
      endAd: bsToAd(q2EndBs),
      startDate: bsToJsDate(q2StartBs),
      endDate: bsToJsDate(q2EndBs)
    },
    {
      quarter: 3,
      name: "Q3 (Magh - Chaitra)",
      nepaliName: "तेस्रो त्रैमासिक (माघ - चैत)",
      startBs: q3StartBs,
      endBs: q3EndBs,
      startAd: bsToAd(q3StartBs),
      endAd: bsToAd(q3EndBs),
      startDate: bsToJsDate(q3StartBs),
      endDate: bsToJsDate(q3EndBs)
    },
    {
      quarter: 4,
      name: "Q4 (Baisakh - Ashadh)",
      nepaliName: "चौथो त्रैमासिक (बैशाख - असार)",
      startBs: q4StartBs,
      endBs: q4EndBs,
      startAd: bsToAd(q4StartBs),
      endAd: bsToAd(q4EndBs),
      startDate: bsToJsDate(q4StartBs),
      endDate: bsToJsDate(q4EndBs)
    }
  ];
}
