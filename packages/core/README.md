<p align="center">
  <a href="https://meromiti.com" target="_blank" rel="noopener noreferrer">
    <img src="https://meromiti.com/app-icon.png" width="80" height="80" alt="Mero Miti Logo" style="border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
  </a>
</p>

# @meromiti/core

> Ultra-lightweight (< 1 KB data), zero-dependency Bikram Sambat (B.S.) Nepali calendar engine, 24-bit bitmask compression, and bidirectional AD $\leftrightarrow$ BS converter.
>
> **A product of [Inline Tech Solution](https://inlinetech.com.np).**

---

## 📦 Installation

```bash
npm install @meromiti/core
```

---

## 🚀 Usage

### 1. Date Conversion
```typescript
import { adToBs, bsToAd } from '@meromiti/core';

// Gregorian (AD) to Bikram Sambat (BS)
const bs = adToBs(new Date(2024, 8, 4));
// => { year: 2081, month: 5, day: 19 }

// Bikram Sambat (BS) to Gregorian (AD)
const ad = bsToAd({ year: 2081, month: 5, day: 19 });
// => { year: 2024, month: 9, day: 4 }
```

### 2. Nepali Fiscal Year (आर्थिक वर्ष) & Quarters
```typescript
import { getFiscalYear, getFiscalYearRange, getFiscalYearQuarters } from '@meromiti/core';

// Current Fiscal Year
const fy = getFiscalYear();
// => { startBsYear: 2081, endBsYear: 2082, code: '2081/82', nepaliCode: '२०८१/८२' }

// Exact Date Boundaries
const range = getFiscalYearRange(2081);
// => startBs: 2081-04-01 (Shrawan 1), endBs: 2082-03-31 (Ashadh end)

// Financial Quarters (त्रैमासिक)
const quarters = getFiscalYearQuarters(2081);
// Returns Q1 (Shrawan-Ashwin), Q2 (Kartik-Poush), Q3 (Magh-Chaitra), Q4 (Baishakh-Ashadh)
```

### 3. Formatting & Bilingual Localization
```typescript
import { formatBsDate, toNepaliDigits, toEnglishDigits } from '@meromiti/core';

formatBsDate({ year: 2081, month: 5, day: 19 }, { format: 'DD/MM/YYYY', numeral: 'en' });
// => '19/05/2081'

formatBsDate({ year: 2081, month: 5, day: 19 }, { format: 'DD/MM/YYYY', numeral: 'ne' });
// => '१९/०५/२०८१'
```

### 4. Dynamic Year Extension (Future Calendar Support)
```typescript
import { registerYear } from '@meromiti/core';

// Register newly published government calendar year dynamically
registerYear(2095, 'bba445');
```

---

## 📄 License
MIT License - Copyright (c) Inline Tech Solution
