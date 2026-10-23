/// Mero Miti Formatter and Validator in Dart (Bilingual: English & Nepali)

import 'calendar_data.dart';

const List<String> nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

const List<String> nepaliMonthsNp = [
  "बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज",
  "कात्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"
];

const List<String> nepaliMonthsEn = [
  "Baishakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

const List<String> nepaliDaysShortNp = ["आइत", "सोम", "मंगल", "बुध", "बिहि", "शुक्र", "शनि"];
const List<String> nepaliDaysShortEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

String toNepaliDigits(dynamic input) {
  if (input == null) return '';
  return input.toString().split('').map((ch) {
    final d = int.tryParse(ch);
    return d != null ? nepaliDigits[d] : ch;
  }).join('');
}

String toEnglishDigits(String input) {
  var res = input;
  for (int i = 0; i < nepaliDigits.length; i++) {
    res = res.replaceAll(nepaliDigits[i], i.toString());
  }
  return res;
}

String formatBsDate(BsDate date, {String format = 'DD/MM/YYYY', String locale = 'en', bool? devanagari}) {
  final isNe = locale == 'ne';
  final useDevanagari = devanagari ?? isNe;

  final dayStr = date.day.toString().padLeft(2, '0');
  final monthStr = date.month.toString().padLeft(2, '0');
  final yearStr = date.year.toString();

  final months = isNe ? nepaliMonthsNp : nepaliMonthsEn;

  var res = format
      .replaceAll('YYYY', yearStr)
      .replaceAll('YY', yearStr.substring(yearStr.length - 2))
      .replaceAll('MMMM', months[date.month - 1])
      .replaceAll('MM', monthStr)
      .replaceAll('M', date.month.toString())
      .replaceAll('DD', dayStr)
      .replaceAll('D', date.day.toString());

  if (useDevanagari) {
    res = toNepaliDigits(res);
  }
  return res;
}

BsDate? parseBsDate(String input, {String format = 'DD/MM/YYYY'}) {
  if (input.isEmpty) return null;
  final normalized = toEnglishDigits(input.trim());

  final sep = RegExp(r'[/.-]').firstMatch(format)?.group(0) ?? '/';
  final inputParts = normalized.split(sep);
  final formatParts = format.split(sep);

  if (inputParts.length != 3 || formatParts.length != 3) return null;

  int year = 0;
  int month = 0;
  int day = 0;

  for (int i = 0; i < 3; i++) {
    final f = formatParts[i].toUpperCase();
    final val = int.tryParse(inputParts[i]) ?? 0;
    if (f.startsWith('Y')) {
      year = val;
    } else if (f.startsWith('M')) {
      month = val;
    } else if (f.startsWith('D')) {
      day = val;
    }
  }

  if (year < 1970 || year > 2150) return null;
  if (month < 1 || month > 12) return null;

  final maxDays = getDaysInBsMonth(year, month);
  if (day < 1 || day > maxDays) return null;

  return BsDate(year: year, month: month, day: day);
}
