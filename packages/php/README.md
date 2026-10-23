<p align="center">
  <a href="https://meromiti.com" target="_blank" rel="noopener noreferrer">
    <img src="https://meromiti.com/app-icon.png" width="80" height="80" alt="Mero Miti Logo" style="border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
  </a>
</p>

# Mero Miti PHP & Laravel (`meromiti/meromiti`)

Official **Mero Miti (मेरो मिति)** library for PHP and Laravel applications. Features ultra-compressed 24-bit Bikram Sambat calendar data (< 1 KB), bidirectional AD $\leftrightarrow$ BS conversions, runtime dynamic year registration, and Laravel validation rules.

---

## 📦 Installation

```bash
composer require meromiti/meromiti
```

---

## 🚀 Quick Start

### 1. Basic Conversions
```php
use MeroMiti\MeroMiti;
use MeroMiti\BsDate;

// Gregorian (A.D.) to Bikram Sambat (B.S.)
$todayBs = MeroMiti::adToBs(new DateTimeImmutable());
echo $todayBs; // 2081-05-19
echo MeroMiti::formatBsDate($todayBs, 'DD/MM/YYYY', 'ne'); // १९/०५/२०८१

// Bikram Sambat (B.S.) to Gregorian (A.D.)
$adDate = MeroMiti::bsToAd(new BsDate(2081, 5, 19));
echo $adDate->format('Y-m-d'); // 2024-09-04
```

### 2. Nepali Fiscal Year (आर्थिक वर्ष) & Quarters
```php
// Current Fiscal Year
$fy = MeroMiti::getFiscalYear();
echo $fy->code;       // "2081/82"
echo $fy->nepaliCode; // "२०८१/८२"

// Exact Gregorian & BS Boundaries
$range = MeroMiti::getFiscalYearRange(2081);
echo $range->startBs;  // 2081-04-01 (Shrawan 1)
echo $range->endBs;    // 2082-03-31 (Ashadh end)

// Financial Quarters (त्रैमासिक)
$quarters = MeroMiti::getFiscalYearQuarters(2081);
foreach ($quarters as $q) {
    echo "{$q->name}: {$q->startBs} to {$q->endBs}\n";
}
```

### 3. Strict Calendar Validation
```php
$result = MeroMiti::validateBsDate(new BsDate(2081, 1, 32), 'ne');
if (!$result->isValid) {
    echo $result->error; // 2081 साल बैशाखमा 31 दिन मात्र छन्
}
```

### 3. Laravel Form Request Validation
In your Laravel Form Request or Controller:
```php
use MeroMiti\Laravel\ValidBsDate;

public function rules(): array
{
    return [
        'name' => 'required|string',
        // Using custom rule class:
        'dob' => ['required', new ValidBsDate('DD/MM/YYYY', 'ne')],
        // Or using shorthand directive:
        'issue_date' => 'required|bs_date:DD/MM/YYYY,ne',
    ];
}
```

### 4. Dynamic Runtime Year Extension
```php
// Register newly published calendar year at runtime
MeroMiti::registerYear(2095, "bba445");
```
