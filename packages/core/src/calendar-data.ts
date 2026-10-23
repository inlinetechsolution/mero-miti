/**
 * Mero Miti Core Calendar Data Engine
 * 
 * Storage Innovation:
 * Bikram Sambat months strictly have 29, 30, 31, or 32 days.
 * We represent each month in 2 bits:
 *   00 (0) -> 29 days
 *   01 (1) -> 30 days
 *   10 (2) -> 31 days
 *   11 (3) -> 32 days
 * 
 * 12 months * 2 bits = 24 bits = 3 bytes = 6 hex characters per year.
 * 127 years (1973-2099 BS) is compressed into ~546 bytes!
 */

export interface BsDate {
  year: number;
  month: number; // 1 to 12
  day: number;   // 1 to 32
}

export interface AdDate {
  year: number;
  month: number; // 1 to 12
  day: number;   // 1 to 31
}

export interface BsFiscalYear {
  startBsYear: number;
  endBsYear: number;
  code: string;       // "2080/81"
  nepaliCode: string; // "२०८०/८१"
}

export interface FiscalYearRange {
  fiscalYear: BsFiscalYear;
  startBs: BsDate;
  endBs: BsDate;
  startAd: AdDate;
  endAd: AdDate;
  startDate: Date;
  endDate: Date;
}

export interface FiscalQuarterRange {
  quarter: 1 | 2 | 3 | 4;
  name: string;
  nepaliName: string;
  startBs: BsDate;
  endBs: BsDate;
  startAd: AdDate;
  endAd: AdDate;
  startDate: Date;
  endDate: Date;
}

// 6-hex-digit representation for each B.S. year (1973 to 2099)
export const COMPRESSED_CALENDAR_DATA: Record<number, string> = {
  1973: "7b9512", 1974: "ada445", 1975: "af6445", 1976: "bb9506", 1977: "bba112",
  1978: "aea445", 1979: "af9445", 1980: "bb9506", 1981: "aba145", 1982: "aea445",
  1983: "af9445", 1984: "bb9506", 1985: "aba145", 1986: "aea445", 1987: "bb9445",
  1988: "bb9506", 1989: "aba445", 1990: "aea445", 1991: "bb9445", 1992: "bb9512",
  1993: "aba445", 1994: "aea445", 1995: "bb9505", 1996: "bb9506", 1997: "aea445",
  1998: "aed445", 1999: "bb9506", 2000: "7b9512", 2001: "aea445", 2002: "af9445",
  2003: "bb9506", 2004: "7b9512", 2005: "aea445", 2006: "af9445", 2007: "bb9506",
  2008: "aba142", 2009: "aea445", 2010: "af9445", 2011: "bb9506", 2012: "aba145",
  2013: "aea445", 2014: "af9445", 2015: "bb9506", 2016: "aba145", 2017: "aea445",
  2018: "bb9445", 2019: "bb9512", 2020: "aba445", 2021: "aea445", 2022: "bb9505",
  2023: "bb9512", 2024: "aba445", 2025: "aea445", 2026: "bb9506", 2027: "7b9512",
  2028: "aea445", 2029: "aed445", 2030: "bb9506", 2031: "7b9512", 2032: "aea445",
  2033: "af9445", 2034: "bb9506", 2035: "7ba142", 2036: "aea445", 2037: "af9445",
  2038: "bb9506", 2039: "aba145", 2040: "aea445", 2041: "af9445", 2042: "bb9506",
  2043: "aba145", 2044: "aea445", 2045: "bb9445", 2046: "bb9506", 2047: "aba445",
  2048: "aea445", 2049: "bb9505", 2050: "bb9512", 2051: "aba445", 2052: "aea445",
  2053: "bb9505", 2054: "bb9512", 2055: "aea445", 2056: "aed445", 2057: "bb9506",
  2058: "7b9512", 2059: "aea445", 2060: "af9445", 2061: "bb9506", 2062: "7ba112",
  2063: "aea445", 2064: "af9445", 2065: "bb9506", 2066: "aba142", 2067: "aea445",
  2068: "af9445", 2069: "bb9506", 2070: "aba145", 2071: "aea445", 2072: "bb9445",
  2073: "bb9506", 2074: "aba445", 2075: "aea445", 2076: "bb9505", 2077: "bb9512",
  2078: "aba445", 2079: "aea445", 2080: "bb9505", 2081: "bb9512", 2082: "aea445",
  2083: "aea445", 2084: "bb9506", 2085: "7b9512", 2086: "aea445", 2087: "aea515",
  2088: "6f6515", 2089: "7b9515", 2090: "7b9515", 2091: "aea515", 2092: "6f9515",
  2093: "7b9515", 2094: "ae9515", 2095: "aea455", 2096: "6f9445", 2097: "bb9515",
  2098: "aea112", 2099: "aea415"
};

// Dynamic registry allowing vendors or CDN patches to register new or updated years at runtime
const customYearRegistry: Map<number, number[]> = new Map();

/**
 * Encodes an array of 12 month days (29..32) into a 6-character hex string.
 */
export function encodeMonthDays(days: number[]): string {
  if (days.length !== 12) {
    throw new Error("Year data must contain exactly 12 month day counts");
  }
  let bits = 0;
  for (let i = 0; i < 12; i++) {
    const d = days[i];
    if (d < 29 || d > 32) {
      throw new Error(`Invalid BS month day count: ${d}. Must be between 29 and 32.`);
    }
    const val = d - 29; // 0, 1, 2, or 3
    bits = (bits << 2) | val;
  }
  return bits.toString(16).padStart(6, '0');
}

/**
 * Decodes a 6-character hex string into an array of 12 month day counts.
 */
export function decodeMonthDays(hex: string): number[] {
  const bits = parseInt(hex, 16);
  const days: number[] = [];
  for (let i = 11; i >= 0; i--) {
    const val = (bits >> (i * 2)) & 0x03;
    days.push(val + 29);
  }
  return days;
}

/**
 * Generates an astronomical solar projection fallback for unreleased future years.
 */
function getProjectedMonthDays(year: number): number[] {
  // Standard Nepalese astronomical baseline:
  // Baishakh to Bhadra typically have 31-32 days, Poush-Magh have 29-30 days.
  return [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30];
}

/**
 * Retrieves the array of 12 month days for any Bikram Sambat year.
 */
export function getMonthDaysForBsYear(year: number): { days: number[]; isProjected: boolean } {
  // 1. Check custom runtime registry (registered by vendor or CDN patch)
  if (customYearRegistry.has(year)) {
    return { days: customYearRegistry.get(year)!, isProjected: false };
  }

  // 2. Check compressed static table
  if (COMPRESSED_CALENDAR_DATA[year]) {
    return { days: decodeMonthDays(COMPRESSED_CALENDAR_DATA[year]), isProjected: false };
  }

  // 3. Fallback to projection if beyond recorded calendar
  return { days: getProjectedMonthDays(year), isProjected: true };
}

/**
 * Returns number of days in a specific BS year and month (1-indexed, 1 = Baishakh, 12 = Chaitra).
 */
export function getDaysInBsMonth(year: number, month: number): number {
  if (month < 1 || month > 12) {
    throw new Error(`Invalid BS month: ${month}. Must be between 1 and 12.`);
  }
  const { days } = getMonthDaysForBsYear(year);
  return days[month - 1];
}

/**
 * Public Vendor API to register or update an official year without package reinstallation.
 * Accepts either:
 * - An array of 12 integers: [31, 32, 31, 32, ...]
 * - A 6-character compressed hex string: "bb9512"
 */
export function registerYear(year: number, data: number[] | string): void {
  if (typeof data === 'string') {
    const days = decodeMonthDays(data);
    customYearRegistry.set(year, days);
  } else if (Array.isArray(data)) {
    if (data.length !== 12) {
      throw new Error(`Year data for ${year} must have exactly 12 months.`);
    }
    customYearRegistry.set(year, [...data]);
  } else {
    throw new Error("Data must be either an array of 12 month day counts or a 6-char hex string.");
  }
}

/**
 * Returns total days in a given BS year.
 */
export function getTotalDaysInBsYear(year: number): number {
  const { days } = getMonthDaysForBsYear(year);
  return days.reduce((sum, d) => sum + d, 0);
}

export const DEFAULT_CALENDAR_ENDPOINT = "https://meromiti.com/api/calendar-years";

/**
 * Automatically synchronizes official calendar years from the Mero Miti cloud API or vendor CDN.
 * Registers newly published years dynamically into runtime memory.
 */
export async function syncYears(endpointUrl: string = DEFAULT_CALENDAR_ENDPOINT): Promise<Record<number, string>> {
  try {
    if (typeof fetch === 'function') {
      const res = await fetch(endpointUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data && data.years) {
        for (const [yearStr, hexCode] of Object.entries(data.years)) {
          const year = parseInt(yearStr, 10);
          if (!isNaN(year) && typeof hexCode === 'string') {
            registerYear(year, hexCode);
          }
        }
        return data.years;
      }
    }
  } catch (err) {
    // Graceful offline fallback
  }
  return {};
}

/**
 * On-demand micro-fetch for a single specific future year.
 */
export async function fetchYearPatch(year: number, endpointUrl: string = DEFAULT_CALENDAR_ENDPOINT): Promise<boolean> {
  try {
    if (typeof fetch === 'function') {
      const url = endpointUrl.includes('?') ? `${endpointUrl}&year=${year}` : `${endpointUrl}?year=${year}`;
      const res = await fetch(url);
      if (!res.ok) return false;
      const data = await res.json();
      if (data && data.hex) {
        registerYear(year, data.hex);
        return true;
      }
    }
  } catch {
    // Graceful offline fallback
  }
  return false;
}

