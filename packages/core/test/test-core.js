const assert = require('assert');

// 1. Bitwise 2-bit encoding & decoding test
function encodeMonthDays(days) {
  let bits = 0;
  for (let i = 0; i < 12; i++) {
    const d = days[i];
    const val = d - 29;
    bits = (bits << 2) | val;
  }
  return bits.toString(16).padStart(6, '0');
}

function decodeMonthDays(hex) {
  const bits = parseInt(hex, 16);
  const days = [];
  for (let i = 11; i >= 0; i--) {
    const val = (bits >> (i * 2)) & 0x03;
    days.push(val + 29);
  }
  return days;
}

console.log("--- 1. Testing 24-bit Month Days Compression ---");
const testYear = [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31];
const hex = encodeMonthDays(testYear);
console.log("Encoded 2081 BS:", hex, "(Length:", hex.length, "chars / 3 bytes)");
const decoded = decodeMonthDays(hex);
assert.deepStrictEqual(decoded, testYear, "Decoded array must match original exactly");
console.log("✔ Compression test passed!");

// 2. Conversion Tests
const ANCHOR_BS_YEAR = 2080;
const ANCHOR_AD_TIME = Date.UTC(2023, 3, 14); // 2023-04-14
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const COMPRESSED_CALENDAR = {
  2080: "bb9505", // [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30] -> 365 days
  2081: "bb9512", // [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31] -> 365 days
  2082: "aea445",
  2083: "aea445"
};

const customRegistry = new Map();

function registerYear(year, data) {
  if (typeof data === 'string') {
    customRegistry.set(year, decodeMonthDays(data));
  } else {
    customRegistry.set(year, data);
  }
}

function getDays(year) {
  if (customRegistry.has(year)) return customRegistry.get(year);
  if (COMPRESSED_CALENDAR[year]) return decodeMonthDays(COMPRESSED_CALENDAR[year]);
  return [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30]; // projection
}

function adToBs(date) {
  const targetUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  let dayDiff = Math.round((targetUtc - ANCHOR_AD_TIME) / MS_PER_DAY);
  let year = ANCHOR_BS_YEAR;
  let month = 1;
  let day = 1;

  while (true) {
    const days = getDays(year);
    const daysInMonth = days[month - 1];
    const rem = daysInMonth - day;

    if (dayDiff <= rem) {
      day += dayDiff;
      break;
    }
    dayDiff -= (rem + 1);
    day = 1;
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }
  return { year, month, day };
}

function bsToAd(bs) {
  let dayDiff = 0;
  for (let y = ANCHOR_BS_YEAR; y < bs.year; y++) {
    dayDiff += getDays(y).reduce((a, b) => a + b, 0);
  }
  const days = getDays(bs.year);
  for (let m = 1; m < bs.month; m++) {
    dayDiff += days[m - 1];
  }
  dayDiff += (bs.day - 1);

  const res = new Date(ANCHOR_AD_TIME + dayDiff * MS_PER_DAY);
  return {
    year: res.getUTCFullYear(),
    month: res.getUTCMonth() + 1,
    day: res.getUTCDate()
  };
}

console.log("\n--- 2. Testing Conversions ---");
// 2023-04-14 should be 2080-01-01
const bs1 = adToBs(new Date(2023, 3, 14));
assert.deepStrictEqual(bs1, { year: 2080, month: 1, day: 1 });
console.log("✔ AD 2023-04-14 -> BS", bs1);

// 2080-01-01 should be 2023-04-14
const ad1 = bsToAd({ year: 2080, month: 1, day: 1 });
assert.deepStrictEqual(ad1, { year: 2023, month: 4, day: 14 });
console.log("✔ BS 2080-01-01 -> AD", ad1);

// 2024-09-04 should be 2081-05-19
const bsToday = adToBs(new Date(2024, 8, 4));
assert.deepStrictEqual(bsToday, { year: 2081, month: 5, day: 19 });
console.log("✔ AD 2024-09-04 -> BS", bsToday);

// 2081-05-19 should be 2024-09-04
const adToday = bsToAd({ year: 2081, month: 5, day: 19 });
assert.deepStrictEqual(adToday, { year: 2024, month: 9, day: 4 });
console.log("✔ BS 2081-05-19 -> AD", adToday);

console.log("\n--- 3. Testing Dynamic Year Extension API ---");
// Simulate vendor registering an unreleased future year (2095) with custom days:
const futureYearDays = [31, 32, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30];
const futureHex = encodeMonthDays(futureYearDays);
registerYear(2095, futureHex);
const retrieved = getDays(2095);
assert.deepStrictEqual(retrieved, futureYearDays, "Dynamic registered year must match");
console.log("✔ Vendor registerYear(2095, '" + futureHex + "') successfully dynamically loaded!");

console.log("\n==========================================");
console.log("🎉 ALL MERO MITI CORE TESTS PASSED!");
console.log("==========================================");
