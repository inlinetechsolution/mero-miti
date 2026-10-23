using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace MeroMiti
{
    public static class MeroMitiCore
    {
        public static readonly string[] NepaliMonthsNp = {
            "बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज",
            "कात्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"
        };

        public static readonly string[] NepaliMonthsEn = {
            "Baishakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
            "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
        };

        public static readonly string[] NepaliDaysShortNp = { "आइत", "सोम", "मंगल", "बुध", "बिही", "शुक्र", "शनि" };
        public static readonly string[] NepaliDaysShortEn = { "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" };

        private static readonly Dictionary<char, char> NepaliDigitsMap = new Dictionary<char, char>
        {
            ['0'] = '०', ['1'] = '१', ['2'] = '२', ['3'] = '३', ['4'] = '४',
            ['5'] = '५', ['6'] = '६', ['7'] = '७', ['8'] = '८', ['9'] = '९'
        };

        private static readonly Dictionary<char, char> EnglishDigitsMap = new Dictionary<char, char>();

        // Anchor Date: 2080-01-01 BS = 2023-04-14 AD
        private const int AnchorBsYear = 2080;
        private const int AnchorBsMonth = 1;
        private const int AnchorBsDay = 1;
        private static readonly DateTime AnchorAdDate = new DateTime(2023, 4, 14, 0, 0, 0, DateTimeKind.Utc);

        // 24-bit compressed calendar data (2 bits/month, 6 hex chars per year)
        private static readonly Dictionary<int, string> CompressedCalendarData = new Dictionary<int, string>
        {
            [1973] = "7b9512", [1974] = "ada445", [1975] = "af6445", [1976] = "bb9506", [1977] = "bba112",
            [1978] = "aea445", [1979] = "af9445", [1980] = "bb9506", [1981] = "aba145", [1982] = "aea445",
            [1983] = "af9445", [1984] = "bb9506", [1985] = "aba145", [1986] = "aea445", [1987] = "bb9445",
            [1988] = "bb9506", [1989] = "aba445", [1990] = "aea445", [1991] = "bb9445", [1992] = "bb9512",
            [1993] = "aba445", [1994] = "aea445", [1995] = "bb9505", [1996] = "bb9506", [1997] = "aea445",
            [1998] = "aed445", [1999] = "bb9506", [2000] = "7b9512", [2001] = "aea445", [2002] = "af9445",
            [2003] = "bb9506", [2004] = "7b9512", [2005] = "aea445", [2006] = "af9445", [2007] = "bb9506",
            [2008] = "aba142", [2009] = "aea445", [2010] = "af9445", [2011] = "bb9506", [2012] = "aba145",
            [2013] = "aea445", [2014] = "af9445", [2015] = "bb9506", [2016] = "aba145", [2017] = "aea445",
            [2018] = "bb9445", [2019] = "bb9512", [2020] = "aba445", [2021] = "aea445", [2022] = "bb9505",
            [2023] = "bb9512", [2024] = "aba445", [2025] = "aea445", [2026] = "bb9506", [2027] = "7b9512",
            [2028] = "aea445", [2029] = "aed445", [2030] = "bb9506", [2031] = "7b9512", [2032] = "aea445",
            [2033] = "af9445", [2034] = "bb9506", [2035] = "7ba142", [2036] = "aea445", [2037] = "af9445",
            [2038] = "bb9506", [2039] = "aba145", [2040] = "aea445", [2041] = "af9445", [2042] = "bb9506",
            [2043] = "aba145", [2044] = "aea445", [2045] = "bb9445", [2046] = "bb9506", [2047] = "aba445",
            [2048] = "aea445", [2049] = "bb9505", [2050] = "bb9512", [2051] = "aba445", [2052] = "aea445",
            [2053] = "bb9505", [2054] = "bb9512", [2055] = "aea445", [2056] = "aed445", [2057] = "bb9506",
            [2058] = "7b9512", [2059] = "aea445", [2060] = "af9445", [2061] = "bb9506", [2062] = "7ba112",
            [2063] = "aea445", [2064] = "af9445", [2065] = "bb9506", [2066] = "aba142", [2067] = "aea445",
            [2068] = "af9445", [2069] = "bb9506", [2070] = "aba145", [2071] = "aea445", [2072] = "bb9445",
            [2073] = "bb9506", [2074] = "aba445", [2075] = "aea445", [2076] = "bb9505", [2077] = "bb9512",
            [2078] = "aba445", [2079] = "aea445", [2080] = "bb9505", [2081] = "bb9512", [2082] = "aea445",
            [2083] = "aea445", [2084] = "bb9506", [2085] = "7b9512", [2086] = "aea445", [2087] = "aea515",
            [2088] = "6f6515", [2089] = "7b9515", [2090] = "7b9515", [2091] = "aea515", [2092] = "6f9515",
            [2093] = "7b9515", [2094] = "ae9515", [2095] = "aea455", [2096] = "6f9445", [2097] = "bb9515",
            [2098] = "aea112", [2099] = "aea415"
        };

        private static readonly Dictionary<int, int[]> DecodedCache = new Dictionary<int, int[]>();

        static MeroMitiCore()
        {
            foreach (var kvp in NepaliDigitsMap)
            {
                EnglishDigitsMap[kvp.Value] = kvp.Key;
            }
        }

        public static int[] DecodeMonthDays(string hex)
        {
            long num = Convert.ToInt64(hex, 16);
            int[] days = new int[12];
            for (int m = 11; m >= 0; m--)
            {
                int shift = (11 - m) * 2;
                int code = (int)((num >> shift) & 0x3);
                days[m] = 29 + code;
            }
            return days;
        }

        public const string DefaultCalendarEndpoint = "https://meromiti.com/api/calendar-years";

        public static async System.Threading.Tasks.Task<Dictionary<int, string>> SyncYearsAsync(string endpointUrl = DefaultCalendarEndpoint)
        {
            try
            {
                using (var client = new System.Net.Http.HttpClient())
                {
                    client.Timeout = TimeSpan.FromSeconds(5);
                    client.DefaultRequestHeaders.Add("User-Agent", "MeroMiti-DotNet/1.0.0");
                    string json = await client.GetStringAsync(endpointUrl).ConfigureAwait(false);
                    var regex = new System.Text.RegularExpressions.Regex("\"(\\d{4})\":\\s*\"([0-9a-f]{6})\"");
                    var matches = regex.Matches(json);
                    var dict = new Dictionary<int, string>();
                    foreach (System.Text.RegularExpressions.Match match in matches)
                    {
                        int yr = int.Parse(match.Groups[1].Value);
                        string hex = match.Groups[2].Value;
                        RegisterYear(yr, hex);
                        dict[yr] = hex;
                    }
                    return dict;
                }
            }
            catch
            {
                return new Dictionary<int, string>();
            }
        }

        public static async System.Threading.Tasks.Task<bool> FetchYearPatchAsync(int year, string endpointUrl = DefaultCalendarEndpoint)
        {
            try
            {
                using (var client = new System.Net.Http.HttpClient())
                {
                    client.Timeout = TimeSpan.FromSeconds(5);
                    client.DefaultRequestHeaders.Add("User-Agent", "MeroMiti-DotNet/1.0.0");
                    string url = endpointUrl.Contains("?") ? $"{endpointUrl}&year={year}" : $"{endpointUrl}?year={year}";
                    string json = await client.GetStringAsync(url).ConfigureAwait(false);
                    var regex = new System.Text.RegularExpressions.Regex("\"hex\":\\s*\"([0-9a-f]{6})\"");
                    var match = regex.Match(json);
                    if (match.Success)
                    {
                        RegisterYear(year, match.Groups[1].Value);
                        return true;
                    }
                }
            }
            catch
            {
            }
            return false;
        }

        public static void RegisterYear(int year, string hexCode)
        {
            CompressedCalendarData[year] = hexCode;
            DecodedCache.Remove(year);
        }

        public static void RegisterYear(int year, int[] days)
        {
            if (days.Length != 12)
                throw new ArgumentException("Days array must contain exactly 12 months.", nameof(days));
            DecodedCache[year] = days;
        }

        public static int GetDaysInBsMonth(int year, int month)
        {
            if (month < 1 || month > 12)
                throw new ArgumentOutOfRangeException(nameof(month), "Month must be between 1 and 12.");

            if (!DecodedCache.TryGetValue(year, out var days))
            {
                if (CompressedCalendarData.TryGetValue(year, out var hex))
                {
                    days = DecodeMonthDays(hex);
                    DecodedCache[year] = days;
                }
                else
                {
                    // Fallback projection
                    days = new int[] { 31, 31, 31, 32, 31, 30, 30, 30, 29, 30, 29, 30 };
                    DecodedCache[year] = days;
                }
            }
            return days[month - 1];
        }

        public static string ToNepaliDigits(string input)
        {
            var sb = new StringBuilder(input.Length);
            foreach (char ch in input)
            {
                sb.Append(NepaliDigitsMap.TryGetValue(ch, out var nep) ? nep : ch);
            }
            return sb.ToString();
        }

        public static string ToEnglishDigits(string input)
        {
            var sb = new StringBuilder(input.Length);
            foreach (char ch in input)
            {
                sb.Append(EnglishDigitsMap.TryGetValue(ch, out var en) ? en : ch);
            }
            return sb.ToString();
        }

        public static BsDate AdToBs(DateTime adDate)
        {
            int daysDiff = (int)(adDate.Date - AnchorAdDate.Date).TotalDays;

            int curYear = AnchorBsYear;
            int curMonth = AnchorBsMonth;
            int curDay = AnchorBsDay;

            if (daysDiff >= 0)
            {
                while (daysDiff > 0)
                {
                    int daysInMonth = GetDaysInBsMonth(curYear, curMonth);
                    int remaining = daysInMonth - curDay;
                    if (daysDiff <= remaining)
                    {
                        curDay += daysDiff;
                        daysDiff = 0;
                    }
                    else
                    {
                        daysDiff -= (remaining + 1);
                        curDay = 1;
                        curMonth++;
                        if (curMonth > 12)
                        {
                            curMonth = 1;
                            curYear++;
                        }
                    }
                }
            }
            else
            {
                daysDiff = -daysDiff;
                while (daysDiff > 0)
                {
                    if (daysDiff < curDay)
                    {
                        curDay -= daysDiff;
                        daysDiff = 0;
                    }
                    else
                    {
                        daysDiff -= curDay;
                        curMonth--;
                        if (curMonth < 1)
                        {
                            curMonth = 12;
                            curYear--;
                        }
                        curDay = GetDaysInBsMonth(curYear, curMonth);
                    }
                }
            }

            return new BsDate(curYear, curMonth, curDay);
        }

        public static DateTime BsToAd(BsDate bs)
        {
            int totalDays = 0;

            if (bs.Year >= AnchorBsYear)
            {
                for (int y = AnchorBsYear; y < bs.Year; y++)
                {
                    for (int m = 1; m <= 12; m++)
                    {
                        totalDays += GetDaysInBsMonth(y, m);
                    }
                }
                for (int m = 1; m < bs.Month; m++)
                {
                    totalDays += GetDaysInBsMonth(bs.Year, m);
                }
                totalDays += (bs.Day - 1);
                return AnchorAdDate.AddDays(totalDays);
            }
            else
            {
                for (int y = bs.Year + 1; y < AnchorBsYear; y++)
                {
                    for (int m = 1; m <= 12; m++)
                    {
                        totalDays += GetDaysInBsMonth(y, m);
                    }
                }
                for (int m = bs.Month; m <= 12; m++)
                {
                    totalDays += GetDaysInBsMonth(bs.Year, m);
                }
                totalDays -= (bs.Day - 1);
                return AnchorAdDate.AddDays(-totalDays);
            }
        }

        public static ValidationResult ValidateBsDate(BsDate bs, string locale = "ne")
        {
            string[] monthNames = locale == "ne" ? NepaliMonthsNp : NepaliMonthsEn;

            if (bs.Year < 1970 || bs.Year > 2150)
            {
                string err = locale == "ne" ? "साल १९७० देखि २१५० हुनुपर्छ" : "Year must be 1970 - 2150";
                return new ValidationResult(false, err);
            }

            if (bs.Month < 1 || bs.Month > 12)
            {
                string err = locale == "ne" ? "महिना १ देखि १२ हुनुपर्छ" : "Month must be 1 - 12";
                return new ValidationResult(false, err);
            }

            int maxDays = GetDaysInBsMonth(bs.Year, bs.Month);
            if (bs.Day < 1 || bs.Day > maxDays)
            {
                string err = locale == "ne"
                    ? $"{bs.Year} साल {monthNames[bs.Month - 1]}मा {maxDays} दिन मात्र छन्"
                    : $"{monthNames[bs.Month - 1]} {bs.Year} has only {maxDays} days";
                return new ValidationResult(false, err);
            }

            return new ValidationResult(true, null, bs);
        }

        public static string FormatBsDate(BsDate bs, string format = "DD/MM/YYYY", string numeral = "en")
        {
            string padYear = bs.Year.ToString("D4");
            string padMonth = bs.Month.ToString("D2");
            string padDay = bs.Day.ToString("D2");

            string res = format
                .Replace("YYYY", padYear)
                .Replace("MM", padMonth)
                .Replace("DD", padDay);

            if (numeral == "ne")
            {
                res = ToNepaliDigits(res);
            }

            return res;
        }

        public static ValidationResult ParseBsDate(string dateStr, string format = "DD/MM/YYYY", string locale = "ne")
        {
            if (string.IsNullOrWhiteSpace(dateStr))
            {
                return new ValidationResult(false, "Date string is empty.");
            }

            string normalized = ToEnglishDigits(dateStr.Trim());
            char sep = format.Contains(".") ? '.' : (format.Contains("-") ? '-' : '/');

            string[] parts = normalized.Split(sep);
            string[] fmtParts = format.Split(sep);

            if (parts.Length != 3 || fmtParts.Length != 3)
            {
                return new ValidationResult(false, $"Format must match {format}.");
            }

            int y = 0, m = 0, d = 0;
            for (int i = 0; i < 3; i++)
            {
                string f = fmtParts[i].ToUpperInvariant();
                if (!int.TryParse(parts[i], out int val))
                {
                    return new ValidationResult(false, "Date contains non-numeric values.");
                }

                if (f.StartsWith("Y")) y = val;
                else if (f.StartsWith("M")) m = val;
                else if (f.StartsWith("D")) d = val;
            }

            return ValidateBsDate(new BsDate(y, m, d), locale);
        }

        public static BsFiscalYear GetFiscalYear(BsDate? bsDate = null)
        {
            var bs = bsDate ?? AdToBs(DateTime.UtcNow);
            int startBsYear = bs.Month >= 4 ? bs.Year : bs.Year - 1;
            int endBsYear = startBsYear + 1;
            string code = $"{startBsYear}/{(endBsYear % 100):D2}";
            string nepaliCode = ToNepaliDigits(code);

            return new BsFiscalYear(startBsYear, endBsYear, code, nepaliCode);
        }

        public static FiscalYearRange GetFiscalYearRange(int? startBsYear = null)
        {
            int startYear = startBsYear ?? GetFiscalYear().StartBsYear;
            int endYear = startYear + 1;
            var startBs = new BsDate(startYear, 4, 1);
            int lastDayAshadh = GetDaysInBsMonth(endYear, 3);
            var endBs = new BsDate(endYear, 3, lastDayAshadh);

            var startAd = BsToAd(startBs);
            var endAd = BsToAd(endBs);
            var fy = GetFiscalYear(startBs);

            return new FiscalYearRange(
                fy,
                startBs,
                endBs,
                new AdDate(startAd.Year, startAd.Month, startAd.Day),
                new AdDate(endAd.Year, endAd.Month, endAd.Day),
                new DateTime(startAd.Year, startAd.Month, startAd.Day, 0, 0, 0, DateTimeKind.Utc),
                new DateTime(endAd.Year, endAd.Month, endAd.Day, 0, 0, 0, DateTimeKind.Utc)
            );
        }

        public static List<FiscalQuarterRange> GetFiscalYearQuarters(int? startBsYear = null)
        {
            var range = GetFiscalYearRange(startBsYear);
            int y1 = range.FiscalYear.StartBsYear;
            int y2 = range.FiscalYear.EndBsYear;

            int q1EndDay = GetDaysInBsMonth(y1, 6);
            int q2EndDay = GetDaysInBsMonth(y1, 9);
            int q3EndDay = GetDaysInBsMonth(y1, 12);
            int q4EndDay = GetDaysInBsMonth(y2, 3);

            var q1StartBs = new BsDate(y1, 4, 1);
            var q1EndBs = new BsDate(y1, 6, q1EndDay);
            var q1StartAd = BsToAd(q1StartBs);
            var q1EndAd = BsToAd(q1EndBs);

            var q2StartBs = new BsDate(y1, 7, 1);
            var q2EndBs = new BsDate(y1, 9, q2EndDay);
            var q2StartAd = BsToAd(q2StartBs);
            var q2EndAd = BsToAd(q2EndBs);

            var q3StartBs = new BsDate(y1, 10, 1);
            var q3EndBs = new BsDate(y1, 12, q3EndDay);
            var q3StartAd = BsToAd(q3StartBs);
            var q3EndAd = BsToAd(q3EndBs);

            var q4StartBs = new BsDate(y2, 1, 1);
            var q4EndBs = new BsDate(y2, 3, q4EndDay);
            var q4StartAd = BsToAd(q4StartBs);
            var q4EndAd = BsToAd(q4EndBs);

            return new List<FiscalQuarterRange>
            {
                new FiscalQuarterRange(1, "Q1 (Shrawan - Ashwin)", "प्रथम त्रैमासिक (साउन - असोज)", q1StartBs, q1EndBs, new AdDate(q1StartAd.Year, q1StartAd.Month, q1StartAd.Day), new AdDate(q1EndAd.Year, q1EndAd.Month, q1EndAd.Day)),
                new FiscalQuarterRange(2, "Q2 (Kartik - Poush)", "दोस्रो त्रैमासिक (कात्तिक - पुस)", q2StartBs, q2EndBs, new AdDate(q2StartAd.Year, q2StartAd.Month, q2StartAd.Day), new AdDate(q2EndAd.Year, q2EndAd.Month, q2EndAd.Day)),
                new FiscalQuarterRange(3, "Q3 (Magh - Chaitra)", "तेस्रो त्रैमासिक (माघ - चैत)", q3StartBs, q3EndBs, new AdDate(q3StartAd.Year, q3StartAd.Month, q3StartAd.Day), new AdDate(q3EndAd.Year, q3EndAd.Month, q3EndAd.Day)),
                new FiscalQuarterRange(4, "Q4 (Baisakh - Ashadh)", "चौथो त्रैमासिक (बैशाख - असार)", q4StartBs, q4EndBs, new AdDate(q4StartAd.Year, q4StartAd.Month, q4StartAd.Day), new AdDate(q4EndAd.Year, q4EndAd.Month, q4EndAd.Day))
            };
        }
    }

    public class BsFiscalYear
    {
        public int StartBsYear { get; }
        public int EndBsYear { get; }
        public string Code { get; }
        public string NepaliCode { get; }

        public BsFiscalYear(int startBsYear, int endBsYear, string code, string nepaliCode)
        {
            StartBsYear = startBsYear;
            EndBsYear = endBsYear;
            Code = code;
            NepaliCode = nepaliCode;
        }
    }

    public class FiscalYearRange
    {
        public BsFiscalYear FiscalYear { get; }
        public BsDate StartBs { get; }
        public BsDate EndBs { get; }
        public AdDate StartAd { get; }
        public AdDate EndAd { get; }
        public DateTime StartDate { get; }
        public DateTime EndDate { get; }

        public FiscalYearRange(BsFiscalYear fiscalYear, BsDate startBs, BsDate endBs, AdDate startAd, AdDate endAd, DateTime startDate, DateTime endDate)
        {
            FiscalYear = fiscalYear;
            StartBs = startBs;
            EndBs = endBs;
            StartAd = startAd;
            EndAd = endAd;
            StartDate = startDate;
            EndDate = endDate;
        }
    }

    public class FiscalQuarterRange
    {
        public int Quarter { get; }
        public string Name { get; }
        public string NepaliName { get; }
        public BsDate StartBs { get; }
        public BsDate EndBs { get; }
        public AdDate StartAd { get; }
        public AdDate EndAd { get; }

        public FiscalQuarterRange(int quarter, string name, string nepaliName, BsDate startBs, BsDate endBs, AdDate startAd, AdDate endAd)
        {
            Quarter = quarter;
            Name = name;
            NepaliName = nepaliName;
            StartBs = startBs;
            EndBs = endBs;
            StartAd = startAd;
            EndAd = endAd;
        }
    }
}
