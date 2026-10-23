#!/usr/bin/env node
/**
 * Mero Miti Year Encoder Utility
 * Encodes 12 month days (29-32) into a 24-bit (6 hex chars) string.
 *
 * Usage:
 *   node scripts/encode-year.js <year> <d1> <d2> <d3> ... <d12>
 * Example:
 *   node scripts/encode-year.js 2081 31 32 31 32 31 30 30 30 29 30 29 31
 */

const args = process.argv.slice(2);

if (args.length < 13) {
  console.log("Usage: node encode-year.js <year> <m1> <m2> ... <m12>");
  console.log("Example:");
  console.log("  node encode-year.js 2081 31 32 31 32 31 30 30 30 29 30 29 31");
  process.exit(1);
}

const year = parseInt(args[0], 10);
const days = args.slice(1, 13).map(Number);

for (let i = 0; i < 12; i++) {
  if (days[i] < 29 || days[i] > 32) {
    console.error(`❌ Month ${i + 1} has invalid day count ${days[i]}. Nepali months only have 29-32 days.`);
    process.exit(1);
  }
}

// 2 bits per month: 00=29, 01=30, 10=31, 11=32
let num = 0;
for (let m = 0; m < 12; m++) {
  const code = days[m] - 29;
  const shift = (11 - m) * 2;
  num |= (code << shift);
}

const hex = num.toString(16).padStart(6, '0');

console.log("\n==========================================");
console.log(`🎉 Year ${year} Successfully Encoded!`);
console.log(`Hex Code: "${hex}" (Length: ${hex.length} chars / 3 bytes)`);
console.log(`Registry entry:  ${year}: "${hex}",`);
console.log("==========================================\n");

// Verification test
let decoded = [];
for (let m = 11; m >= 0; m--) {
  const shift = (11 - m) * 2;
  const code = (num >> shift) & 0x3;
  decoded[m] = 29 + code;
}

const match = JSON.stringify(days) === JSON.stringify(decoded);
if (match) {
  console.log("✔ Decoded verification matches input days perfectly!");
} else {
  console.error("❌ Decoded verification failed!");
  process.exit(1);
}
