/**
 * Mero Miti (मेरो मिति) - Universal Standalone Browser Bundle
 * Official Brand Icon Edition: Incorporates the authentic Mero Miti calendar brand mark.
 * 
 * Version: 1.3.0
 * License: MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.MeroMiti = factory());
})(this, (function () {
  'use strict';

  // --- 1. Ultra-Compressed Calendar Data (24-bit / 6 hex chars per year) ---
  var COMPRESSED_CALENDAR_DATA = {
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

  var customYearRegistry = new Map();

  function decodeMonthDays(hex) {
    var bits = parseInt(hex, 16);
    var days = [];
    for (var i = 11; i >= 0; i--) {
      var val = (bits >> (i * 2)) & 0x03;
      days.push(val + 29);
    }
    return days;
  }

  function getMonthDaysForBsYear(year) {
    if (customYearRegistry.has(year)) {
      return { days: customYearRegistry.get(year), isProjected: false };
    }
    if (COMPRESSED_CALENDAR_DATA[year]) {
      return { days: decodeMonthDays(COMPRESSED_CALENDAR_DATA[year]), isProjected: false };
    }
    return { days: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30], isProjected: true };
  }

  function getDaysInBsMonth(year, month) {
    var res = getMonthDaysForBsYear(year);
    return res.days[month - 1];
  }

  function getTotalDaysInBsYear(year) {
    var res = getMonthDaysForBsYear(year);
    return res.days.reduce(function (sum, d) { return sum + d; }, 0);
  }

  function registerYear(year, data) {
    if (typeof data === 'string') {
      customYearRegistry.set(year, decodeMonthDays(data));
    } else if (Array.isArray(data) && data.length === 12) {
      customYearRegistry.set(year, data.slice());
    }
  }

  // --- 2. Bilingual Localization & Names ---
  var NEPALI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  var NEPALI_MONTHS_NP = [
    "बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज",
    "कात्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"
  ];
  var NEPALI_MONTHS_EN = [
    "Baishakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
    "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
  ];
  var NEPALI_DAYS_SHORT_NP = ["आइत", "सोम", "मंगल", "बुध", "बिहि", "शुक्र", "शनि"];
  var NEPALI_DAYS_SHORT_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  var I18N = {
    ne: {
      badge: "वि.सं.",
      today: "आज",
      prevMonth: "अघिल्लो महिना",
      nextMonth: "पछिल्लो महिना",
      openCalendar: "पात्रो हेर्नुहोस्",
      invalidDate: "अमान्य मिति",
      switchBtn: "EN"
    },
    en: {
      badge: "B.S.",
      today: "Today",
      prevMonth: "Previous Month",
      nextMonth: "Next Month",
      openCalendar: "Open Calendar",
      invalidDate: "Invalid Date",
      switchBtn: "नेपाली"
    }
  };

  // Official Mero Miti Brand Calendar SVG Vector (Matching ic_calendar.xml)
  var MERO_MITI_ICON_HTML = '<svg viewBox="0 0 24 24" fill="currentColor">' +
    '<path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.89 4 3.01 4.9 3.01 6L3 20c0 1.1 0.89 2 2 2h14c1.1 0 2-0.9 2-2V6c0-1.1-0.9-2-2-2zm0 16H5V9h14v11zm-7-6.5c-1.1 0-2 0.9-2 2s0.9 2 2 2 2-0.9 2-2-0.9-2-2-2z"/>' +
    '</svg>';

  function toNepaliDigits(num) {
    if (num == null) return '';
    return num.toString().split('').map(function (ch) {
      var d = parseInt(ch, 10);
      return isNaN(d) ? ch : NEPALI_DIGITS[d];
    }).join('');
  }

  function toEnglishDigits(str) {
    if (!str) return '';
    return str.split('').map(function (ch) {
      var idx = NEPALI_DIGITS.indexOf(ch);
      return idx !== -1 ? idx.toString() : ch;
    }).join('');
  }

  // --- 3. Core Converter (AD <-> BS) ---
  var ANCHOR_BS_YEAR = 2080;
  var ANCHOR_AD_TIME = Date.UTC(2023, 3, 14); // 2023-04-14 UTC
  var MS_PER_DAY = 86400000;

  function adToBs(date) {
    var targetUtc = date instanceof Date
      ? Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      : Date.UTC(date.year, date.month - 1, date.day);

    var dayDiff = Math.round((targetUtc - ANCHOR_AD_TIME) / MS_PER_DAY);
    var currentYear = ANCHOR_BS_YEAR;
    var currentMonth = 1;
    var currentDay = 1;

    if (dayDiff >= 0) {
      while (true) {
        var daysInMonth = getDaysInBsMonth(currentYear, currentMonth);
        var rem = daysInMonth - currentDay;
        if (dayDiff <= rem) {
          currentDay += dayDiff;
          break;
        }
        dayDiff -= (rem + 1);
        currentDay = 1;
        currentMonth++;
        if (currentMonth > 12) {
          currentMonth = 1;
          currentYear++;
        }
      }
    } else {
      dayDiff = Math.abs(dayDiff);
      while (dayDiff > 0) {
        if (currentDay > 1) {
          var step = Math.min(dayDiff, currentDay - 1);
          currentDay -= step;
          dayDiff -= step;
        } else {
          currentMonth--;
          if (currentMonth < 1) {
            currentMonth = 12;
            currentYear--;
          }
          currentDay = getDaysInBsMonth(currentYear, currentMonth);
          dayDiff -= 1;
        }
      }
    }

    return { year: currentYear, month: currentMonth, day: currentDay };
  }

  function bsToAd(bsDate) {
    var dayDiff = 0;
    if (bsDate.year >= ANCHOR_BS_YEAR) {
      for (var y = ANCHOR_BS_YEAR; y < bsDate.year; y++) {
        dayDiff += getTotalDaysInBsYear(y);
      }
      for (var m = 1; m < bsDate.month; m++) {
        dayDiff += getDaysInBsMonth(bsDate.year, m);
      }
      dayDiff += (bsDate.day - 1);
    } else {
      for (var y = ANCHOR_BS_YEAR - 1; y > bsDate.year; y--) {
        dayDiff -= getTotalDaysInBsYear(y);
      }
      var daysInTargetYear = 0;
      for (var m = bsDate.month; m <= 12; m++) {
        var totalDays = getDaysInBsMonth(bsDate.year, m);
        daysInTargetYear += (m === bsDate.month ? (totalDays - bsDate.day + 1) : totalDays);
      }
      dayDiff -= daysInTargetYear;
    }

    var resDate = new Date(ANCHOR_AD_TIME + (dayDiff * MS_PER_DAY));
    return {
      year: resDate.getUTCFullYear(),
      month: resDate.getUTCMonth() + 1,
      day: resDate.getUTCDate()
    };
  }

  function bsToJsDate(bsDate) {
    var ad = bsToAd(bsDate);
    return new Date(ad.year, ad.month - 1, ad.day);
  }

  function getFiscalYear(date) {
    var bs;
    if (!date) {
      bs = adToBs(new Date());
    } else if (typeof date === 'object' && date.year && date.month && date.day) {
      if (date.year < 1973) {
        bs = adToBs(date);
      } else {
        bs = date;
      }
    } else if (date instanceof Date) {
      bs = adToBs(date);
    } else {
      bs = adToBs(new Date());
    }

    var startBsYear = bs.month >= 4 ? bs.year : bs.year - 1;
    var endBsYear = startBsYear + 1;
    var code = startBsYear + '/' + (endBsYear % 100).toString().padStart(2, '0');
    var nepaliCode = toNepaliDigits(code);

    return {
      startBsYear: startBsYear,
      endBsYear: endBsYear,
      code: code,
      nepaliCode: nepaliCode
    };
  }

  function getFiscalYearRange(yearOrCode) {
    var startYear;
    if (!yearOrCode) {
      startYear = getFiscalYear().startBsYear;
    } else if (typeof yearOrCode === 'number') {
      startYear = yearOrCode;
    } else if (typeof yearOrCode === 'string') {
      startYear = parseInt(yearOrCode.trim().split('/')[0], 10);
    } else if (typeof yearOrCode === 'object' && yearOrCode.startBsYear) {
      startYear = yearOrCode.startBsYear;
    } else {
      startYear = getFiscalYear().startBsYear;
    }

    var endYear = startYear + 1;
    var startBs = { year: startYear, month: 4, day: 1 };
    var lastDayAshadh = getDaysInBsMonth(endYear, 3);
    var endBs = { year: endYear, month: 3, day: lastDayAshadh };

    var startAd = bsToAd(startBs);
    var endAd = bsToAd(endBs);

    var fy = getFiscalYear(startBs);

    return {
      fiscalYear: fy,
      startBs: startBs,
      endBs: endBs,
      startAd: startAd,
      endAd: endAd,
      startDate: bsToJsDate(startBs),
      endDate: bsToJsDate(endBs)
    };
  }

  function getFiscalYearQuarters(yearOrCode) {
    var range = getFiscalYearRange(yearOrCode);
    var y1 = range.fiscalYear.startBsYear;
    var y2 = range.fiscalYear.endBsYear;

    var q1EndDay = getDaysInBsMonth(y1, 6);
    var q2EndDay = getDaysInBsMonth(y1, 9);
    var q3EndDay = getDaysInBsMonth(y1, 12);
    var q4EndDay = getDaysInBsMonth(y2, 3);

    var q1StartBs = { year: y1, month: 4, day: 1 };
    var q1EndBs = { year: y1, month: 6, day: q1EndDay };

    var q2StartBs = { year: y1, month: 7, day: 1 };
    var q2EndBs = { year: y1, month: 9, day: q2EndDay };

    var q3StartBs = { year: y1, month: 10, day: 1 };
    var q3EndBs = { year: y1, month: 12, day: q3EndDay };

    var q4StartBs = { year: y2, month: 1, day: 1 };
    var q4EndBs = { year: y2, month: 3, day: q4EndDay };

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

  // --- 4. Formatter & Validator ---
  function formatBsDate(date, options) {
    options = options || {};
    var format = options.format || 'DD/MM/YYYY';
    var locale = options.locale || 'ne';
    var numeral = options.numeral || (locale === 'ne' ? 'ne' : 'en');

    var dayStr = date.day.toString().padStart(2, '0');
    var monthStr = date.month.toString().padStart(2, '0');
    var yearStr = date.year.toString();
    var monthNames = locale === 'ne' ? NEPALI_MONTHS_NP : NEPALI_MONTHS_EN;

    var formatted = format
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

  function formatAdDate(date, separator) {
    separator = separator || '-';
    var y, m, d;
    if (date instanceof Date) {
      y = date.getFullYear();
      m = date.getMonth() + 1;
      d = date.getDate();
    } else {
      y = date.year;
      m = date.month;
      d = date.day;
    }
    return y + separator + m.toString().padStart(2, '0') + separator + d.toString().padStart(2, '0');
  }

  function validateBsDate(date, locale) {
    locale = locale || 'en';
    var year = date.year, month = date.month, day = date.day;
    var monthNames = locale === 'ne' ? NEPALI_MONTHS_NP : NEPALI_MONTHS_EN;
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return { isValid: false, error: locale === 'ne' ? 'मिति अपूर्ण छ' : 'Incomplete date' };
    }
    if (year < 1970 || year > 2150) {
      return { isValid: false, error: locale === 'ne' ? 'साल १९७० देखि २१५० हुनुपर्छ' : 'Year must be 1970 - 2150' };
    }
    if (month < 1 || month > 12) {
      return { isValid: false, error: locale === 'ne' ? 'महिना १ देखि १२ हुनुपर्छ' : 'Month must be 1 - 12' };
    }
    var maxDays = getDaysInBsMonth(year, month);
    if (day < 1 || day > maxDays) {
      return {
        isValid: false,
        error: locale === 'ne'
          ? (year + ' साल ' + monthNames[month - 1] + 'मा ' + maxDays + ' दिन मात्र छन्')
          : (monthNames[month - 1] + ' ' + year + ' has only ' + maxDays + ' days')
      };
    }
    return { isValid: true, parsed: { year: year, month: month, day: day } };
  }

  function parseBsDate(input, format, locale) {
    format = format || 'DD/MM/YYYY';
    if (!input) return { isValid: false, error: 'Date is required' };

    var normalized = toEnglishDigits(input.trim());
    var sepMatch = format.match(/[/.-]/);
    var separator = sepMatch ? sepMatch[0] : '/';

    var inputParts = normalized.split(separator);
    var formatParts = format.split(separator);

    if (inputParts.length !== 3 || formatParts.length !== 3) {
      return { isValid: false, error: 'Format must be ' + format };
    }

    var day = NaN, month = NaN, year = NaN;
    for (var i = 0; i < 3; i++) {
      var f = formatParts[i].toUpperCase();
      var val = parseInt(inputParts[i], 10);
      if (f.indexOf('Y') === 0) year = val;
      else if (f.indexOf('M') === 0) month = val;
      else if (f.indexOf('D') === 0) day = val;
    }

    return validateBsDate({ year: year, month: month, day: day }, locale);
  }

  // --- Official Mero Miti Brand Icon (day-31.webp) ---
  var MERO_MITI_ICON_DATA_URL = "data:image/webp;base64,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";
  var MERO_MITI_ICON_HTML = '<img class="mero-miti-trigger-img" src="' + MERO_MITI_ICON_DATA_URL + '" alt="पात्रो" />';

  // --- 5. Embedded Styles ---
  var STYLES = [
    ":root {",
    "  --mm-primary: #10b981; --mm-primary-hover: #059669; --mm-primary-light: #ecfdf5;",
    "  --mm-bg: #ffffff; --mm-card-bg: #ffffff; --mm-text: #1f2937; --mm-text-muted: #6b7280;",
    "  --mm-border: #d1d5db; --mm-border-focus: #10b981; --mm-radius: 6px;",
    "  --mm-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);",
    "  --mm-danger: #ef4444; --mm-font: inherit;",
    "}",
    "@media (prefers-color-scheme: dark) {",
    "  [data-mero-miti-theme='auto'], .mero-miti-dark {",
    "    --mm-bg: #1f2937; --mm-card-bg: #111827; --mm-text: #f9fafb;",
    "    --mm-text-muted: #9ca3af; --mm-border: #374151; --mm-primary-light: #064e3b;",
    "  }",
    "}",
    ".mero-miti-dark {",
    "  --mm-bg: #1f2937; --mm-card-bg: #111827; --mm-text: #f9fafb;",
    "  --mm-text-muted: #9ca3af; --mm-border: #374151; --mm-primary-light: #064e3b;",
    "}",
    ".mero-miti-companion-wrapper {",
    "  display: inline-flex; flex-direction: column; position: relative; font-family: var(--mm-font);",
    "  box-sizing: border-box; vertical-align: middle; margin-left: 8px; margin-top: 0; padding: 0; max-width: 100%;",
    "}",
    ".mero-miti-companion-wrapper.mm-block { display: flex; margin-left: 0; margin-top: 6px; width: 100%; }",
    ".mero-miti-companion-wrapper.mm-block .mero-miti-input-group { width: 100%; display: flex; }",
    ".mero-miti-label { font-size: 11px; font-weight: 600; color: var(--mm-text-muted); margin-bottom: 4px; display: flex; align-items: center; gap: 4px; }",
    ".mero-miti-input-group {",
    "  display: inline-flex; align-items: center; position: relative; background: var(--mm-bg);",
    "  border: 1px solid var(--mm-border); border-radius: var(--mm-radius); height: 38px;",
    "  box-sizing: border-box; vertical-align: middle; transition: border-color 0.15s ease, box-shadow 0.15s ease;",
    "  width: 100%; max-width: 100%; cursor: text;",
    "}",
    ".mero-miti-companion-wrapper:not(.mm-block) .mero-miti-input-group { width: auto; }",
    ".mero-miti-input-group:focus-within { border-color: var(--mm-border-focus); box-shadow: 0 0 0 3px rgba(16,185,129,0.15); }",
    ".mero-miti-input-group.mm-invalid { border-color: var(--mm-danger) !important; animation: mm-shake 0.3s ease-in-out; }",
    "@keyframes mm-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }",
    ".mero-miti-inline-badge {",
    "  font-size: 10px; font-weight: 700; padding: 2px 5px; margin-left: 6px; margin-right: 2px;",
    "  border-radius: 4px; background: var(--mm-primary-light); color: var(--mm-primary);",
    "  user-select: none; letter-spacing: 0.5px; white-space: nowrap; flex-shrink: 0;",
    "}",
    ".mero-miti-input { border: none; background: transparent; padding: 6px 8px; font-size: 14px; color: var(--mm-text); outline: none; flex: 1 1 auto; width: 100%; min-width: 80px; height: 100%; font-family: inherit; box-sizing: border-box; }",
    ".mero-miti-companion-wrapper:not(.mm-block) .mero-miti-input { width: 110px; flex: 0 0 auto; }",
    ".mero-miti-icon-btn { background: transparent; border: none; cursor: pointer; padding: 4px 6px; display: flex; align-items: center; justify-content: center; color: var(--mm-text-muted); line-height: 1; border-radius: 4px; flex-shrink: 0; transition: opacity 0.15s, transform 0.1s; }",
    ".mero-miti-icon-btn:hover { opacity: 0.8; transform: scale(1.05); }",
    ".mero-miti-trigger-img { width: 22px; height: 22px; object-fit: contain; display: block; border-radius: 4px; }",
    ".mero-miti-brand-mark { width: 16px; height: 16px; object-fit: contain; display: inline-block; vertical-align: middle; border-radius: 3px; margin-right: 4px; }",
    ".mero-miti-popover { position: absolute; z-index: 99999; background: var(--mm-card-bg); border: 1px solid var(--mm-border); border-radius: var(--mm-radius); box-shadow: var(--mm-shadow); width: 290px; max-width: calc(100vw - 20px); padding: 12px; box-sizing: border-box; font-family: var(--mm-font); color: var(--mm-text); user-select: none; }",
    ".mero-miti-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }",
    ".mero-miti-selects { display: flex; gap: 4px; }",
    ".mero-miti-select { background: var(--mm-bg); color: var(--mm-text); border: 1px solid var(--mm-border); border-radius: 4px; padding: 2px 4px; font-size: 13px; outline: none; cursor: pointer; }",
    ".mero-miti-nav-btn { background: transparent; border: none; cursor: pointer; color: var(--mm-text-muted); border-radius: 4px; padding: 4px; }",
    ".mero-miti-nav-btn:hover { background: var(--mm-primary-light); color: var(--mm-primary); }",
    ".mero-miti-lang-btn { background: var(--mm-primary-light); color: var(--mm-primary); border: 1px solid var(--mm-primary); font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; cursor: pointer; margin-left: 2px; }",
    ".mero-miti-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 11px; font-weight: 600; color: var(--mm-text-muted); margin-bottom: 6px; }",
    ".mero-miti-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }",
    ".mero-miti-day { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 13px; border-radius: 6px; cursor: pointer; color: var(--mm-text); }",
    ".mero-miti-day:hover:not(.mm-empty) { background: var(--mm-primary-light); color: var(--mm-primary); }",
    ".mero-miti-day.mm-selected { background: var(--mm-primary) !important; color: #ffffff !important; font-weight: 700; }",
    ".mero-miti-day.mm-today { border: 1px solid var(--mm-primary); font-weight: 600; }",
    ".mero-miti-day.mm-saturday { color: var(--mm-danger); }",
    ".mero-miti-footer { margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--mm-border); display: flex; align-items: center; justify-content: space-between; font-size: 11px; }",
    ".mero-miti-today-btn { background: transparent; border: 1px solid var(--mm-primary); color: var(--mm-primary); padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 600; }",
    ".mero-miti-today-btn:hover { background: var(--mm-primary); color: #fff; }",
    ".mero-miti-brand { color: var(--mm-text-muted); text-decoration: none; font-weight: 600; font-size: 11px; display: inline-flex; align-items: center; gap: 4px; }",
    ".mero-miti-brand-mark { width: 14px; height: 14px; display: inline-block; color: var(--mm-primary); vertical-align: middle; }",
    ".mero-miti-tooltip { position: absolute; bottom: -20px; left: 0; font-size: 11px; color: var(--mm-danger); white-space: nowrap; pointer-events: none; }"
  ].join("\n");

  var stylesInjected = false;
  function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    var el = document.createElement('style');
    el.setAttribute('data-mero-miti-styles', 'true');
    el.textContent = STYLES;
    document.head.appendChild(el);
    stylesInjected = true;
  }

  // --- 6. Bilingual Popover Component ---
  function CalendarPopover(triggerEl, initialDate, callbacks, locale) {
    this.triggerElement = triggerEl;
    this.callbacks = callbacks;
    this.selectedDate = initialDate;
    this.locale = locale || 'ne';

    var todayBs = adToBs(new Date());
    this.currentYear = initialDate ? initialDate.year : todayBs.year;
    this.currentMonth = initialDate ? initialDate.month : todayBs.month;

    this.element = document.createElement('div');
    this.element.className = 'mero-miti-popover';
    this.element.setAttribute('data-mero-miti-popover', 'true');
    this.element.setAttribute('data-mero-miti-ignore', 'true');

    var self = this;
    this.clickOutsideHandler = function (e) {
      if (!self.element.contains(e.target) && !self.triggerElement.contains(e.target)) {
        self.destroy();
      }
    };

    this.render();
    this.position();
    document.body.appendChild(this.element);

    setTimeout(function () {
      document.addEventListener('mousedown', self.clickOutsideHandler);
    }, 10);
  }

  CalendarPopover.prototype.position = function () {
    var rect = this.triggerElement.getBoundingClientRect();
    var popoverHeight = 285;
    var top = rect.bottom + window.scrollY + 4;
    if (rect.bottom + popoverHeight > window.innerHeight && rect.top > popoverHeight) {
      top = rect.top + window.scrollY - popoverHeight - 4;
    }
    var left = rect.left + window.scrollX;
    if (left + 290 > window.innerWidth) left = window.innerWidth - 300;
    this.element.style.top = Math.max(10, top) + 'px';
    this.element.style.left = Math.max(10, left) + 'px';
  };

  CalendarPopover.prototype.render = function () {
    var todayBs = adToBs(new Date());
    var daysInMonth = getDaysInBsMonth(this.currentYear, this.currentMonth);
    var firstDayAd = bsToJsDate({ year: this.currentYear, month: this.currentMonth, day: 1 });
    var startWeekday = firstDayAd.getDay();

    var isNe = this.locale === 'ne';
    var monthNames = isNe ? NEPALI_MONTHS_NP : NEPALI_MONTHS_EN;
    var weekdayNames = isNe ? NEPALI_DAYS_SHORT_NP : NEPALI_DAYS_SHORT_EN;
    var i18n = I18N[this.locale];

    var yearOpts = '';
    for (var y = 2000; y <= 2090; y++) {
      var yStr = isNe ? (toNepaliDigits(y) + ' (' + y + ')') : y.toString();
      yearOpts += '<option value="' + y + '" ' + (y === this.currentYear ? 'selected' : '') + '>' + yStr + '</option>';
    }

    var monthOpts = '';
    for (var m = 1; m <= 12; m++) {
      monthOpts += '<option value="' + m + '" ' + (m === this.currentMonth ? 'selected' : '') + '>' + monthNames[m - 1] + '</option>';
    }

    var html = '<div class="mero-miti-header">' +
      '<button class="mero-miti-nav-btn" data-action="prev" title="' + i18n.prevMonth + '">◀</button>' +
      '<div class="mero-miti-selects">' +
      '<select class="mero-miti-select" data-select="month">' + monthOpts + '</select>' +
      '<select class="mero-miti-select" data-select="year">' + yearOpts + '</select>' +
      '</div>' +
      '<button class="mero-miti-nav-btn" data-action="next" title="' + i18n.nextMonth + '">▶</button>' +
      '<button class="mero-miti-lang-btn" data-action="toggle-lang" title="Switch Language">' + (isNe ? 'EN' : 'ने') + '</button>' +
      '</div>' +
      '<div class="mero-miti-weekdays">' +
      weekdayNames.map(function (d, i) { return '<span class="' + (i === 6 ? 'mm-saturday' : '') + '">' + d + '</span>'; }).join('') +
      '</div>' +
      '<div class="mero-miti-days">';

    for (var i = 0; i < startWeekday; i++) {
      html += '<div class="mero-miti-day mm-empty"></div>';
    }

    for (var day = 1; day <= daysInMonth; day++) {
      var weekday = (startWeekday + day - 1) % 7;
      var isSat = weekday === 6;
      var isSel = this.selectedDate && this.selectedDate.year === this.currentYear && this.selectedDate.month === this.currentMonth && this.selectedDate.day === day;
      var isTod = todayBs.year === this.currentYear && todayBs.month === this.currentMonth && todayBs.day === day;

      var cls = ['mero-miti-day', isSat ? 'mm-saturday' : '', isSel ? 'mm-selected' : '', isTod ? 'mm-today' : ''].filter(Boolean).join(' ');
      var dayLabel = isNe ? toNepaliDigits(day) : day;
      html += '<div class="' + cls + '" data-day="' + day + '">' + dayLabel + '</div>';
    }

    var todayDayLabel = isNe ? toNepaliDigits(todayBs.day) : todayBs.day;
    var todayMonthLabel = monthNames[todayBs.month - 1];

    var brandMark = '<img class="mero-miti-brand-mark" src="' + MERO_MITI_ICON_DATA_URL + '" alt="Mero Miti" />';
    var brandSvg = brandMark;

    html += '</div>' +
      '<div class="mero-miti-footer">' +
      '<button class="mero-miti-today-btn" data-action="today">' + i18n.today + ' (' + todayDayLabel + ' ' + todayMonthLabel + ')</button>' +
      '<span class="mero-miti-brand">' + brandSvg + ' ' + (isNe ? 'मेरो मिति' : 'Mero Miti') + '</span>' +
      '</div>';

    this.element.innerHTML = html;
    this.bind();
  };

  CalendarPopover.prototype.bind = function () {
    var self = this;
    this.element.querySelector('[data-action="prev"]').onclick = function () {
      self.currentMonth--;
      if (self.currentMonth < 1) { self.currentMonth = 12; self.currentYear--; }
      self.render();
    };
    this.element.querySelector('[data-action="next"]').onclick = function () {
      self.currentMonth++;
      if (self.currentMonth > 12) { self.currentMonth = 1; self.currentYear++; }
      self.render();
    };
    this.element.querySelector('[data-select="month"]').onchange = function (e) {
      self.currentMonth = parseInt(e.target.value, 10);
      self.render();
    };
    this.element.querySelector('[data-select="year"]').onchange = function (e) {
      self.currentYear = parseInt(e.target.value, 10);
      self.render();
    };
    this.element.querySelector('[data-action="toggle-lang"]').onclick = function () {
      self.locale = self.locale === 'ne' ? 'en' : 'ne';
      if (self.callbacks.onLocaleChange) {
        self.callbacks.onLocaleChange(self.locale);
      }
      self.render();
    };
    this.element.querySelector('[data-action="today"]').onclick = function () {
      var today = adToBs(new Date());
      self.callbacks.onSelect(today);
      self.destroy();
    };
    var dayNodes = this.element.querySelectorAll('.mero-miti-day:not(.mm-empty)');
    for (var i = 0; i < dayNodes.length; i++) {
      dayNodes[i].onclick = function () {
        var d = parseInt(this.getAttribute('data-day'), 10);
        self.callbacks.onSelect({ year: self.currentYear, month: self.currentMonth, day: d });
        self.destroy();
      };
    }
  };

  CalendarPopover.prototype.destroy = function () {
    document.removeEventListener('mousedown', this.clickOutsideHandler);
    if (this.element.parentNode) this.element.parentNode.removeChild(this.element);
    if (this.callbacks.onClose) this.callbacks.onClose();
  };

  // --- 7. Companion Bridge Engine ---
  function MeroMitiCompanionBridge(targetInput, options) {
    this.targetInput = targetInput;

    // 1. Extract per-input data-* attribute overrides
    var elAttrs = {};
    if (targetInput && targetInput.getAttribute) {
      if (targetInput.getAttribute('data-mero-miti-locale')) elAttrs.locale = targetInput.getAttribute('data-mero-miti-locale');
      if (targetInput.getAttribute('data-mero-miti-format')) elAttrs.format = targetInput.getAttribute('data-mero-miti-format');
      if (targetInput.getAttribute('data-mero-miti-position')) elAttrs.position = targetInput.getAttribute('data-mero-miti-position');
      if (targetInput.getAttribute('data-mero-miti-numeral')) elAttrs.numeral = targetInput.getAttribute('data-mero-miti-numeral');
      if (targetInput.getAttribute('data-mero-miti-theme')) elAttrs.theme = targetInput.getAttribute('data-mero-miti-theme');
      if (targetInput.getAttribute('data-mero-miti-placeholder')) elAttrs.placeholder = targetInput.getAttribute('data-mero-miti-placeholder');
      if (targetInput.getAttribute('data-mero-miti-label')) elAttrs.label = targetInput.getAttribute('data-mero-miti-label');
      if (targetInput.getAttribute('data-mero-miti-name')) elAttrs.name = targetInput.getAttribute('data-mero-miti-name');
    }

    var merged = Object.assign({}, options || {}, elAttrs);
    var locale = merged.locale || 'ne';

    // If target has a specific format placeholder (e.g. YYYY-MM-DD or DD-MM-YYYY), companion can match format if not explicitly given
    var defaultFormat = 'DD/MM/YYYY';
    if (!elAttrs.format && !(options && options.format) && targetInput && targetInput.placeholder) {
      var ph = targetInput.placeholder.toUpperCase();
      if (ph.indexOf('YYYY-MM-DD') !== -1) defaultFormat = 'YYYY-MM-DD';
      else if (ph.indexOf('YYYY/MM/DD') !== -1) defaultFormat = 'YYYY/MM/DD';
      else if (ph.indexOf('DD-MM-YYYY') !== -1) defaultFormat = 'DD-MM-YYYY';
      else if (ph.indexOf('DD/MM/YYYY') !== -1) defaultFormat = 'DD/MM/YYYY';
    }

    var defaultPlaceholder = elAttrs.placeholder || (options && options.placeholder) || defaultFormat;

    this.options = Object.assign({
      format: defaultFormat,
      position: 'right',
      placeholder: defaultPlaceholder,
      label: null,
      locale: locale,
      showBadge: true,
      theme: 'auto',
      numeral: merged.numeral || (locale === 'ne' ? 'ne' : 'en')
    }, merged);

    injectStyles();
    this.currentBsDate = null;
    this.popover = null;
    this.isUpdating = false;

    this.createDom();
    this.mount();
    this.matchTargetStyles();
    this.bind();
    this.initialSync();
  }

  MeroMitiCompanionBridge.prototype.isTargetBlock = function () {
    if (typeof window === 'undefined') return false;
    var computed = window.getComputedStyle(this.targetInput);
    if (!computed) return false;
    if (computed.display === 'block') return true;
    if (computed.width === '100%') return true;
    var parent = this.targetInput.parentElement;
    if (parent) {
      var parentWidth = parent.getBoundingClientRect().width;
      var inputWidth = this.targetInput.getBoundingClientRect().width;
      if (parentWidth > 0 && inputWidth > 0 && (inputWidth / parentWidth) >= 0.82) {
        return true;
      }
    }
    return false;
  };

  MeroMitiCompanionBridge.prototype.createDom = function () {
    var isBlock = this.options.position === 'bottom' || this.isTargetBlock();
    var wrapper = document.createElement('div');
    wrapper.className = 'mero-miti-companion-wrapper ' + (isBlock ? 'mm-block' : '');
    wrapper.setAttribute('data-mero-miti-wrapper', 'true');
    wrapper.setAttribute('data-mero-miti-ignore', 'true');
    if (this.options.theme === 'dark') wrapper.classList.add('mero-miti-dark');

    var badgeText = this.options.locale === 'ne' ? 'वि.सं.' : 'B.S.';
    var labelHtml = this.options.label
      ? '<label class="mero-miti-label"><span class="mero-miti-label-text">' + this.options.label + '</span></label>'
      : '';

    var inlineBadgeHtml = this.options.showBadge
      ? '<span class="mero-miti-inline-badge">' + badgeText + '</span>'
      : '';

    // Auto-derive form companion name (e.g. dob -> dob_bs)
    var companionName = this.options.name || (this.targetInput.name ? this.targetInput.name + '_bs' : '');
    var nameAttr = companionName ? ' name="' + companionName + '"' : '';

    // Inherit disabled and readonly states
    var disabledAttr = this.targetInput.disabled ? ' disabled' : '';
    var readOnlyAttr = this.targetInput.readOnly ? ' readonly' : '';

    // Uses the official Mero Miti brand icon path
    wrapper.innerHTML = labelHtml +
      '<div class="mero-miti-input-group">' +
      inlineBadgeHtml +
      '<input type="text"' + nameAttr + disabledAttr + readOnlyAttr + ' class="mero-miti-input" data-mero-miti="none" data-mero-miti-companion="true" data-mero-miti-ignore="true" data-mero-miti-attached="true" placeholder="' + this.options.placeholder + '" maxlength="10" autocomplete="off" spellcheck="false" />' +
      '<button type="button" class="mero-miti-icon-btn" title="पात्रो हेर्नुहोस्"' + disabledAttr + '>' + MERO_MITI_ICON_HTML + '</button>' +
      '<div class="mero-miti-tooltip"></div>' +
      '</div>';

    this.container = wrapper;
    this.nepaliInput = wrapper.querySelector('.mero-miti-input');
    this.iconBtn = wrapper.querySelector('.mero-miti-icon-btn');
    this.groupEl = wrapper.querySelector('.mero-miti-input-group');
    this.tooltipEl = wrapper.querySelector('.mero-miti-tooltip');
    this.badgeEl = wrapper.querySelector('.mero-miti-inline-badge');
  };

  MeroMitiCompanionBridge.prototype.mount = function () {
    this.targetInput.style.verticalAlign = 'middle';
    var isBlock = this.options.position === 'bottom' || this.isTargetBlock();
    if (isBlock && !this.container.classList.contains('mm-block')) {
      this.container.classList.add('mm-block');
    }

    if (this.options.position === 'bottom' || isBlock) {
      if (this.targetInput.nextSibling) {
        this.targetInput.parentNode.insertBefore(this.container, this.targetInput.nextSibling);
      } else {
        this.targetInput.parentNode.appendChild(this.container);
      }
    } else {
      this.targetInput.insertAdjacentElement('afterend', this.container);
    }
  };

  MeroMitiCompanionBridge.prototype.matchTargetStyles = function () {
    if (typeof window === 'undefined') return;
    var computed = window.getComputedStyle(this.targetInput);
    if (!computed) return;

    if (computed.height && computed.height !== 'auto' && computed.height !== '0px') {
      this.groupEl.style.height = computed.height;
    }
    if (computed.borderRadius) {
      this.groupEl.style.borderRadius = computed.borderRadius;
    }
    if (computed.borderColor && computed.borderStyle !== 'none') {
      this.groupEl.style.borderColor = computed.borderColor;
    }
    if (computed.fontFamily) {
      this.nepaliInput.style.fontFamily = computed.fontFamily;
      this.groupEl.style.fontFamily = computed.fontFamily;
    }
    if (computed.fontSize) {
      this.nepaliInput.style.fontSize = computed.fontSize;
    }
    if (computed.fontWeight) {
      this.nepaliInput.style.fontWeight = computed.fontWeight;
    }
    if (computed.color && computed.color !== 'rgba(0, 0, 0, 0)' && computed.color !== 'transparent') {
      this.nepaliInput.style.color = computed.color;
    }
    if (computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)' && computed.backgroundColor !== 'transparent') {
      this.groupEl.style.backgroundColor = computed.backgroundColor;
    }
  };

  MeroMitiCompanionBridge.prototype.bind = function () {
    var self = this;
    var format = this.options.format;
    var sepMatch = format.match(/[/.-]/);
    var separator = sepMatch ? sepMatch[0] : '/';

    // 0. Click group focuses input & re-matches styles
    this.groupEl.addEventListener('click', function (e) {
      if (e.target !== self.iconBtn && !self.iconBtn.contains(e.target)) {
        self.nepaliInput.focus();
      }
    });

    this.nepaliInput.addEventListener('focus', function () {
      self.matchTargetStyles();
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', function () {
        var isBlock = self.options.position === 'bottom' || self.isTargetBlock();
        if (isBlock) {
          self.container.classList.add('mm-block');
        } else if (self.options.position !== 'bottom') {
          self.container.classList.remove('mm-block');
        }
      });
    }

    // 1. Live Typing & Masking
    this.nepaliInput.addEventListener('input', function () {
      var val = self.nepaliInput.value;
      if (!val) {
        self.groupEl.classList.remove('mm-invalid');
        self.tooltipEl.textContent = '';
        self.currentBsDate = null;
        self.clearGregorian();
        return;
      }

      var raw = val.replace(/[^0-9०-९]/g, '');
      var masked = '';
      if (format.indexOf('YYYY') === 0) {
        if (raw.length > 0) masked += raw.slice(0, 4);
        if (raw.length > 4) masked += separator + raw.slice(4, 6);
        if (raw.length > 6) masked += separator + raw.slice(6, 8);
      } else {
        if (raw.length > 0) masked += raw.slice(0, 2);
        if (raw.length > 2) masked += separator + raw.slice(2, 4);
        if (raw.length > 4) masked += separator + raw.slice(4, 8);
      }

      if (self.nepaliInput.value !== masked) {
        self.nepaliInput.value = masked;
      }

      if (masked.length >= 10) {
        var res = parseBsDate(masked, format, self.options.locale);
        if (res.isValid && res.parsed) {
          self.groupEl.classList.remove('mm-invalid');
          self.tooltipEl.textContent = '';
          self.currentBsDate = res.parsed;
          self.syncToGregorian(res.parsed);
        } else {
          self.groupEl.classList.add('mm-invalid');
          self.tooltipEl.textContent = res.error || 'अमान्य मिति';
        }
      } else {
        self.groupEl.classList.remove('mm-invalid');
        self.tooltipEl.textContent = '';
      }
    });

    // 2. Icon Toggle Popover
    this.iconBtn.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (self.popover) {
        self.popover.destroy();
        self.popover = null;
      } else {
        self.popover = new CalendarPopover(self.container, self.currentBsDate, {
          onSelect: function (date) {
            self.currentBsDate = date;
            self.nepaliInput.value = formatBsDate(date, {
              format: self.options.format,
              numeral: self.options.numeral,
              locale: self.options.locale
            });
            self.groupEl.classList.remove('mm-invalid');
            self.tooltipEl.textContent = '';
            self.syncToGregorian(date);
            self.popover = null;
          },
          onLocaleChange: function (newLocale) {
            self.options.locale = newLocale;
            self.options.numeral = newLocale === 'ne' ? 'ne' : 'en';
            if (self.badgeEl) {
              self.badgeEl.textContent = newLocale === 'ne' ? 'वि.सं.' : 'B.S.';
            }
            if (self.currentBsDate) {
              self.nepaliInput.value = formatBsDate(self.currentBsDate, {
                format: self.options.format,
                numeral: self.options.numeral,
                locale: newLocale
              });
            }
          },
          onClose: function () { self.popover = null; }
        }, self.options.locale);
      }
    };

    // 3. Sync from Gregorian input
    var onGregorianChange = function () {
      if (self.isUpdating) return;
      self.syncFromGregorian();
    };
    this.targetInput.addEventListener('input', onGregorianChange);
    this.targetInput.addEventListener('change', onGregorianChange);

    // 4. Mirror dynamic disabled / readonly attribute changes
    if (typeof MutationObserver !== 'undefined') {
      var attrObs = new MutationObserver(function () {
        self.nepaliInput.disabled = self.targetInput.disabled;
        self.nepaliInput.readOnly = self.targetInput.readOnly;
        self.iconBtn.disabled = self.targetInput.disabled || self.targetInput.readOnly;
      });
      attrObs.observe(this.targetInput, { attributes: true, attributeFilter: ['disabled', 'readonly'] });
      this._attrObs = attrObs;
    }

    // 5. Native HTML Form Reset synchronization
    if (this.targetInput.form) {
      this._onFormReset = function () {
        setTimeout(function () {
          self.syncFromGregorian();
        }, 10);
      };
      this.targetInput.form.addEventListener('reset', this._onFormReset);
    }
  };

  MeroMitiCompanionBridge.prototype.destroy = function () {
    if (this._attrObs) this._attrObs.disconnect();
    if (this.targetInput.form && this._onFormReset) {
      this.targetInput.form.removeEventListener('reset', this._onFormReset);
    }
    if (this.popover) this.popover.destroy();
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  };

  MeroMitiCompanionBridge.prototype.syncFromGregorian = function () {
    var val = this.targetInput.value;
    if (!val) {
      this.nepaliInput.value = '';
      this.currentBsDate = null;
      return;
    }
    var targetFormat = (this.targetInput.getAttribute('format') ||
      (this.targetInput.closest && this.targetInput.closest('[format]') && this.targetInput.closest('[format]').getAttribute('format')) || '').toUpperCase();

    if (!targetFormat && this.targetInput.placeholder) {
      var phUpper = this.targetInput.placeholder.toUpperCase();
      if (phUpper.indexOf('DD/MM') !== -1 || phUpper.indexOf('DD-MM') !== -1 || phUpper.indexOf('DD.MM') !== -1) {
        targetFormat = 'DD/MM/YYYY';
      } else if (phUpper.indexOf('MM/DD') !== -1 || phUpper.indexOf('MM-DD') !== -1 || phUpper.indexOf('MM.DD') !== -1) {
        targetFormat = 'MM/DD/YYYY';
      } else if (phUpper.indexOf('YYYY') === 0) {
        targetFormat = 'YYYY-MM-DD';
      }
    }

    var y = NaN, m = NaN, d = NaN;
    if (this.targetInput.type === 'date' && this.targetInput.valueAsDate instanceof Date && !isNaN(this.targetInput.valueAsDate.getTime())) {
      var vad = this.targetInput.valueAsDate;
      y = vad.getUTCFullYear();
      m = vad.getUTCMonth() + 1;
      d = vad.getUTCDate();
    } else {
      var parts = val.split(/[-/.]/).map(Number);
      if (parts.length === 3) {
        if (parts[0] > 1000) {
          // YYYY-MM-DD or YYYY/MM/DD
          y = parts[0]; m = parts[1]; d = parts[2];
        } else if (parts[2] > 1000) {
          if (targetFormat && targetFormat.indexOf('MM') === 0) {
            m = parts[0]; d = parts[1]; y = parts[2];
          } else if (targetFormat && targetFormat.indexOf('DD') === 0) {
            d = parts[0]; m = parts[1]; y = parts[2];
          } else if (parts[1] > 12) {
            m = parts[0]; d = parts[1]; y = parts[2];
          } else {
            d = parts[0]; m = parts[1]; y = parts[2];
          }
        }
      }
    }
    if (!isNaN(y) && !isNaN(m) && !isNaN(d) && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      try {
        var bs = adToBs(new Date(y, m - 1, d));
        this.currentBsDate = bs;
        this.nepaliInput.value = formatBsDate(bs, {
          format: this.options.format,
          numeral: this.options.numeral,
          locale: this.options.locale
        });
        this.groupEl.classList.remove('mm-invalid');
        this.tooltipEl.textContent = '';
      } catch (e) {}
    }
  };

  MeroMitiCompanionBridge.prototype.syncToGregorian = function (bsDate) {
    if (this.isUpdating) return;
    this.isUpdating = true;
    try {
      var ad = bsToAd(bsDate);
      var adStr;
      var targetFormat = (this.targetInput.getAttribute('format') ||
        (this.targetInput.closest && this.targetInput.closest('[format]') && this.targetInput.closest('[format]').getAttribute('format')) || '').toUpperCase();

      if (!targetFormat && this.targetInput.placeholder) {
        var phUpperSync = this.targetInput.placeholder.toUpperCase();
        if (phUpperSync.indexOf('DD/MM/YYYY') !== -1 || phUpperSync.indexOf('DD-MM-YYYY') !== -1 || phUpperSync.indexOf('DD.MM.YYYY') !== -1) {
          targetFormat = phUpperSync.indexOf('/') !== -1 ? 'DD/MM/YYYY' : (phUpperSync.indexOf('.') !== -1 ? 'DD.MM.YYYY' : 'DD-MM-YYYY');
        } else if (phUpperSync.indexOf('MM/DD/YYYY') !== -1 || phUpperSync.indexOf('MM-DD-YYYY') !== -1 || phUpperSync.indexOf('MM.DD.YYYY') !== -1) {
          targetFormat = phUpperSync.indexOf('/') !== -1 ? 'MM/DD/YYYY' : (phUpperSync.indexOf('.') !== -1 ? 'MM.DD.YYYY' : 'MM-DD-YYYY');
        } else if (phUpperSync.indexOf('YYYY/MM/DD') !== -1 || phUpperSync.indexOf('YYYY-MM-DD') !== -1 || phUpperSync.indexOf('YYYY.MM.DD') !== -1) {
          targetFormat = phUpperSync.indexOf('/') !== -1 ? 'YYYY/MM/DD' : (phUpperSync.indexOf('.') !== -1 ? 'YYYY.MM.DD' : 'YYYY-MM-DD');
        }
      }

      if (this.targetInput.type === 'date') {
        adStr = formatAdDate(ad, '-');
      } else if (targetFormat) {
        var sep = targetFormat.indexOf('/') !== -1 ? '/' : (targetFormat.indexOf('.') !== -1 ? '.' : '-');
        var dStr = ad.day.toString().padStart(2, '0');
        var mStr = ad.month.toString().padStart(2, '0');
        var yStr = ad.year.toString();
        if (targetFormat.indexOf('DD') === 0) {
          adStr = dStr + sep + mStr + sep + yStr;
        } else if (targetFormat.indexOf('MM') === 0) {
          adStr = mStr + sep + dStr + sep + yStr;
        } else {
          adStr = yStr + sep + mStr + sep + dStr;
        }
      } else {
        adStr = formatAdDate(ad, '-');
      }

      var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
      if (setter && setter.set) {
        setter.set.call(this.targetInput, adStr);
      } else {
        this.targetInput.value = adStr;
      }
      this.targetInput.dispatchEvent(new Event('input', { bubbles: true }));
      this.targetInput.dispatchEvent(new Event('change', { bubbles: true }));
    } finally {
      this.isUpdating = false;
    }
  };

  MeroMitiCompanionBridge.prototype.clearGregorian = function () {
    if (this.isUpdating) return;
    this.isUpdating = true;
    try {
      var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
      if (setter && setter.set) {
        setter.set.call(this.targetInput, '');
      } else {
        this.targetInput.value = '';
      }
      this.targetInput.dispatchEvent(new Event('input', { bubbles: true }));
      this.targetInput.dispatchEvent(new Event('change', { bubbles: true }));
    } finally {
      this.isUpdating = false;
    }
  };

  MeroMitiCompanionBridge.prototype.initialSync = function () {
    if (this.targetInput.value) {
      this.syncFromGregorian();
    }
  };

  // --- 8. Top-level MeroMiti Object ---
  var instances = new Map();

  var DEFAULT_AUTO_SELECTOR = [
    'input[type="date"]',
    'input[data-mero-miti="auto"]',
    '[format*="YYYY"] input',
    '[format*="DD"] input',
    '[format*="MM"] input',
    'input[type="text"][placeholder*="YYYY"]',
    'input[type="text"][placeholder*="yyyy"]',
    'input[type="text"][placeholder*="DD"]',
    'input[type="text"][placeholder*="dd"]',
    'input[type="text"][placeholder*="MM"]',
    'input[type="text"][placeholder*="mm"]',
    'input[type="text"][placeholder*="Date"]',
    'input[type="text"][placeholder*="date"]',
    'input[type="text"][placeholder*="DATE"]',
    'input[type="text"][placeholder*="मिति"]',
    'input:not([type])[placeholder*="YYYY"]',
    'input:not([type])[placeholder*="yyyy"]',
    'input:not([type])[placeholder*="DD"]',
    'input:not([type])[placeholder*="dd"]',
    'input:not([type])[placeholder*="MM"]',
    'input:not([type])[placeholder*="mm"]',
    'input:not([type])[placeholder*="Date"]',
    'input:not([type])[placeholder*="date"]',
    'input:not([type])[placeholder*="DATE"]',
    'input:not([type])[placeholder*="मिति"]'
  ].join(', ');

  function isDateField(el) {
    if (!el || el.tagName !== 'INPUT') return false;

    // Reject Mero Miti internal companion or popover elements immediately
    if (el.classList && el.classList.contains('mero-miti-input')) return false;
    if (el.getAttribute && (
      el.getAttribute('data-mero-miti-companion') === 'true' ||
      el.getAttribute('data-mero-miti-attached') === 'true' ||
      el.getAttribute('data-mero-miti') === 'false' ||
      el.getAttribute('data-mero-miti') === 'none' ||
      el.getAttribute('data-mero-miti') === 'off' ||
      el.getAttribute('data-mero-miti-ignore') === 'true'
    )) {
      return false;
    }
    if (el.closest && el.closest('.mero-miti-companion-wrapper, .mero-miti-popover, .mero-miti-input-group, [data-mero-miti-wrapper], [data-mero-miti-ignore]')) {
      return false;
    }

    if (el.type === 'date') return true;
    if (el.hasAttribute && el.hasAttribute('data-mero-miti') && el.getAttribute('data-mero-miti') !== 'false') return true;

    var nonDateTypes = ['password', 'email', 'number', 'checkbox', 'radio', 'file', 'submit', 'button', 'reset', 'tel', 'hidden'];
    if (nonDateTypes.indexOf(el.type) !== -1) return false;

    // Check format attribute on element or parent container (e.g. MUI format="DD-MM-YYYY")
    var formatAttr = el.getAttribute('format') || (el.closest && el.closest('[format]') && el.closest('[format]').getAttribute('format')) || '';
    if (/YYYY|YY|MM|DD/i.test(formatAttr)) return true;

    // Check placeholder for date pattern or format
    var placeholder = (el.placeholder || '').trim();
    if (placeholder) {
      // 1. Explicit date format templates (e.g. DD/MM/YYYY, YYYY-MM-DD, MM/DD/YYYY, etc.)
      if (/(yyyy[\/\-\.]mm[\/\-\.]dd|dd[\/\-\.]mm[\/\-\.]yyyy|mm[\/\-\.]dd[\/\-\.]yyyy|yyyy[\/\-\.]dd[\/\-\.]mm)/i.test(placeholder)) {
        return true;
      }
      // 2. Short or partial date masks (e.g. DD/MM, MM/DD, YYYY, etc.)
      if (/(\bdd[\/\-\.]mm\b|\bmm[\/\-\.]dd\b|\byyyy\b)/i.test(placeholder)) {
        return true;
      }
      // 3. Sample date values in placeholder (e.g. 2024-01-15, 15/01/2024)
      if (/\b(19\d\d|20\d\d)[\/\-\.](0?[1-9]|1[0-2])[\/\-\.](0?[1-9]|[12]\d|3[01])\b/.test(placeholder) ||
          /\b(0?[1-9]|[12]\d|3[01])[\/\-\.](0?[1-9]|1[0-2])[\/\-\.](19\d\d|20\d\d)\b/.test(placeholder)) {
        return true;
      }
      // 4. Semantic keywords in placeholder
      if (/\b(date|dob|birth|expiry|expiration|validity|miti)\b/i.test(placeholder) || /मिति/.test(placeholder)) {
        return true;
      }
    }

    // Check if inside MUI Pickers container specifically
    if (el.closest && el.closest('.MuiPickersBasePicker-root, .MuiPickersDatePickerRoot-root, .MuiCalendarPicker-root, [data-mui-date-picker]')) {
      return true;
    }

    // Exclude obvious non-date fields by name or id
    if (/(username|first.*name|last.*name|user|email|phone|mobile|password|address|city|country|role|lang|language|status|title|description)/i.test(el.name || el.id || '')) {
      return false;
    }

    var labelText = '';
    if (el.id && typeof document !== 'undefined') {
      var lbl = document.querySelector('label[for="' + el.id + '"]');
      if (lbl) labelText = lbl.textContent || '';
    }
    if (!labelText && el.closest) {
      var parentControl = el.closest('.MuiFormControl-root, .form-group, .field-wrapper, div');
      if (parentControl) {
        var innerLbl = parentControl.querySelector('label, .label');
        if (innerLbl) labelText = innerLbl.textContent || '';
      }
    }

    var nameAndId = ((el.name || '') + ' ' + (el.id || '')).toLowerCase();
    var combinedContext = (nameAndId + ' ' + labelText).toLowerCase();
    if (/\b(date|dob|birth|expiry|expiration|validity|miti|from_date|to_date)\b/i.test(combinedContext) || /मिति/.test(combinedContext)) {
      return true;
    }

    return false;
  }

  var MeroMiti = {
    init: function (config) {
      config = Object.assign({
        mode: 'manual',
        autoSelector: DEFAULT_AUTO_SELECTOR,
        format: 'DD/MM/YYYY',
        position: 'right',
        theme: 'auto',
        locale: 'ne'
      }, config || {});

      if (config.mode === 'auto') {
        var scan = function () {
          var els = document.querySelectorAll(config.autoSelector);
          for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (!el || el.tagName !== 'INPUT') continue;
            if (el.classList && el.classList.contains('mero-miti-input')) continue;
            if (el.getAttribute && (
              el.getAttribute('data-mero-miti-companion') === 'true' ||
              el.getAttribute('data-mero-miti-attached') === 'true' ||
              el.getAttribute('data-mero-miti') === 'false' ||
              el.getAttribute('data-mero-miti') === 'none' ||
              el.getAttribute('data-mero-miti') === 'off' ||
              el.getAttribute('data-mero-miti-ignore') === 'true'
            )) {
              continue;
            }
            if (el.closest && el.closest('.mero-miti-companion-wrapper, .mero-miti-popover, .mero-miti-input-group, [data-mero-miti-wrapper], [data-mero-miti-ignore]')) {
              continue;
            }
            if (!isDateField(el)) {
              continue;
            }
            if (!instances.has(el) && !el.getAttribute('data-mero-miti-attached')) {
              MeroMiti.attach(el, config);
            }
          }
        };

        var initObserver = function () {
          if (typeof MutationObserver !== 'undefined' && document.body) {
            var debounceTimer = null;
            var obs = new MutationObserver(function (mutations) {
              var hasExternalMutation = false;
              for (var i = 0; i < mutations.length; i++) {
                var mut = mutations[i];
                if (mut.addedNodes && mut.addedNodes.length > 0) {
                  for (var j = 0; j < mut.addedNodes.length; j++) {
                    var node = mut.addedNodes[j];
                    if (node.nodeType === 1) { // Element node
                      if (node.classList && (node.classList.contains('mero-miti-popover') || node.classList.contains('mero-miti-companion-wrapper') || node.classList.contains('mero-miti-input-group'))) {
                        continue;
                      }
                      if (node.hasAttribute && (node.hasAttribute('data-mero-miti-wrapper') || node.hasAttribute('data-mero-miti-ignore') || node.hasAttribute('data-mero-miti-popover'))) {
                        continue;
                      }
                      if (node.closest && node.closest('.mero-miti-popover, .mero-miti-companion-wrapper, [data-mero-miti-wrapper], [data-mero-miti-ignore]')) {
                        continue;
                      }
                      hasExternalMutation = true;
                      break;
                    }
                  }
                }
                if (hasExternalMutation) break;
              }
              if (hasExternalMutation) {
                if (debounceTimer) clearTimeout(debounceTimer);
                debounceTimer = setTimeout(scan, 80);
              }
            });
            obs.observe(document.body, { childList: true, subtree: true });
          }
        };

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', function () {
            scan();
            initObserver();
          });
        } else {
          scan();
          initObserver();
        }
      }
    },

    attach: function (target, options) {
      var el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el) {
        console.warn('[Mero Miti] Element not found:', target);
        return null;
      }
      if (el.classList && el.classList.contains('mero-miti-input')) return null;
      if (el.getAttribute && (
        el.getAttribute('data-mero-miti-companion') === 'true' ||
        el.getAttribute('data-mero-miti') === 'none' ||
        el.getAttribute('data-mero-miti') === 'false' ||
        el.getAttribute('data-mero-miti') === 'off' ||
        el.getAttribute('data-mero-miti-ignore') === 'true'
      )) {
        return null;
      }
      if (el.closest && el.closest('.mero-miti-companion-wrapper, .mero-miti-popover, [data-mero-miti-wrapper], [data-mero-miti-ignore]')) {
        return null;
      }
      if (instances.has(el)) return instances.get(el);
      el.setAttribute('data-mero-miti-attached', 'true');
      var bridge = new MeroMitiCompanionBridge(el, options);
      instances.set(el, bridge);
      return bridge;
    },

    detach: function (target) {
      var el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el && instances.has(el)) {
        instances.get(el).destroy();
        instances.delete(el);
        el.removeAttribute('data-mero-miti-attached');
      }
    },

    version: '1.3.0',
    DEFAULT_CALENDAR_ENDPOINT: 'https://meromiti.com/api/calendar-years',
    syncYears: syncYears,
    fetchYearPatch: fetchYearPatch,
    // Core methods
    adToBs: adToBs,
    bsToAd: bsToAd,
    getFiscalYear: getFiscalYear,
    getFiscalYearRange: getFiscalYearRange,
    getFiscalYearQuarters: getFiscalYearQuarters,
    formatBsDate: formatBsDate,
    formatAdDate: formatAdDate,
    parseBsDate: parseBsDate,
    validateBsDate: validateBsDate,
    registerYear: registerYear,
    getDaysInBsMonth: getDaysInBsMonth,
    I18N: I18N,
    MERO_MITI_ICON_DATA_URL: MERO_MITI_ICON_DATA_URL,
    MERO_MITI_ICON_HTML: MERO_MITI_ICON_HTML
  };

  function syncYears(endpointUrl) {
    var url = endpointUrl || MeroMiti.DEFAULT_CALENDAR_ENDPOINT;
    if (typeof fetch === 'function') {
      return fetch(url)
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (data) {
          if (data && data.years) {
            for (var y in data.years) {
              if (data.years.hasOwnProperty(y)) {
                registerYear(parseInt(y, 10), data.years[y]);
              }
            }
            if (typeof instances !== 'undefined' && instances.forEach) {
              instances.forEach(function (bridge) {
                if (bridge && typeof bridge.syncFromGregorian === 'function') {
                  bridge.syncFromGregorian();
                }
              });
            }
            return data.years;
          }
          return {};
        })
        .catch(function () { return {}; });
    }
    return Promise.resolve({});
  }

  function fetchYearPatch(year, endpointUrl) {
    var base = endpointUrl || MeroMiti.DEFAULT_CALENDAR_ENDPOINT;
    var url = base.indexOf('?') !== -1 ? (base + '&year=' + year) : (base + '?year=' + year);
    if (typeof fetch === 'function') {
      return fetch(url)
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (data) {
          if (data && data.hex) {
            registerYear(year, data.hex);
            return true;
          }
          return false;
        })
        .catch(function () { return false; });
    }
    return Promise.resolve(false);
  }

  // Auto-init on script tag scan
  if (typeof document !== 'undefined' && typeof document.querySelectorAll === 'function') {
    var checkScripts = function () {
      var scripts = document.querySelectorAll('script');
      for (var i = 0; i < scripts.length; i++) {
        var s = scripts[i];
        if (s.getAttribute('data-mero-miti-scanned') === 'true') continue;
        var hasAuto = s.getAttribute('data-mero-miti-auto') === 'true' || s.getAttribute('data-mero-miti-auto') === '';
        var hasAutoSync = s.getAttribute('data-mero-miti-auto-sync') === 'true';
        if (hasAuto || hasAutoSync) {
          s.setAttribute('data-mero-miti-scanned', 'true');
          if (hasAutoSync) {
            syncYears(s.getAttribute('data-mero-miti-endpoint'));
          }
          if (hasAuto) {
            MeroMiti.init({
              mode: 'auto',
              autoSelector: s.getAttribute('data-mero-miti-selector') || DEFAULT_AUTO_SELECTOR,
              format: s.getAttribute('data-mero-miti-format') || 'DD/MM/YYYY',
              position: s.getAttribute('data-mero-miti-position') || 'right',
              theme: s.getAttribute('data-mero-miti-theme') || 'auto',
              locale: s.getAttribute('data-mero-miti-locale') || 'ne',
              numeral: s.getAttribute('data-mero-miti-numeral')
            });
          }
        }
      }
    };
    checkScripts();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkScripts);
    }
  }

  return MeroMiti;
}));
