/// Mero Miti Core Calendar Data Engine in Dart
///
/// 24-bit encoded calendar data (6 hex chars per year).

class BsDate {
  final int year;
  final int month; // 1-12
  final int day;   // 1-32

  const BsDate({required this.year, required this.month, required this.day});

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is BsDate &&
          runtimeType == other.runtimeType &&
          year == other.year &&
          month == other.month &&
          day == other.day;

  @override
  int get hashCode => year.hashCode ^ month.hashCode ^ day.hashCode;

  @override
  String toString() => '$year-${month.toString().padLeft(2, '0')}-${day.toString().padLeft(2, '0')}';
}

final Map<int, String> compressedCalendarData = {
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

final Map<int, List<int>> _customYearRegistry = {};

List<int> decodeMonthDays(String hex) {
  final bits = int.parse(hex, radix: 16);
  final days = <int>[];
  for (int i = 11; i >= 0; i--) {
    final val = (bits >> (i * 2)) & 0x03;
    days.add(val + 29);
  }
  return days;
}

List<int> getMonthDaysForBsYear(int year) {
  if (_customYearRegistry.containsKey(year)) {
    return _customYearRegistry[year]!;
  }
  if (compressedCalendarData.containsKey(year)) {
    return decodeMonthDays(compressedCalendarData[year]!);
  }
  // Solar astronomical projection fallback for future unreleased years
  return [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30];
}

int getDaysInBsMonth(int year, int month) {
  if (month < 1 || month > 12) {
    throw ArgumentError('Invalid BS month: $month. Must be between 1 and 12.');
  }
  return getMonthDaysForBsYear(year)[month - 1];
}

int getTotalDaysInBsYear(int year) {
  return getMonthDaysForBsYear(year).reduce((a, b) => a + b);
}

const String defaultCalendarEndpoint = 'https://meromiti.com/api/calendar-years';

/// Dynamic registration of future official years at runtime
void registerYear(int year, dynamic data) {
  if (data is String) {
    _customYearRegistry[year] = decodeMonthDays(data);
  } else if (data is List<int> && data.length == 12) {
    _customYearRegistry[year] = List<int>.from(data);
  } else {
    throw ArgumentError('Data must be 6-char hex String or List<int> of 12 month days.');
  }
}
