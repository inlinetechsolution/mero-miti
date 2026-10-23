/// Mero Miti Date Converter in Dart (AD <-> BS)

import 'calendar_data.dart';
import 'formatter.dart';

class BsFiscalYear {
  final int startBsYear;
  final int endBsYear;
  final String code;
  final String nepaliCode;

  BsFiscalYear({
    required this.startBsYear,
    required this.endBsYear,
    required this.code,
    required this.nepaliCode,
  });
}

class FiscalYearRange {
  final BsFiscalYear fiscalYear;
  final BsDate startBs;
  final BsDate endBs;
  final DateTime startAd;
  final DateTime endAd;

  FiscalYearRange({
    required this.fiscalYear,
    required this.startBs,
    required this.endBs,
    required this.startAd,
    required this.endAd,
  });
}

class FiscalQuarterRange {
  final int quarter;
  final String name;
  final String nepaliName;
  final BsDate startBs;
  final BsDate endBs;
  final DateTime startAd;
  final DateTime endAd;

  FiscalQuarterRange({
    required this.quarter,
    required this.name,
    required this.nepaliName,
    required this.startBs,
    required this.endBs,
    required this.startAd,
    required this.endAd,
  });
}

const int anchorBsYear = 2080;
// 2023-04-14 UTC midnight
final DateTime anchorAdTime = DateTime.utc(2023, 4, 14);

/// Converts Gregorian DateTime to Bikram Sambat (BsDate).
BsDate adToBs(DateTime adDate) {
  final targetUtc = DateTime.utc(adDate.year, adDate.month, adDate.day);
  int dayDiff = targetUtc.difference(anchorAdTime).inDays;

  int currentYear = anchorBsYear;
  int currentMonth = 1;
  int currentDay = 1;

  if (dayDiff >= 0) {
    while (true) {
      final daysInMonth = getDaysInBsMonth(currentYear, currentMonth);
      final rem = daysInMonth - currentDay;

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
    dayDiff = dayDiff.abs();
    while (dayDiff > 0) {
      if (currentDay > 1) {
        final step = dayDiff < (currentDay - 1) ? dayDiff : (currentDay - 1);
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

  return BsDate(year: currentYear, month: currentMonth, day: currentDay);
}

/// Converts Bikram Sambat (BsDate) to Gregorian DateTime.
DateTime bsToAd(BsDate bsDate) {
  int dayDiff = 0;

  if (bsDate.year >= anchorBsYear) {
    for (int y = anchorBsYear; y < bsDate.year; y++) {
      dayDiff += getTotalDaysInBsYear(y);
    }
    for (int m = 1; m < bsDate.month; m++) {
      dayDiff += getDaysInBsMonth(bsDate.year, m);
    }
    dayDiff += (bsDate.day - 1);
  } else {
    for (int y = anchorBsYear - 1; y > bsDate.year; y--) {
      dayDiff -= getTotalDaysInBsYear(y);
    }
    int daysInTargetYear = 0;
    for (int m = bsDate.month; m <= 12; m++) {
      final totalDays = getDaysInBsMonth(bsDate.year, m);
      daysInTargetYear += (m == bsDate.month ? (totalDays - bsDate.day + 1) : totalDays);
    }
    dayDiff -= daysInTargetYear;
  }

  return anchorAdTime.add(Duration(days: dayDiff));
}

/// Resolves the Nepali Fiscal Year (आर्थिक वर्ष) for a given date.
BsFiscalYear getFiscalYear([dynamic date]) {
  BsDate bs;
  if (date == null) {
    bs = adToBs(DateTime.now());
  } else if (date is BsDate) {
    bs = date;
  } else if (date is DateTime) {
    bs = adToBs(date);
  } else {
    bs = adToBs(DateTime.now());
  }

  final startYear = bs.month >= 4 ? bs.year : bs.year - 1;
  final endYear = startYear + 1;
  final code = '$startYear/${(endYear % 100).toString().padLeft(2, '0')}';
  return BsFiscalYear(
    startBsYear: startYear,
    endBsYear: endYear,
    code: code,
    nepaliCode: toNepaliDigits(code),
  );
}

/// Returns exact Gregorian and BS date boundaries for a Nepali Fiscal Year.
FiscalYearRange getFiscalYearRange([int? startBsYear]) {
  final startYear = startBsYear ?? getFiscalYear().startBsYear;
  final endYear = startYear + 1;

  final startBs = BsDate(year: startYear, month: 4, day: 1);
  final lastDay = getDaysInBsMonth(endYear, 3);
  final endBs = BsDate(year: endYear, month: 3, day: lastDay);

  final startAd = bsToAd(startBs);
  final endAd = bsToAd(endBs);

  final fy = getFiscalYear(startBs);

  return FiscalYearRange(
    fiscalYear: fy,
    startBs: startBs,
    endBs: endBs,
    startAd: startAd,
    endAd: endAd,
  );
}

/// Calculates all 4 financial quarters for a Nepali Fiscal Year.
List<FiscalQuarterRange> getFiscalYearQuarters([int? startBsYear]) {
  final range = getFiscalYearRange(startBsYear);
  final y1 = range.fiscalYear.startBsYear;
  final y2 = range.fiscalYear.endBsYear;

  final q1End = getDaysInBsMonth(y1, 6);
  final q2End = getDaysInBsMonth(y1, 9);
  final q3End = getDaysInBsMonth(y1, 12);
  final q4End = getDaysInBsMonth(y2, 3);

  final q1BsS = BsDate(year: y1, month: 4, day: 1);
  final q1BsE = BsDate(year: y1, month: 6, day: q1End);
  final q2BsS = BsDate(year: y1, month: 7, day: 1);
  final q2BsE = BsDate(year: y1, month: 9, day: q2End);
  final q3BsS = BsDate(year: y1, month: 10, day: 1);
  final q3BsE = BsDate(year: y1, month: 12, day: q3End);
  final q4BsS = BsDate(year: y2, month: 1, day: 1);
  final q4BsE = BsDate(year: y2, month: 3, day: q4End);

  return [
    FiscalQuarterRange(quarter: 1, name: "Q1 (Shrawan - Ashwin)", nepaliName: "प्रथम त्रैमासिक (साउन - असोज)", startBs: q1BsS, endBs: q1BsE, startAd: bsToAd(q1BsS), endAd: bsToAd(q1BsE)),
    FiscalQuarterRange(quarter: 2, name: "Q2 (Kartik - Poush)", nepaliName: "दोस्रो त्रैमासिक (कात्तिक - पुस)", startBs: q2BsS, endBs: q2BsE, startAd: bsToAd(q2BsS), endAd: bsToAd(q2BsE)),
    FiscalQuarterRange(quarter: 3, name: "Q3 (Magh - Chaitra)", nepaliName: "तेस्रो त्रैमासिक (माघ - चैत)", startBs: q3BsS, endBs: q3BsE, startAd: bsToAd(q3BsS), endAd: bsToAd(q3BsE)),
    FiscalQuarterRange(quarter: 4, name: "Q4 (Baisakh - Ashadh)", nepaliName: "चौथो त्रैमासिक (बैशाख - असार)", startBs: q4BsS, endBs: q4BsE, startAd: bsToAd(q4BsS), endAd: bsToAd(q4BsE)),
  ];
}
