package com.meromiti.core

import java.time.LocalDate
import java.time.temporal.ChronoUnit

data class BsDate(val year: Int, val month: Int, val day: Int) {
    override fun toString(): String = "%04d-%02d-%02d".format(year, month, day)
}

data class AdDate(val year: Int, val month: Int, val day: Int) {
    override fun toString(): String = "%04d-%02d-%02d".format(year, month, day)
}

data class ValidationResult(
    val isValid: Boolean,
    val error: String? = null,
    val parsed: BsDate? = null
)

data class BsFiscalYear(
    val startBsYear: Int,
    val endBsYear: Int = startBsYear + 1,
    val code: String = "$startBsYear/%02d".format(endBsYear % 100),
    val nepaliCode: String = ""
)

data class FiscalYearRange(
    val fiscalYear: BsFiscalYear,
    val startBs: BsDate,
    val endBs: BsDate,
    val startAd: AdDate,
    val endAd: AdDate,
    val startDate: LocalDate,
    val endDate: LocalDate
)

data class FiscalQuarterRange(
    val quarter: Int,
    val name: String,
    val nepaliName: String,
    val startBs: BsDate,
    val endBs: BsDate,
    val startAd: AdDate,
    val endAd: AdDate,
    val startDate: LocalDate,
    val endDate: LocalDate
)

object MeroMitiCore {

    val NEPALI_MONTHS_NP = listOf(
        "बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज",
        "कात्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"
    )

    val NEPALI_MONTHS_EN = listOf(
        "Baishakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
        "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
    )

    val NEPALI_DAYS_SHORT_NP = listOf("आइत", "सोम", "मंगल", "बुध", "बिही", "शुक्र", "शनि")
    val NEPALI_DAYS_SHORT_EN = listOf("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat")

    private val NEPALI_DIGITS = mapOf(
        '0' to '०', '1' to '१', '2' to '२', '3' to '३', '4' to '४',
        '5' to '५', '6' to '६', '7' to '७', '8' to '८', '9' to '९'
    )
    private val ENGLISH_DIGITS = NEPALI_DIGITS.entries.associate { (k, v) -> v to k }

    // Anchor Date: 2080-01-01 BS = 2023-04-14 AD
    private const val ANCHOR_BS_YEAR = 2080
    private const val ANCHOR_BS_MONTH = 1
    private const val ANCHOR_BS_DAY = 1
    private val ANCHOR_AD_DATE = LocalDate.of(2023, 4, 14)

    // 24-bit compressed calendar data: 2 bits per month (00=29, 01=30, 10=31, 11=32)
    // 6 hex characters per year (24 bits = 3 bytes)
    private val COMPRESSED_CALENDAR_DATA = mutableMapOf(
        1973 to "7b9512", 1974 to "ada445", 1975 to "af6445", 1976 to "bb9506", 1977 to "bba112",
        1978 to "aea445", 1979 to "af9445", 1980 to "bb9506", 1981 to "aba145", 1982 to "aea445",
        1983 to "af9445", 1984 to "bb9506", 1985 to "aba145", 1986 to "aea445", 1987 to "bb9445",
        1988 to "bb9506", 1989 to "aba445", 1990 to "aea445", 1991 to "bb9445", 1992 to "bb9512",
        1993 to "aba445", 1994 to "aea445", 1995 to "bb9505", 1996 to "bb9506", 1997 to "aea445",
        1998 to "aed445", 1999 to "bb9506", 2000 to "7b9512", 2001 to "aea445", 2002 to "af9445",
        2003 to "bb9506", 2004 to "7b9512", 2005 to "aea445", 2006 to "af9445", 2007 to "bb9506",
        2008 to "aba142", 2009 to "aea445", 2010 to "af9445", 2011 to "bb9506", 2012 to "aba145",
        2013 to "aea445", 2014 to "af9445", 2015 to "bb9506", 2016 to "aba145", 2017 to "aea445",
        2018 to "bb9445", 2019 to "bb9512", 2020 to "aba445", 2021 to "aea445", 2022 to "bb9505",
        2023 to "bb9512", 2024 to "aba445", 2025 to "aea445", 2026 to "bb9506", 2027 to "7b9512",
        2028 to "aea445", 2029 to "aed445", 2030 to "bb9506", 2031 to "7b9512", 2032 to "aea445",
        2033 to "af9445", 2034 to "bb9506", 2035 to "7ba142", 2036 to "aea445", 2037 to "af9445",
        2038 to "bb9506", 2039 to "aba145", 2040 to "aea445", 2041 to "af9445", 2042 to "bb9506",
        2043 to "aba145", 2044 to "aea445", 2045 to "bb9445", 2046 to "bb9506", 2047 to "aba445",
        2048 to "aea445", 2049 to "bb9505", 2050 to "bb9512", 2051 to "aba445", 2052 to "aea445",
        2053 to "bb9505", 2054 to "bb9512", 2055 to "aea445", 2056 to "aed445", 2057 to "bb9506",
        2058 to "7b9512", 2059 to "aea445", 2060 to "af9445", 2061 to "bb9506", 2062 to "7ba112",
        2063 to "aea445", 2064 to "af9445", 2065 to "bb9506", 2066 to "aba142", 2067 to "aea445",
        2068 to "af9445", 2069 to "bb9506", 2070 to "aba145", 2071 to "aea445", 2072 to "bb9445",
        2073 to "bb9506", 2074 to "aba445", 2075 to "aea445", 2076 to "bb9505", 2077 to "bb9512",
        2078 to "aba445", 2079 to "aea445", 2080 to "bb9505", 2081 to "bb9512", 2082 to "aea445",
        2083 to "aea445", 2084 to "bb9506", 2085 to "7b9512", 2086 to "aea445", 2087 to "aea515",
        2088 to "6f6515", 2089 to "7b9515", 2090 to "7b9515", 2091 to "aea515", 2092 to "6f9515",
        2093 to "7b9515", 2094 to "ae9515", 2095 to "aea455", 2096 to "6f9445", 2097 to "bb9515",
        2098 to "aea112", 2099 to "aea415"
    )

    private val decodedCache = mutableMapOf<Int, IntArray>()

    fun decodeMonthDays(hex: String): IntArray {
        val num = hex.toLong(16)
        val days = IntArray(12)
        for (m in 11 downTo 0) {
            val shift = (11 - m) * 2
            val code = ((num shr shift) and 0x3L).toInt()
            days[m] = 29 + code
        }
        return days
    }

    fun registerYear(year: Int, hexCode: String) {
        COMPRESSED_CALENDAR_DATA[year] = hexCode
        decodedCache.remove(year)
    }

    fun registerYear(year: Int, days: IntArray) {
        require(days.size == 12) { "Days array must contain 12 months" }
        decodedCache[year] = days
    }

    fun getDaysInBsMonth(year: Int, month: Int): Int {
        require(month in 1..12) { "Month must be between 1 and 12" }
        val yearDays = decodedCache.getOrPut(year) {
            val hex = COMPRESSED_CALENDAR_DATA[year]
            if (hex != null) {
                decodeMonthDays(hex)
            } else {
                // Fallback projection for un-registered future/past years
                intArrayOf(31, 31, 31, 32, 31, 30, 30, 30, 29, 30, 29, 30)
            }
        }
        return yearDays[month - 1]
    }

    fun toNepaliDigits(input: Any): String {
        return input.toString().map { NEPALI_DIGITS[it] ?: it }.joinToString("")
    }

    fun toEnglishDigits(input: String): String {
        return input.map { ENGLISH_DIGITS[it] ?: it }.joinToString("")
    }

    fun adToBs(date: LocalDate): BsDate {
        var daysDiff = ChronoUnit.DAYS.between(ANCHOR_AD_DATE, date)

        var curYear = ANCHOR_BS_YEAR
        var curMonth = ANCHOR_BS_MONTH
        var curDay = ANCHOR_BS_DAY

        if (daysDiff >= 0) {
            while (daysDiff > 0) {
                val daysInMonth = getDaysInBsMonth(curYear, curMonth)
                val remainingInMonth = daysInMonth - curDay
                if (daysDiff <= remainingInMonth) {
                    curDay += daysDiff.toInt()
                    daysDiff = 0
                } else {
                    daysDiff -= (remainingInMonth + 1)
                    curDay = 1
                    curMonth++
                    if (curMonth > 12) {
                        curMonth = 1
                        curYear++
                    }
                }
            }
        } else {
            daysDiff = -daysDiff
            while (daysDiff > 0) {
                if (daysDiff < curDay) {
                    curDay -= daysDiff.toInt()
                    daysDiff = 0
                } else {
                    daysDiff -= curDay
                    curMonth--
                    if (curMonth < 1) {
                        curMonth = 12
                        curYear--
                    }
                    val daysInMonth = getDaysInBsMonth(curYear, curMonth)
                    curDay = daysInMonth
                }
            }
        }
        return BsDate(curYear, curMonth, curDay)
    }

    fun bsToAd(bs: BsDate): LocalDate {
        var totalDays = 0L

        if (bs.year >= ANCHOR_BS_YEAR) {
            for (y in ANCHOR_BS_YEAR until bs.year) {
                for (m in 1..12) {
                    totalDays += getDaysInBsMonth(y, m)
                }
            }
            for (m in 1 until bs.month) {
                totalDays += getDaysInBsMonth(bs.year, m)
            }
            totalDays += (bs.day - 1)
            // Subtract offset of anchor (since anchor is day 1)
            return ANCHOR_AD_DATE.plusDays(totalDays)
        } else {
            for (y in (bs.year + 1) until ANCHOR_BS_YEAR) {
                for (m in 1..12) {
                    totalDays += getDaysInBsMonth(y, m)
                }
            }
            for (m in bs.month..12) {
                totalDays += getDaysInBsMonth(bs.year, m)
            }
            totalDays -= (bs.day - 1)
            return ANCHOR_AD_DATE.minusDays(totalDays)
        }
    }

    fun validateBsDate(bs: BsDate, locale: String = "ne"): ValidationResult {
        val (year, month, day) = bs
        val monthNames = if (locale == "ne") NEPALI_MONTHS_NP else NEPALI_MONTHS_EN

        if (year !in 1970..2150) {
            return ValidationResult(
                false,
                if (locale == "ne") "साल १९७० देखि २१५० हुनुपर्छ" else "Year must be 1970 - 2150"
            )
        }
        if (month !in 1..12) {
            return ValidationResult(
                false,
                if (locale == "ne") "महिना १ देखि १२ हुनुपर्छ" else "Month must be 1 - 12"
            )
        }
        val maxDays = getDaysInBsMonth(year, month)
        if (day !in 1..maxDays) {
            val err = if (locale == "ne") {
                "$year साल ${monthNames[month - 1]}मा $maxDays दिन मात्र छन्"
            } else {
                "${monthNames[month - 1]} $year has only $maxDays days"
            }
            return ValidationResult(false, err)
        }
        return ValidationResult(true, parsed = bs)
    }

    fun formatBsDate(
        bs: BsDate,
        format: String = "DD/MM/YYYY",
        numeral: String = "en"
    ): String {
        val pad = { n: Int -> "%02d".format(n) }
        val padYear = "%04d".format(bs.year)
        val padMonth = pad(bs.month)
        val padDay = pad(bs.day)

        var res = format
            .replace("YYYY", padYear)
            .replace("MM", padMonth)
            .replace("DD", padDay)

        if (numeral == "ne") {
            res = toNepaliDigits(res)
        }
        return res
    }

    const val DEFAULT_CALENDAR_ENDPOINT = "https://meromiti.com/api/calendar-years"

    fun bsToLocalDate(bs: BsDate): LocalDate = bsToAd(bs)

    fun bsToAdDate(bs: BsDate): AdDate {
        val ld = bsToAd(bs)
        return AdDate(ld.year, ld.monthValue, ld.dayOfMonth)
    }

    fun syncYears(endpointUrl: String = DEFAULT_CALENDAR_ENDPOINT): Map<Int, String> {
        return try {
            val url = java.net.URL(endpointUrl)
            val connection = url.openConnection() as java.net.HttpURLConnection
            connection.connectTimeout = 5000
            connection.readTimeout = 5000
            connection.setRequestProperty("User-Agent", "MeroMiti-Android/1.0.0")
            if (connection.responseCode == 200) {
                val json = connection.inputStream.bufferedReader().use { it.readText() }
                val yearsRegex = """"(\d{4})":\s*"([0-9a-f]{6})"""".toRegex()
                val resultMap = mutableMapOf<Int, String>()
                yearsRegex.findAll(json).forEach { match ->
                    val yr = match.groupValues[1].toInt()
                    val hex = match.groupValues[2]
                    registerYear(yr, hex)
                    resultMap[yr] = hex
                }
                resultMap
            } else {
                emptyMap()
            }
        } catch (_: Exception) {
            emptyMap()
        }
    }

    fun fetchYearPatch(year: Int, endpointUrl: String = DEFAULT_CALENDAR_ENDPOINT): Boolean {
        return try {
            val fullUrl = if (endpointUrl.contains("?")) "$endpointUrl&year=$year" else "$endpointUrl?year=$year"
            val url = java.net.URL(fullUrl)
            val connection = url.openConnection() as java.net.HttpURLConnection
            connection.connectTimeout = 5000
            connection.readTimeout = 5000
            connection.setRequestProperty("User-Agent", "MeroMiti-Android/1.0.0")
            if (connection.responseCode == 200) {
                val json = connection.inputStream.bufferedReader().use { it.readText() }
                val hexRegex = """"hex":\s*"([0-9a-f]{6})"""".toRegex()
                val match = hexRegex.find(json)
                if (match != null) {
                    val hex = match.groupValues[1]
                    registerYear(year, hex)
                    true
                } else {
                    false
                }
            } else {
                false
            }
        } catch (_: Exception) {
            false
        }
    }

    fun getFiscalYear(bsDate: BsDate? = null): BsFiscalYear {
        val bs = bsDate ?: adToBs(LocalDate.now())
        val startYear = if (bs.month >= 4) bs.year else bs.year - 1
        val endYear = startYear + 1
        val code = "$startYear/%02d".format(endYear % 100)
        return BsFiscalYear(startYear, endYear, code, toNepaliDigits(code))
    }

    fun getFiscalYearRange(startBsYear: Int? = null): FiscalYearRange {
        val startYear = startBsYear ?: getFiscalYear().startBsYear
        val endYear = startYear + 1
        val startBs = BsDate(startYear, 4, 1)
        val lastDay = getDaysInBsMonth(endYear, 3)
        val endBs = BsDate(endYear, 3, lastDay)
        val startDate = bsToAd(startBs)
        val endDate = bsToAd(endBs)
        val startAd = AdDate(startDate.year, startDate.monthValue, startDate.dayOfMonth)
        val endAd = AdDate(endDate.year, endDate.monthValue, endDate.dayOfMonth)
        val fy = getFiscalYear(startBs)
        return FiscalYearRange(
            fy,
            startBs,
            endBs,
            startAd,
            endAd,
            startDate,
            endDate
        )
    }

    fun getFiscalYearQuarters(startBsYear: Int? = null): List<FiscalQuarterRange> {
        val range = getFiscalYearRange(startBsYear)
        val y1 = range.fiscalYear.startBsYear
        val y2 = range.fiscalYear.endBsYear

        val q1EndDay = getDaysInBsMonth(y1, 6)
        val q2EndDay = getDaysInBsMonth(y1, 9)
        val q3EndDay = getDaysInBsMonth(y1, 12)
        val q4EndDay = getDaysInBsMonth(y2, 3)

        val q1StartBs = BsDate(y1, 4, 1)
        val q1EndBs = BsDate(y1, 6, q1EndDay)
        val q2StartBs = BsDate(y1, 7, 1)
        val q2EndBs = BsDate(y1, 9, q2EndDay)
        val q3StartBs = BsDate(y1, 10, 1)
        val q3EndBs = BsDate(y1, 12, q3EndDay)
        val q4StartBs = BsDate(y2, 1, 1)
        val q4EndBs = BsDate(y2, 3, q4EndDay)

        return listOf(
            FiscalQuarterRange(1, "Q1 (Shrawan - Ashwin)", "प्रथम त्रैमासिक (साउन - असोज)", q1StartBs, q1EndBs, bsToAdDate(q1StartBs), bsToAdDate(q1EndBs), bsToLocalDate(q1StartBs), bsToLocalDate(q1EndBs)),
            FiscalQuarterRange(2, "Q2 (Kartik - Poush)", "दोस्रो त्रैमासिक (कात्तिक - पुस)", q2StartBs, q2EndBs, bsToAdDate(q2StartBs), bsToAdDate(q2EndBs), bsToLocalDate(q2StartBs), bsToLocalDate(q2EndBs)),
            FiscalQuarterRange(3, "Q3 (Magh - Chaitra)", "तेस्रो त्रैमासिक (माघ - चैत)", q3StartBs, q3EndBs, bsToAdDate(q3StartBs), bsToAdDate(q3EndBs), bsToLocalDate(q3StartBs), bsToLocalDate(q3EndBs)),
            FiscalQuarterRange(4, "Q4 (Baisakh - Ashadh)", "चौथो त्रैमासिक (बैशाख - असार)", q4StartBs, q4EndBs, bsToAdDate(q4StartBs), bsToAdDate(q4EndBs), bsToLocalDate(q4StartBs), bsToLocalDate(q4EndBs))
        )
    }
}
