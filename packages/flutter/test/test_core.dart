import '../lib/src/calendar_data.dart';
import '../lib/src/converter.dart';
import '../lib/src/formatter.dart';

void main() {
  print('--- 1. Testing Dart 24-bit Month Days Decoding ---');
  final days2081 = decodeMonthDays('bb9512');
  print('Decoded 2081 BS in Dart: $days2081');
  assert(days2081.length == 12, 'Must have 12 months');
  assert(days2081[0] == 31, 'Baishakh 2081 has 31 days');
  assert(days2081[1] == 32, 'Jestha 2081 has 32 days');
  print('✔ Dart 24-bit decoding passed!');

  print('\n--- 2. Testing Dart Conversions ---');
  // AD 2023-04-14 -> BS 2080-01-01
  final bs1 = adToBs(DateTime.utc(2023, 4, 14));
  print('AD 2023-04-14 -> BS: $bs1');
  assert(bs1 == const BsDate(year: 2080, month: 1, day: 1), 'Must match 2080-01-01');

  // BS 2080-01-01 -> AD 2023-04-14
  final ad1 = bsToAd(const BsDate(year: 2080, month: 1, day: 1));
  print('BS 2080-01-01 -> AD: $ad1');
  assert(ad1.year == 2023 && ad1.month == 4 && ad1.day == 14, 'Must match 2023-04-14');

  // AD 2024-09-04 -> BS 2081-05-19
  final bsToday = adToBs(DateTime.utc(2024, 9, 4));
  print('AD 2024-09-04 -> BS: $bsToday');
  assert(bsToday == const BsDate(year: 2081, month: 5, day: 19), 'Must match 2081-05-19');

  // BS 2081-05-19 -> AD 2024-09-04
  final adToday = bsToAd(const BsDate(year: 2081, month: 5, day: 19));
  print('BS 2081-05-19 -> AD: $adToday');
  assert(adToday.year == 2024 && adToday.month == 9 && adToday.day == 4, 'Must match 2024-09-04');

  print('\n--- 3. Testing Formatter in Dart ---');
  final formattedEn = formatBsDate(const BsDate(year: 2081, month: 5, day: 19));
  print('Formatted EN: $formattedEn');
  assert(formattedEn == '19/05/2081', 'Must format to 19/05/2081');

  final formattedNp = formatBsDate(const BsDate(year: 2081, month: 5, day: 19), devanagari: true);
  print('Formatted NP: $formattedNp');
  assert(formattedNp == '१९/०५/२०८१', 'Must format to १९/०५/२०८१');

  print('\n--- 4. Testing Dynamic Year Registration in Dart ---');
  registerYear(2095, 'bba445');
  final days2095 = getMonthDaysForBsYear(2095);
  print('Dynamic Year 2095 days: $days2095');
  assert(days2095.length == 12, 'Must have 12 months for 2095');
  print('✔ Dynamic registerYear passed in Dart!');

  print('\n=============================================');
  print('🎉 ALL MERO MITI FLUTTER / DART TESTS PASSED!');
  print('=============================================');
}
