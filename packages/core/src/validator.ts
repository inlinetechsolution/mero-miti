/**
 * Mero Miti Strict Validation & Parsing Engine
 */

import { BsDate, getDaysInBsMonth } from './calendar-data';
import { toEnglishDigits } from './formatter';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  parsed?: BsDate;
}

/**
 * Parses a string into a BsDate based on the specified format pattern.
 * Supports separators: '/', '.', '-'
 */
export function parseBsDate(input: string, format: string = 'DD/MM/YYYY'): ValidationResult {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: 'मिति आवश्यक छ (Date is required)' };
  }

  // 1. Normalize Devanagari digits to English digits
  const normalized = toEnglishDigits(input.trim());

  // 2. Extract separator from format
  const separatorMatch = format.match(/[/.-]/);
  const separator = separatorMatch ? separatorMatch[0] : '/';

  // Split both input and format
  const inputParts = normalized.split(separator);
  const formatParts = format.split(separator);

  if (inputParts.length !== 3 || formatParts.length !== 3) {
    return { isValid: false, error: `ढाँचा मिलेन: ${format} अनुसार हुनुपर्छ` };
  }

  let day = NaN;
  let month = NaN;
  let year = NaN;

  for (let i = 0; i < 3; i++) {
    const f = formatParts[i].toUpperCase();
    const val = parseInt(inputParts[i], 10);

    if (isNaN(val)) {
      return { isValid: false, error: 'अमान्य संख्या प्रविष्टि भयो' };
    }

    if (f.startsWith('Y')) {
      year = val;
    } else if (f.startsWith('M')) {
      month = val;
    } else if (f.startsWith('D')) {
      day = val;
    }
  }

  return validateBsDate({ year, month, day });
}

/**
 * Strictly validates a Bikram Sambat date against dynamic month day bounds.
 */
export function validateBsDate(date: { year: number; month: number; day: number }): ValidationResult {
  const { year, month, day } = date;

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return { isValid: false, error: 'मिति अपूर्ण वा अमान्य छ' };
  }

  if (year < 1970 || year > 2150) {
    return { isValid: false, error: `साल १९७० देखि २१५० सम्मको हुनुपर्छ (प्रविष्ट: ${year})` };
  }

  if (month < 1 || month > 12) {
    return { isValid: false, error: `महिना १ देखि १२ सम्मको हुनुपर्छ (प्रविष्ट: ${month})` };
  }

  let maxDays: number;
  try {
    maxDays = getDaysInBsMonth(year, month);
  } catch (err: any) {
    return { isValid: false, error: err.message };
  }

  if (day < 1 || day > maxDays) {
    return {
      isValid: false,
      error: `${year} साल ${month} महिनामा ${maxDays} दिन मात्र हुन्छन् (प्रविष्ट: ${day})`
    };
  }

  return {
    isValid: true,
    parsed: { year, month, day }
  };
}
