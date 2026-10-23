<?php

require_once __DIR__ . '/../src/BsDate.php';
require_once __DIR__ . '/../src/AdDate.php';
require_once __DIR__ . '/../src/BsFiscalYear.php';
require_once __DIR__ . '/../src/FiscalYearRange.php';
require_once __DIR__ . '/../src/FiscalQuarterRange.php';
require_once __DIR__ . '/../src/ValidationResult.php';
require_once __DIR__ . '/../src/MeroMiti.php';

use MeroMiti\MeroMiti;
use MeroMiti\BsDate;

function assertEquals($expected, $actual, $message = '') {
    if ($expected !== $actual) {
        echo "❌ Assertion Failed: Expected " . var_export($expected, true) . ", got " . var_export($actual, true) . ". $message\n";
        exit(1);
    }
}

function assertTrue($condition, $message = '') {
    if (!$condition) {
        echo "❌ Assertion Failed: Condition is not true. $message\n";
        exit(1);
    }
}

echo "--- 1. Testing PHP 24-bit Decompression ---\n";
$days2081 = MeroMiti::decodeMonthDays("bb9512");
$expected = [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31];
assertEquals($expected, $days2081, "bb9512 decoding");
echo "✔ 24-bit decoding passed!\n\n";

echo "--- 2. Testing PHP Conversions ---\n";
// Anchor: 2023-04-14 AD -> 2080-01-01 BS
$anchorAd = new DateTimeImmutable('2023-04-14');
$bsAnchor = MeroMiti::adToBs($anchorAd);
assertEquals(2080, $bsAnchor->year);
assertEquals(1, $bsAnchor->month);
assertEquals(1, $bsAnchor->day);
echo "✔ Anchor AD -> BS passed!\n";

// Known date: 2024-09-04 AD -> 2081-05-19 BS
$knownAd = new DateTimeImmutable('2024-09-04');
$bsKnown = MeroMiti::adToBs($knownAd);
assertEquals(2081, $bsKnown->year);
assertEquals(5, $bsKnown->month);
assertEquals(19, $bsKnown->day);
echo "✔ Known AD -> BS passed!\n";

// Reverse: 2080-01-01 BS -> 2023-04-14 AD
$adAnchor = MeroMiti::bsToAd(new BsDate(2080, 1, 1));
assertEquals('2023-04-14', $adAnchor->format('Y-m-d'));
echo "✔ Anchor BS -> AD passed!\n";

// Reverse: 2081-05-19 BS -> 2024-09-04 AD
$adKnown = MeroMiti::bsToAd(new BsDate(2081, 5, 19));
assertEquals('2024-09-04', $adKnown->format('Y-m-d'));
echo "✔ Known BS -> AD passed!\n\n";

echo "--- 3. Testing PHP Validation & Dynamic Extension ---\n";
MeroMiti::registerYear(2095, "bba445");
$days2095 = MeroMiti::getDaysInBsMonth(2095, 1);
assertEquals(31, $days2095, "Dynamic registerYear");
echo "✔ Dynamic registerYear passed!\n";

$valid = MeroMiti::validateBsDate(new BsDate(2081, 5, 19));
assertTrue($valid->isValid, "Valid date check");

$invalidDay = MeroMiti::validateBsDate(new BsDate(2081, 1, 32));
assertTrue(!$invalidDay->isValid, "Invalid day 32 check");
echo "✔ Validation passed!\n\n";

echo "--- 4. Testing PHP Fiscal Year Calculations ---\n";
$fyRange = MeroMiti::getFiscalYearRange(2081);
assertEquals('2081/82', $fyRange->fiscalYear->code, "Fiscal Year code");
assertEquals(2081, $fyRange->startBs->year, "FY start BS year");
assertEquals(4, $fyRange->startBs->month, "FY start BS month");
assertEquals(1, $fyRange->startBs->day, "FY start BS day");
assertEquals(2082, $fyRange->endBs->year, "FY end BS year");
assertEquals(3, $fyRange->endBs->month, "FY end BS month");
$quarters = MeroMiti::getFiscalYearQuarters(2081);
assertEquals(4, count($quarters), "FY Quarters count");
echo "✔ Fiscal year calculations passed!\n\n";

echo "========================================\n";
echo "🎉 ALL MERO MITI PHP TESTS PASSED!\n";
echo "========================================\n";
