/**
 * Mero Miti Formatting & Bilingual Localization Engine (English & Nepali)
 */

import { BsDate } from './calendar-data';

export const NEPALI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export const NEPALI_MONTHS_NP = [
  "बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज",
  "कात्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"
];

export const NEPALI_MONTHS_EN = [
  "Baishakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

export const NEPALI_DAYS_NP = [
  "आइतबार", "सोमबार", "मंगलबार", "बुधबार", "बिहीबार", "शुक्रबार", "शनिबार"
];

export const NEPALI_DAYS_SHORT_NP = [
  "आइत", "सोम", "मंगल", "बुध", "बिहि", "शुक्र", "शनि"
];

export const NEPALI_DAYS_EN = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

export const NEPALI_DAYS_SHORT_EN = [
  "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
];

export type NumeralType = 'en' | 'ne';
export type LocaleType = 'en' | 'ne';

export const I18N = {
  ne: {
    label: "नेपाली मिति (वि.सं.)",
    badge: "वि.सं.",
    today: "आज",
    prevMonth: "अघिल्लो महिना",
    nextMonth: "पछिल्लो महिना",
    openCalendar: "पात्रो हेर्नुहोस्",
    invalidDate: "अमान्य मिति",
    incompleteDate: "मिति अपूर्ण छ",
    switchLabel: "English"
  },
  en: {
    label: "Nepali Date (B.S.)",
    badge: "B.S.",
    today: "Today",
    prevMonth: "Previous Month",
    nextMonth: "Next Month",
    openCalendar: "Open Calendar",
    invalidDate: "Invalid Date",
    incompleteDate: "Incomplete Date",
    switchLabel: "नेपाली"
  }
};

/**
 * Converts English numerals (0-9) to Nepali Devanagari numerals (०-९).
 */
export function toNepaliDigits(input: number | string): string {
  if (input === null || input === undefined) return '';
  return input.toString().split('').map(ch => {
    const d = parseInt(ch, 10);
    return isNaN(d) ? ch : NEPALI_DIGITS[d];
  }).join('');
}

/**
 * Converts Nepali Devanagari numerals (०-९) to standard English numerals (0-9).
 */
export function toEnglishDigits(input: string): string {
  if (!input) return '';
  return input.split('').map(ch => {
    const idx = NEPALI_DIGITS.indexOf(ch);
    return idx !== -1 ? idx.toString() : ch;
  }).join('');
}

export interface FormatOptions {
  format?: string;        // e.g. 'DD/MM/YYYY' (default), 'DD.MM.YYYY', 'YYYY-MM-DD'
  numeral?: NumeralType;  // 'en' (default) or 'ne'
  locale?: LocaleType;    // 'en' or 'ne'
}

/**
 * Formats a BsDate according to format tokens, locale, and numeral preference.
 */
export function formatBsDate(date: BsDate, options: FormatOptions = {}): string {
  const format = options.format || 'DD/MM/YYYY';
  const locale = options.locale || 'en';
  const numeral = options.numeral || (locale === 'ne' ? 'ne' : 'en');

  const dayStr = date.day.toString().padStart(2, '0');
  const monthStr = date.month.toString().padStart(2, '0');
  const yearStr = date.year.toString();

  const monthNames = locale === 'ne' ? NEPALI_MONTHS_NP : NEPALI_MONTHS_EN;

  let formatted = format
    .replace(/YYYY/g, yearStr)
    .replace(/YY/g, yearStr.slice(-2))
    .replace(/MMMM/g, monthNames[date.month - 1])
    .replace(/MM/g, monthStr)
    .replace(/M/g, date.month.toString())
    .replace(/DD/g, dayStr)
    .replace(/D/g, date.day.toString());

  if (numeral === 'ne') {
    formatted = toNepaliDigits(formatted);
  }

  return formatted;
}

/**
 * Formats a Gregorian Date or AdDate to standard ISO 'YYYY-MM-DD'.
 */
export function formatAdDate(date: { year: number; month: number; day: number } | Date, separator: string = '-'): string {
  let y: number, m: number, d: number;
  if (date instanceof Date) {
    y = date.getFullYear();
    m = date.getMonth() + 1;
    d = date.getDate();
  } else {
    y = date.year;
    m = date.month;
    d = date.day;
  }
  return `${y}${separator}${m.toString().padStart(2, '0')}${separator}${d.toString().padStart(2, '0')}`;
}
