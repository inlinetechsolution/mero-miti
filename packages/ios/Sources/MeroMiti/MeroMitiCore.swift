import Foundation

public struct BsDate: Equatable, Hashable, CustomStringConvertible {
    public var year: Int
    public var month: Int
    public var day: Int

    public init(year: Int, month: Int, day: Int) {
        self.year = year
        self.month = month
        self.day = day
    }

    public var description: String {
        return String(format: "%04d-%02d-%02d", year, month, day)
    }
}

public struct AdDate: Equatable, Hashable, CustomStringConvertible {
    public var year: Int
    public var month: Int
    public var day: Int

    public init(year: Int, month: Int, day: Int) {
        self.year = year
        self.month = month
        self.day = day
    }

    public var description: String {
        return String(format: "%04d-%02d-%02d", year, month, day)
    }
}

public struct ValidationResult {
    public let isValid: BooleanLiteralType
    public let error: String?
    public let parsed: BsDate?

    public init(isValid: Bool, error: String? = nil, parsed: BsDate? = nil) {
        self.isValid = isValid
        self.error = error
        self.parsed = parsed
    }
}

public struct BsFiscalYear: Equatable, Hashable {
    public let startBsYear: Int
    public let endBsYear: Int
    public let code: String
    public let nepaliCode: String

    public init(startBsYear: Int, endBsYear: Int, code: String, nepaliCode: String) {
        self.startBsYear = startBsYear
        self.endBsYear = endBsYear
        self.code = code
        self.nepaliCode = nepaliCode
    }
}

public struct FiscalYearRange {
    public let fiscalYear: BsFiscalYear
    public let startBs: BsDate
    public let endBs: BsDate
    public let startAd: AdDate
    public let endAd: AdDate
    public let startDate: Date
    public let endDate: Date

    public init(fiscalYear: BsFiscalYear, startBs: BsDate, endBs: BsDate, startAd: AdDate, endAd: AdDate, startDate: Date, endDate: Date) {
        self.fiscalYear = fiscalYear
        self.startBs = startBs
        self.endBs = endBs
        self.startAd = startAd
        self.endAd = endAd
        self.startDate = startDate
        self.endDate = endDate
    }
}

public struct FiscalQuarterRange {
    public let quarter: Int
    public let name: String
    public let nepaliName: String
    public let startBs: BsDate
    public let endBs: BsDate
    public let startAd: AdDate
    public let endAd: AdDate

    public init(quarter: Int, name: String, nepaliName: String, startBs: BsDate, endBs: BsDate, startAd: AdDate, endAd: AdDate) {
        self.quarter = quarter
        self.name = name
        self.nepaliName = nepaliName
        self.startBs = startBs
        self.endBs = endBs
        self.startAd = startAd
        self.endAd = endAd
    }
}

public final class MeroMitiCore {
    public static let shared = MeroMitiCore()

    public static let nepaliMonthsNp = [
        "बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज",
        "कात्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"
    ]

    public static let nepaliMonthsEn = [
        "Baishakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
        "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
    ]

    public static let nepaliDaysShortNp = ["आइत", "सोम", "मंगल", "बुध", "बिही", "शुक्र", "शनि"]
    public static let nepaliDaysShortEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    private static let nepaliDigitsMap: [Character: Character] = [
        "0": "०", "1": "१", "2": "२", "3": "३", "4": "४",
        "5": "५", "6": "६", "7": "७", "8": "८", "9": "९"
    ]
    private static let englishDigitsMap: [Character: Character] = {
        var map = [Character: Character]()
        for (k, v) in nepaliDigitsMap { map[v] = k }
        return map
    }()

    // Anchor: 2080-01-01 BS = 2023-04-14 AD (UTC)
    private static let anchorBsYear = 2080
    private static let anchorBsMonth = 1
    private static let anchorBsDay = 1
    private static let anchorAdDate: Date = {
        var comps = DateComponents()
        comps.year = 2023
        comps.month = 4
        comps.day = 14
        comps.timeZone = TimeZone(secondsFromGMT: 0)
        return Calendar(identifier: .gregorian).date(from: comps)!
    }()

    // 24-bit compressed calendar data (2 bits/month, 6 hex chars per year)
    private static var compressedCalendarData: [Int: String] = [
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
    ]

    private static var decodedCache = [Int: [Int]]()

    public static func decodeMonthDays(hex: String) -> [Int] {
        guard let num = UInt64(hex, radix: 16) else {
            return Array(repeating: 30, count: 12)
        }
        var days = [Int](repeating: 0, count: 12)
        for m in stride(from: 11, through: 0, by: -1) {
            let shift = (11 - m) * 2
            let code = Int((num >> shift) & 0x3)
            days[m] = 29 + code
        }
        return days
    }

    public static let DEFAULT_CALENDAR_ENDPOINT = "https://meromiti.com/api/calendar-years"

    @available(iOS 15.0, macOS 12.0, watchOS 8.0, *)
    public static func syncYears(endpointUrl: String = DEFAULT_CALENDAR_ENDPOINT) async -> [Int: String] {
        guard let url = URL(string: endpointUrl) else { return [:] }
        var request = URLRequest(url: url)
        request.setValue("MeroMiti-iOS/1.0.0", forHTTPHeaderField: "User-Agent")
        request.timeoutInterval = 5
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            guard (response as? HTTPURLResponse)?.statusCode == 200 else { return [:] }
            if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
               let years = json["years"] as? [String: String] {
                var result: [Int: String] = [:]
                for (yrStr, hex) in years {
                    if let yr = Int(yrStr) {
                        registerYear(year: yr, hexCode: hex)
                        result[yr] = hex
                    }
                }
                return result
            }
        } catch {
            // Graceful fallback
        }
        return [:]
    }

    @available(iOS 15.0, macOS 12.0, watchOS 8.0, *)
    public static func fetchYearPatch(year: Int, endpointUrl: String = DEFAULT_CALENDAR_ENDPOINT) async -> Bool {
        let separator = endpointUrl.contains("?") ? "&" : "?"
        guard let url = URL(string: "\(endpointUrl)\(separator)year=\(year)") else { return false }
        var request = URLRequest(url: url)
        request.setValue("MeroMiti-iOS/1.0.0", forHTTPHeaderField: "User-Agent")
        request.timeoutInterval = 5
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            guard (response as? HTTPURLResponse)?.statusCode == 200 else { return false }
            if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
               let hex = json["hex"] as? String {
                registerYear(year: year, hexCode: hex)
                return true
            }
        } catch {
            // Graceful fallback
        }
        return false
    }

    public static func registerYear(year: Int, hexCode: String) {
        compressedCalendarData[year] = hexCode
        decodedCache.removeValue(forKey: year)
    }

    public static func registerYear(year: Int, days: [Int]) {
        precondition(days.count == 12, "Days array must contain 12 months")
        decodedCache[year] = days
    }

    public static func getDaysInBsMonth(year: Int, month: Int) -> Int {
        precondition(month >= 1 && month <= 12, "Month must be between 1 and 12")
        if let cached = decodedCache[year] {
            return cached[month - 1]
        }
        if let hex = compressedCalendarData[year] {
            let days = decodeMonthDays(hex: hex)
            decodedCache[year] = days
            return days[month - 1]
        }
        // Fallback projection for un-registered future/past years
        return [31, 31, 31, 32, 31, 30, 30, 30, 29, 30, 29, 30][month - 1]
    }

    public static func toNepaliDigits(_ input: String) -> String {
        return String(input.map { nepaliDigitsMap[$0] ?? $0 })
    }

    public static func toEnglishDigits(_ input: String) -> String {
        return String(input.map { englishDigitsMap[$0] ?? $0 })
    }

    public static func adToBs(date: Date) -> BsDate {
        let cal = Calendar(identifier: .gregorian)
        let d1 = cal.startOfDay(for: anchorAdDate)
        let d2 = cal.startOfDay(for: date)
        var daysDiff = cal.dateComponents([.day], from: d1, to: d2).day ?? 0

        var curYear = anchorBsYear
        var curMonth = anchorBsMonth
        var curDay = anchorBsDay

        if daysDiff >= 0 {
            while daysDiff > 0 {
                let daysInMonth = getDaysInBsMonth(year: curYear, month: curMonth)
                let remainingInMonth = daysInMonth - curDay
                if daysDiff <= remainingInMonth {
                    curDay += daysDiff
                    daysDiff = 0
                } else {
                    daysDiff -= (remainingInMonth + 1)
                    curDay = 1
                    curMonth += 1
                    if curMonth > 12 {
                        curMonth = 1
                        curYear += 1
                    }
                }
            }
        } else {
            daysDiff = -daysDiff
            while daysDiff > 0 {
                if daysDiff < curDay {
                    curDay -= daysDiff
                    daysDiff = 0
                } else {
                    daysDiff -= curDay
                    curMonth -= 1
                    if curMonth < 1 {
                        curMonth = 12
                        curYear -= 1
                    }
                    let daysInMonth = getDaysInBsMonth(year: curYear, month: curMonth)
                    curDay = daysInMonth
                }
            }
        }
        return BsDate(year: curYear, month: curMonth, day: curDay)
    }

    public static func bsToAd(bs: BsDate) -> Date {
        var totalDays = 0

        if bs.year >= anchorBsYear {
            for y in anchorBsYear..<bs.year {
                for m in 1...12 {
                    totalDays += getDaysInBsMonth(year: y, month: m)
                }
            }
            for m in 1..<bs.month {
                totalDays += getDaysInBsMonth(year: bs.year, month: m)
            }
            totalDays += (bs.day - 1)
            return Calendar(identifier: .gregorian).date(byAdding: .day, value: totalDays, to: anchorAdDate)!
        } else {
            for y in (bs.year + 1)..<anchorBsYear {
                for m in 1...12 {
                    totalDays += getDaysInBsMonth(year: y, month: m)
                }
            }
            for m in bs.month...12 {
                totalDays += getDaysInBsMonth(year: bs.year, month: m)
            }
            totalDays -= (bs.day - 1)
            return Calendar(identifier: .gregorian).date(byAdding: .day, value: -totalDays, to: anchorAdDate)!
        }
    }

    public static func validateBsDate(bs: BsDate, locale: String = "ne") -> ValidationResult {
        let (year, month, day) = (bs.year, bs.month, bs.day)
        let monthNames = locale == "ne" ? nepaliMonthsNp : nepaliMonthsEn

        if year < 1970 || year > 2150 {
            return ValidationResult(
                isValid: false,
                error: locale == "ne" ? "साल १९७० देखि २१५० हुनुपर्छ" : "Year must be 1970 - 2150"
            )
        }
        if month < 1 || month > 12 {
            return ValidationResult(
                isValid: false,
                error: locale == "ne" ? "महिना १ देखि १२ हुनुपर्छ" : "Month must be 1 - 12"
            )
        }
        let maxDays = getDaysInBsMonth(year: year, month: month)
        if day < 1 || day > maxDays {
            let err = locale == "ne"
                ? "\(year) साल \(monthNames[month - 1])मा \(maxDays) दिन मात्र छन्"
                : "\(monthNames[month - 1]) \(year) has only \(maxDays) days"
            return ValidationResult(isValid: false, error: err)
        }
        return ValidationResult(isValid: true, parsed: bs)
    }

    public static func formatBsDate(
        bs: BsDate,
        format: String = "DD/MM/YYYY",
        numeral: String = "en"
    ) -> String {
        let padMonth = String(format: "%02d", bs.month)
        let padDay = String(format: "%02d", bs.day)
        let padYear = String(format: "%04d", bs.year)

        var res = format
            .replacingOccurrences(of: "YYYY", with: padYear)
            .replacingOccurrences(of: "MM", with: padMonth)
            .replacingOccurrences(of: "DD", with: padDay)

        if numeral == "ne" {
            res = toNepaliDigits(res)
        }
        return res
    }

    public static func getFiscalYear(bsDate: BsDate? = nil) -> BsFiscalYear {
        let bs = bsDate ?? adToBs(date: Date())
        let startYear = bs.month >= 4 ? bs.year : bs.year - 1
        let endYear = startYear + 1
        let code = String(format: "%d/%02d", startYear, endYear % 100)
        return BsFiscalYear(startBsYear: startYear, endBsYear: endYear, code: code, nepaliCode: toNepaliDigits(code))
    }

    public static func getFiscalYearRange(startBsYear: Int? = nil) -> FiscalYearRange {
        let startYear = startBsYear ?? getFiscalYear().startBsYear
        let endYear = startYear + 1
        let startBs = BsDate(year: startYear, month: 4, day: 1)
        let lastDay = getDaysInBsMonth(year: endYear, month: 3)
        let endBs = BsDate(year: endYear, month: 3, day: lastDay)
        let startAd = bsToAd(bs: startBs)
        let endAd = bsToAd(bs: endBs)
        let fy = getFiscalYear(bsDate: startBs)

        let cal = Calendar(identifier: .gregorian)
        var c1 = DateComponents()
        c1.year = startAd.year
        c1.month = startAd.month
        c1.day = startAd.day
        let startDate = cal.date(from: c1) ?? Date()

        var c2 = DateComponents()
        c2.year = endAd.year
        c2.month = endAd.month
        c2.day = endAd.day
        let endDate = cal.date(from: c2) ?? Date()

        return FiscalYearRange(
            fiscalYear: fy,
            startBs: startBs,
            endBs: endBs,
            startAd: startAd,
            endAd: endAd,
            startDate: startDate,
            endDate: endDate
        )
    }

    public static func getFiscalYearQuarters(startBsYear: Int? = nil) -> [FiscalQuarterRange] {
        let range = getFiscalYearRange(startBsYear: startBsYear)
        let y1 = range.fiscalYear.startBsYear
        let y2 = range.fiscalYear.endBsYear

        let q1EndDay = getDaysInBsMonth(year: y1, month: 6)
        let q2EndDay = getDaysInBsMonth(year: y1, month: 9)
        let q3EndDay = getDaysInBsMonth(year: y1, month: 12)
        let q4EndDay = getDaysInBsMonth(year: y2, month: 3)

        let q1StartBs = BsDate(year: y1, month: 4, day: 1)
        let q1EndBs = BsDate(year: y1, month: 6, day: q1EndDay)
        let q2StartBs = BsDate(year: y1, month: 7, day: 1)
        let q2EndBs = BsDate(year: y1, month: 9, day: q2EndDay)
        let q3StartBs = BsDate(year: y1, month: 10, day: 1)
        let q3EndBs = BsDate(year: y1, month: 12, day: q3EndDay)
        let q4StartBs = BsDate(year: y2, month: 1, day: 1)
        let q4EndBs = BsDate(year: y2, month: 3, day: q4EndDay)

        return [
            FiscalQuarterRange(quarter: 1, name: "Q1 (Shrawan - Ashwin)", nepaliName: "प्रथम त्रैमासिक (साउन - असोज)", startBs: q1StartBs, endBs: q1EndBs, startAd: bsToAd(bs: q1StartBs), endAd: bsToAd(bs: q1EndBs)),
            FiscalQuarterRange(quarter: 2, name: "Q2 (Kartik - Poush)", nepaliName: "दोस्रो त्रैमासिक (कात्तिक - पुस)", startBs: q2StartBs, endBs: q2EndBs, startAd: bsToAd(bs: q2StartBs), endAd: bsToAd(bs: q2EndBs)),
            FiscalQuarterRange(quarter: 3, name: "Q3 (Magh - Chaitra)", nepaliName: "तेस्रो त्रैमासिक (माघ - चैत)", startBs: q3StartBs, endBs: q3EndBs, startAd: bsToAd(bs: q3StartBs), endAd: bsToAd(bs: q3EndBs)),
            FiscalQuarterRange(quarter: 4, name: "Q4 (Baisakh - Ashadh)", nepaliName: "चौथो त्रैमासिक (बैशाख - असार)", startBs: q4StartBs, endBs: q4EndBs, startAd: bsToAd(bs: q4StartBs), endAd: bsToAd(bs: q4EndBs))
        ]
    }
}
