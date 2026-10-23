<?php

namespace MeroMiti;

use DateTimeInterface;
use DateTimeImmutable;
use DateInterval;

class MeroMiti
{
    public const NEPALI_MONTHS_NP = [
        "बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज",
        "कात्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"
    ];

    public const NEPALI_MONTHS_EN = [
        "Baishakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
        "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
    ];

    public const NEPALI_DAYS_SHORT_NP = ["आइत", "सोम", "मंगल", "बुध", "बिही", "शुक्र", "शनि"];
    public const NEPALI_DAYS_SHORT_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    private const NEPALI_DIGITS_MAP = [
        '0' => '०', '1' => '१', '2' => '२', '3' => '३', '4' => '४',
        '5' => '५', '6' => '६', '7' => '७', '8' => '८', '9' => '९'
    ];

    // Anchor: 2080-01-01 BS = 2023-04-14 AD
    private const ANCHOR_BS_YEAR = 2080;
    private const ANCHOR_BS_MONTH = 1;
    private const ANCHOR_BS_DAY = 1;
    private const ANCHOR_AD_DATE = "2023-04-14";

    // 24-bit compressed calendar table
    private static array $compressedCalendarData = [
        1973 => '7b9512', 1974 => 'ada445', 1975 => 'af6445', 1976 => 'bb9506', 1977 => 'bba112',
        1978 => 'aea445', 1979 => 'af9445', 1980 => 'bb9506', 1981 => 'aba145', 1982 => 'aea445',
        1983 => 'af9445', 1984 => 'bb9506', 1985 => 'aba145', 1986 => 'aea445', 1987 => 'bb9445',
        1988 => 'bb9506', 1989 => 'aba445', 1990 => 'aea445', 1991 => 'bb9445', 1992 => 'bb9512',
        1993 => 'aba445', 1994 => 'aea445', 1995 => 'bb9505', 1996 => 'bb9506', 1997 => 'aea445',
        1998 => 'aed445', 1999 => 'bb9506', 2000 => '7b9512', 2001 => 'aea445', 2002 => 'af9445',
        2003 => 'bb9506', 2004 => '7b9512', 2005 => 'aea445', 2006 => 'af9445', 2007 => 'bb9506',
        2008 => 'aba142', 2009 => 'aea445', 2010 => 'af9445', 2011 => 'bb9506', 2012 => 'aba145',
        2013 => 'aea445', 2014 => 'af9445', 2015 => 'bb9506', 2016 => 'aba145', 2017 => 'aea445',
        2018 => 'bb9445', 2019 => 'bb9512', 2020 => 'aba445', 2021 => 'aea445', 2022 => 'bb9505',
        2023 => 'bb9512', 2024 => 'aba445', 2025 => 'aea445', 2026 => 'bb9506', 2027 => '7b9512',
        2028 => 'aea445', 2029 => 'aed445', 2030 => 'bb9506', 2031 => '7b9512', 2032 => 'aea445',
        2033 => 'af9445', 2034 => 'bb9506', 2035 => '7ba142', 2036 => 'aea445', 2037 => 'af9445',
        2038 => 'bb9506', 2039 => 'aba145', 2040 => 'aea445', 2041 => 'af9445', 2042 => 'bb9506',
        2043 => 'aba145', 2044 => 'aea445', 2045 => 'bb9445', 2046 => 'bb9506', 2047 => 'aba445',
        2048 => 'aea445', 2049 => 'bb9505', 2050 => 'bb9512', 2051 => 'aba445', 2052 => 'aea445',
        2053 => 'bb9505', 2054 => 'bb9512', 2055 => 'aea445', 2056 => 'aed445', 2057 => 'bb9506',
        2058 => '7b9512', 2059 => 'aea445', 2060 => 'af9445', 2061 => 'bb9506', 2062 => '7ba112',
        2063 => 'aea445', 2064 => 'af9445', 2065 => 'bb9506', 2066 => 'aba142', 2067 => 'aea445',
        2068 => 'af9445', 2069 => 'bb9506', 2070 => 'aba145', 2071 => 'aea445', 2072 => 'bb9445',
        2073 => 'bb9506', 2074 => 'aba445', 2075 => 'aea445', 2076 => 'bb9505', 2077 => 'bb9512',
        2078 => 'aba445', 2079 => 'aea445', 2080 => 'bb9505', 2081 => 'bb9512', 2082 => 'aea445',
        2083 => 'aea445', 2084 => 'bb9506', 2085 => '7b9512', 2086 => 'aea445', 2087 => 'aea515',
        2088 => '6f6515', 2089 => '7b9515', 2090 => '7b9515', 2091 => 'aea515', 2092 => '6f9515',
        2093 => '7b9515', 2094 => 'ae9515', 2095 => 'aea455', 2096 => '6f9445', 2097 => 'bb9515',
        2098 => 'aea112', 2099 => 'aea415'
    ];

    private static array $decodedCache = [];

    public static function decodeMonthDays(string $hex): array
    {
        $num = hexdec($hex);
        $days = array_fill(0, 12, 0);
        for ($m = 11; $m >= 0; $m--) {
            $shift = (11 - $m) * 2;
            $code = ($num >> $shift) & 0x3;
            $days[$m] = 29 + $code;
        }
        return $days;
    }

    public static function registerYear(int $year, $hexOrDays): void
    {
        if (is_string($hexOrDays)) {
            self::$compressedCalendarData[$year] = $hexOrDays;
            unset(self::$decodedCache[$year]);
        } elseif (is_array($hexOrDays)) {
            if (count($hexOrDays) !== 12) {
                throw new \InvalidArgumentException("Days array must contain exactly 12 months.");
            }
            self::$decodedCache[$year] = $hexOrDays;
        }
    }

    public static function getDaysInBsMonth(int $year, int $month): int
    {
        if ($month < 1 || $month > 12) {
            throw new \InvalidArgumentException("Month must be between 1 and 12.");
        }
        if (!isset(self::$decodedCache[$year])) {
            if (isset(self::$compressedCalendarData[$year])) {
                self::$decodedCache[$year] = self::decodeMonthDays(self::$compressedCalendarData[$year]);
            } else {
                // Fallback projection
                self::$decodedCache[$year] = [31, 31, 31, 32, 31, 30, 30, 30, 29, 30, 29, 30];
            }
        }
        return self::$decodedCache[$year][$month - 1];
    }

    public static function toNepaliDigits($input): string
    {
        $str = (string)$input;
        return strtr($str, self::NEPALI_DIGITS_MAP);
    }

    public static function toEnglishDigits(string $input): string
    {
        $map = array_flip(self::NEPALI_DIGITS_MAP);
        return strtr($input, $map);
    }

    public static function adToBs(DateTimeInterface $adDate): BsDate
    {
        $anchor = new DateTimeImmutable(self::ANCHOR_AD_DATE);
        $adDateImmutable = $adDate instanceof DateTimeImmutable
            ? $adDate
            : new DateTimeImmutable($adDate->format('Y-m-d H:i:s'), $adDate->getTimezone());

        $diff = $anchor->diff($adDateImmutable);
        $daysDiff = (int)$diff->format('%r%a');

        $curYear = self::ANCHOR_BS_YEAR;
        $curMonth = self::ANCHOR_BS_MONTH;
        $curDay = self::ANCHOR_BS_DAY;

        if ($daysDiff >= 0) {
            while ($daysDiff > 0) {
                $daysInMonth = self::getDaysInBsMonth($curYear, $curMonth);
                $remaining = $daysInMonth - $curDay;
                if ($daysDiff <= $remaining) {
                    $curDay += $daysDiff;
                    $daysDiff = 0;
                } else {
                    $daysDiff -= ($remaining + 1);
                    $curDay = 1;
                    $curMonth++;
                    if ($curMonth > 12) {
                        $curMonth = 1;
                        $curYear++;
                    }
                }
            }
        } else {
            $daysDiff = -$daysDiff;
            while ($daysDiff > 0) {
                if ($daysDiff < $curDay) {
                    $curDay -= $daysDiff;
                    $daysDiff = 0;
                } else {
                    $daysDiff -= $curDay;
                    $curMonth--;
                    if ($curMonth < 1) {
                        $curMonth = 12;
                        $curYear--;
                    }
                    $curDay = self::getDaysInBsMonth($curYear, $curMonth);
                }
            }
        }

        return new BsDate($curYear, $curMonth, $curDay);
    }

    public static function bsToAd(BsDate $bs): DateTimeImmutable
    {
        $totalDays = 0;

        if ($bs->year >= self::ANCHOR_BS_YEAR) {
            for ($y = self::ANCHOR_BS_YEAR; $y < $bs->year; $y++) {
                for ($m = 1; $m <= 12; $m++) {
                    $totalDays += self::getDaysInBsMonth($y, $m);
                }
            }
            for ($m = 1; $m < $bs->month; $m++) {
                $totalDays += self::getDaysInBsMonth($bs->year, $m);
            }
            $totalDays += ($bs->day - 1);

            $anchor = new DateTimeImmutable(self::ANCHOR_AD_DATE);
            return $anchor->add(new DateInterval("P{$totalDays}D"));
        } else {
            for ($y = $bs->year + 1; $y < self::ANCHOR_BS_YEAR; $y++) {
                for ($m = 1; $m <= 12; $m++) {
                    $totalDays += self::getDaysInBsMonth($y, $m);
                }
            }
            for ($m = $bs->month; $m <= 12; $m++) {
                $totalDays += self::getDaysInBsMonth($bs->year, $m);
            }
            $totalDays -= ($bs->day - 1);

            $anchor = new DateTimeImmutable(self::ANCHOR_AD_DATE);
            return $anchor->sub(new DateInterval("P{$totalDays}D"));
        }
    }

    public static function validateBsDate(BsDate $bs, string $locale = 'ne'): ValidationResult
    {
        $monthNames = $locale === 'ne' ? self::NEPALI_MONTHS_NP : self::NEPALI_MONTHS_EN;

        if ($bs->year < 1970 || $bs->year > 2150) {
            $err = $locale === 'ne' ? 'साल १९७० देखि २१५० हुनुपर्छ' : 'Year must be 1970 - 2150';
            return new ValidationResult(false, $err);
        }

        if ($bs->month < 1 || $bs->month > 12) {
            $err = $locale === 'ne' ? 'महिना १ देखि १२ हुनुपर्छ' : 'Month must be 1 - 12';
            return new ValidationResult(false, $err);
        }

        $maxDays = self::getDaysInBsMonth($bs->year, $bs->month);
        if ($bs->day < 1 || $bs->day > $maxDays) {
            $err = $locale === 'ne'
                ? "{$bs->year} साल {$monthNames[$bs->month - 1]}मा {$maxDays} दिन मात्र छन्"
                : "{$monthNames[$bs->month - 1]} {$bs->year} has only {$maxDays} days";
            return new ValidationResult(false, $err);
        }

        return new ValidationResult(true, null, $bs);
    }

    public static function formatBsDate(BsDate $bs, string $format = 'DD/MM/YYYY', string $numeral = 'en'): string
    {
        $padYear = sprintf('%04d', $bs->year);
        $padMonth = sprintf('%02d', $bs->month);
        $padDay = sprintf('%02d', $bs->day);

        $res = str_replace(
            ['YYYY', 'MM', 'DD'],
            [$padYear, $padMonth, $padDay],
            $format
        );

        if ($numeral === 'ne') {
            $res = self::toNepaliDigits($res);
        }

        return $res;
    }

    public static function parseBsDate(string $dateStr, string $format = 'DD/MM/YYYY', string $locale = 'ne'): ValidationResult
    {
        if (trim($dateStr) === '') {
            return new ValidationResult(false, 'Date string is empty');
        }

        $normalized = self::toEnglishDigits(trim($dateStr));
        $sep = strpos($format, '.') !== false ? '.' : (strpos($format, '-') !== false ? '-' : '/');

        $parts = explode($sep, $normalized);
        $fmtParts = explode($sep, $format);

        if (count($parts) !== 3 || count($fmtParts) !== 3) {
            return new ValidationResult(false, "Format must match {$format}");
        }

        $y = 0; $m = 0; $d = 0;
        for ($i = 0; $i < 3; $i++) {
            $f = strtoupper($fmtParts[$i]);
            $val = (int)$parts[$i];
            if (strpos($f, 'Y') === 0) $y = $val;
            elseif (strpos($f, 'M') === 0) $m = $val;
            elseif (strpos($f, 'D') === 0) $d = $val;
        }

        return self::validateBsDate(new BsDate($y, $m, $d), $locale);
    }

    public const DEFAULT_CALENDAR_ENDPOINT = "https://meromiti.com/api/calendar-years";

    public static function syncYears(string $endpointUrl = self::DEFAULT_CALENDAR_ENDPOINT): array
    {
        try {
            $context = stream_context_create([
                'http' => [
                    'timeout' => 5,
                    'user_agent' => 'MeroMiti-PHP/1.0.0'
                ]
            ]);
            $json = @file_get_contents($endpointUrl, false, $context);
            if ($json !== false) {
                $data = json_decode($json, true);
                if (isset($data['years']) && is_array($data['years'])) {
                    foreach ($data['years'] as $yr => $hex) {
                        self::registerYear((int)$yr, $hex);
                    }
                    return $data['years'];
                }
            }
        } catch (\Throwable $e) {
            // Graceful fallback
        }
        return [];
    }

    public static function fetchYearPatch(int $year, string $endpointUrl = self::DEFAULT_CALENDAR_ENDPOINT): bool
    {
        try {
            $url = strpos($endpointUrl, '?') !== false
                ? "{$endpointUrl}&year={$year}"
                : "{$endpointUrl}?year={$year}";
            $context = stream_context_create([
                'http' => [
                    'timeout' => 5,
                    'user_agent' => 'MeroMiti-PHP/1.0.0'
                ]
            ]);
            $json = @file_get_contents($url, false, $context);
            if ($json !== false) {
                $data = json_decode($json, true);
                if (!empty($data['hex'])) {
                    self::registerYear($year, $data['hex']);
                    return true;
                }
            }
        } catch (\Throwable $e) {
            // Graceful fallback
        }
        return false;
    }

    public static function bsToAdDate(BsDate $bs): AdDate
    {
        $dt = self::bsToAd($bs);
        return new AdDate((int)$dt->format('Y'), (int)$dt->format('n'), (int)$dt->format('j'));
    }

    public static function getFiscalYear(?BsDate $bs = null): BsFiscalYear
    {
        if ($bs === null) {
            $bs = self::adToBs(new DateTimeImmutable());
        }
        $startYear = $bs->month >= 4 ? $bs->year : $bs->year - 1;
        $endYear = $startYear + 1;
        $code = sprintf('%d/%02d', $startYear, $endYear % 100);
        return new BsFiscalYear($startYear, $endYear, $code, self::toNepaliDigits($code));
    }

    public static function getFiscalYearRange(?int $startBsYear = null): FiscalYearRange
    {
        $startYear = $startBsYear ?? self::getFiscalYear()->startBsYear;
        $endYear = $startYear + 1;

        $startBs = new BsDate($startYear, 4, 1);
        $lastDay = self::getDaysInBsMonth($endYear, 3);
        $endBs = new BsDate($endYear, 3, $lastDay);

        $startDate = self::bsToAd($startBs);
        $endDate = self::bsToAd($endBs);

        $startAd = new AdDate((int)$startDate->format('Y'), (int)$startDate->format('n'), (int)$startDate->format('j'));
        $endAd = new AdDate((int)$endDate->format('Y'), (int)$endDate->format('n'), (int)$endDate->format('j'));

        $fy = self::getFiscalYear($startBs);

        return new FiscalYearRange(
            $fy,
            $startBs,
            $endBs,
            $startAd,
            $endAd,
            $startDate,
            $endDate
        );
    }

    public static function getFiscalYearQuarters(?int $startBsYear = null): array
    {
        $range = self::getFiscalYearRange($startBsYear);
        $y1 = $range->fiscalYear->startBsYear;
        $y2 = $range->fiscalYear->endBsYear;

        $q1End = self::getDaysInBsMonth($y1, 6);
        $q2End = self::getDaysInBsMonth($y1, 9);
        $q3End = self::getDaysInBsMonth($y1, 12);
        $q4End = self::getDaysInBsMonth($y2, 3);

        $q1BsS = new BsDate($y1, 4, 1);
        $q1BsE = new BsDate($y1, 6, $q1End);
        $q2BsS = new BsDate($y1, 7, 1);
        $q2BsE = new BsDate($y1, 9, $q2End);
        $q3BsS = new BsDate($y1, 10, 1);
        $q3BsE = new BsDate($y1, 12, $q3End);
        $q4BsS = new BsDate($y2, 1, 1);
        $q4BsE = new BsDate($y2, 3, $q4End);

        return [
            new FiscalQuarterRange(1, "Q1 (Shrawan - Ashwin)", "प्रथम त्रैमासिक (साउन - असोज)", $q1BsS, $q1BsE, self::bsToAdDate($q1BsS), self::bsToAdDate($q1BsE)),
            new FiscalQuarterRange(2, "Q2 (Kartik - Poush)", "दोस्रो त्रैमासिक (कात्तिक - पुस)", $q2BsS, $q2BsE, self::bsToAdDate($q2BsS), self::bsToAdDate($q2BsE)),
            new FiscalQuarterRange(3, "Q3 (Magh - Chaitra)", "तेस्रो त्रैमासिक (माघ - चैत)", $q3BsS, $q3BsE, self::bsToAdDate($q3BsS), self::bsToAdDate($q3BsE)),
            new FiscalQuarterRange(4, "Q4 (Baisakh - Ashadh)", "चौथो त्रैमासिक (बैशाख - असार)", $q4BsS, $q4BsE, self::bsToAdDate($q4BsS), self::bsToAdDate($q4BsE))
        ];
    }
}
