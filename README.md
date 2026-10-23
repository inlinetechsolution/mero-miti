<p align="center">
  <a href="https://meromiti.com" target="_blank" rel="noopener noreferrer">
    <img src="https://meromiti.com/app-icon.png" width="96" height="96" alt="Mero Miti Logo" style="border-radius: 20px; box-shadow: 0 4px 14px rgba(0,0,0,0.15);" />
  </a>
</p>

# 🌿 Mero Miti (मेरो मिति)

> A modern, ultra-compact, and vendor-friendly Nepali (Bikram Sambat - B.S.) date picker, converter, and calendar ecosystem.
> 
> **A product of [Inline Tech Solution](https://inlinetech.com.np).**

**Mero Miti** is built to **complement** (never break) existing Gregorian (A.D.) software systems. It provides real-time two-way synchronization between Gregorian and Bikram Sambat dates across Web, Mobile, and Backend platforms.

---

## 🏛️ Ecosystem Architecture & Package Matrix

The **Mero Miti** monorepo organizes packages into three clear tiers:

### 1. 🌐 Frontend UI Components
| Package | Platform / Framework | Directory | Registry | Command |
| :--- | :--- | :--- | :--- | :--- |
| **`@mero-miti/core`** | Universal TS/JS Engine | `packages/core` | npm | `npm i @mero-miti/core` |
| **`mero-miti`** | Standalone CDN Bundle | `packages/web` | npm / CDN | `<script src=".../mero-miti.js">` |
| **`@mero-miti/react`** | React & Next.js | `packages/react` | npm | `npm i @mero-miti/react` |
| **`@mero-miti/vue`** | Vue 3 & Nuxt (`v-model`) | `packages/vue` | npm | `npm i @mero-miti/vue` |
| **`@mero-miti/angular`**| Angular (`ReactiveForms`) | `packages/angular` | npm | `npm i @mero-miti/angular` |

### 2. 📱 Mobile SDKs
| Package | Platform / Framework | Directory | Registry | Command |
| :--- | :--- | :--- | :--- | :--- |
| **`mero_miti`** | Flutter & Dart | `packages/flutter` | pub.dev | `flutter pub add mero_miti` |
| **`@mero-miti/react-native`** | React Native & Expo | `packages/react-native` | npm | `npm i @mero-miti/react-native` |
| **`com.meromiti:android`** | Kotlin & Jetpack Compose | `packages/android` | MavenCentral | `implementation("com.meromiti:android:1.0.0")` |
| **`MeroMiti`** | Swift & SwiftUI (iOS/macOS) | `packages/ios` | Swift PM | `.package(url: ".../mero-miti", from: "1.0.0")` |

### 3. 🏢 Backend & Server Integrations
| Package | Platform / Framework | Directory | Registry | Command |
| :--- | :--- | :--- | :--- | :--- |
| **`mero-miti`** | Python, Django & FastAPI | `packages/python` | PyPI | `pip install mero-miti` |
| **`mero-miti/php`** | PHP & Laravel (Validation Rule)| `packages/php` | Packagist | `composer require mero-miti/php` |
| **`MeroMiti`** | C#, .NET & ASP.NET Core | `packages/dotnet` | NuGet | `dotnet add package MeroMiti` |

---

## ⚡ Quick Start Guides

### Category 1: Frontend UI Components

#### 1. Web & Vanilla HTML (Auto Mode)
Drop one script tag before `</body>`. Mero Miti automatically attaches a synced companion picker next to all date fields:
```html
<!-- Official Self-Hosted Edge CDN (Works immediately, zero npm needed) -->
<script 
  src="https://meromiti.com/mero-miti.js" 
  data-mero-miti-auto="true"
  data-mero-miti-auto-sync="true"
  data-mero-miti-format="DD/MM/YYYY">
</script>
```

#### 2. Manual Attachment (JavaScript)
```javascript
import MeroMiti from 'mero-miti';

// Links to an existing Gregorian field
MeroMiti.attach('#dob_field', {
  format: 'DD/MM/YYYY',
  position: 'right',          // 'right' | 'bottom'
  theme: 'auto',              // 'auto' | 'light' | 'dark'
  numeral: 'en'               // 'en' (19/05/2081) or 'ne' (१९/०५/२०८१)
});
```

#### 3. React & Next.js
```tsx
import { MeroMitiPicker } from '@mero-miti/react';

<MeroMitiPicker
  value={nepaliDate}
  onChange={(bsDateStr, adDateStr) => {
    console.log("BS:", bsDateStr, "AD:", adDateStr);
  }}
  format="DD/MM/YYYY"
/>
```

#### 4. Vue 3 & Nuxt
```vue
<script setup>
import { ref } from 'vue';
import { MeroMitiPicker } from '@mero-miti/vue';
const nepaliDate = ref('2081/05/19');
</script>

<template>
  <MeroMitiPicker
    v-model="nepaliDate"
    label="जन्म मिति"
    format="DD/MM/YYYY"
    @change="(bs, ad) => console.log(bs, ad)"
  />
</template>
```

#### 5. Angular (Reactive Forms)
```html
<mero-miti-picker
  formControlName="dob"
  label="जन्म मिति"
  (dateChange)="onDateChange($event)"
></mero-miti-picker>
```

---

### Category 2: Mobile SDKs

#### 6. Flutter (`pub.dev`)
```dart
import 'package:mero_miti/mero_miti.dart';

// 1. Bottom Sheet Picker Dialog
final result = await showMeroMitiDatePicker(context: context);
if (result != null) {
  print("BS: ${result.bsDate}, AD: ${result.adDate}");
}

// 2. Form Text Field
MeroMitiTextField(
  labelText: 'जन्म मिति (B.S.)',
  onDateChanged: (selection) => handleDate(selection),
)
```

#### 7. React Native & Expo
```tsx
import { MeroMitiMobileInput } from '@mero-miti/react-native';

<MeroMitiMobileInput
  label="जन्म मिति (B.S.)"
  onChange={(bs, ad) => console.log(bs, ad)}
/>
```

#### 8. Android (Kotlin & Jetpack Compose)
```kotlin
import com.meromiti.compose.MeroMitiTextField

MeroMitiTextField(
    value = nepaliDate,
    onValueChange = { nepaliDate = it },
    label = "जन्म मिति",
    onAdDateChange = { gregorian -> syncWithBackend(gregorian) }
)
```

#### 9. iOS (SwiftUI & Swift Package Manager)
```swift
import SwiftUI
import MeroMiti

MeroMitiDateField(
    text: $nepaliDate,
    label: "जन्म मिति",
    onAdDateChange = { gregorian in syncWithBackend(gregorian) }
)
```

---

### Category 3: Backend & Server Integrations

#### 10. Python (Django & FastAPI)
```python
import datetime
from mero_miti import ad_to_bs, bs_to_ad, BsDate

# Conversions
bs_today = ad_to_bs(datetime.date.today())
ad_date = bs_to_ad(BsDate(2081, 5, 19))
```

#### 11. PHP & Laravel
```php
use MeroMiti\MeroMiti;
use MeroMiti\BsDate;

// Conversions
$bsToday = MeroMiti::adToBs(new DateTimeImmutable());
$adDate = MeroMiti::bsToAd(new BsDate(2081, 5, 19));
```
In Laravel Form Request:
```php
public function rules(): array {
    return [
        'dob' => 'required|bs_date:DD/MM/YYYY,ne'
    ];
}
```

#### 12. C# / .NET & ASP.NET Core
```csharp
using MeroMiti;

BsDate bsToday = MeroMitiCore.AdToBs(DateTime.UtcNow);
DateTime adDate = MeroMitiCore.BsToAd(new BsDate(2081, 5, 19));
```
In ASP.NET Core Model:
```csharp
public class UserDto {
    [Required, BsDate(Format = "DD/MM/YYYY")]
    public string DateOfBirthBs { get; set; } = string.Empty;
}
```

---

## 🧠 Key Innovations

1. **Ultra-Compressed 24-bit Encoding**:
   Bikram Sambat months strictly have 29, 30, 31, or 32 days. Encoded in 2 bits per month, 12 months require only **24 bits (3 bytes / 6 hex characters)** per year. 91 years takes under 600 bytes!
2. **Dynamic Year Registration & Cloud Auto-Sync**:
   When official future years are published by Nepal Panchanga Nirnayak Samiti, clients automatically sync newly published years from the cloud API (`https://meromiti.com/api/calendar-years`) without manual code updates:
   ```html
   <!-- Automatically sync new official years from CDN in background -->
   <script src="mero-miti.js" data-mero-miti-auto="true" data-mero-miti-auto-sync="true"></script>
   ```
   Or programmatically:
   ```javascript
   await MeroMiti.syncYears(); // Pulls newest official years into memory
   ```
   Administrators can encode new years in seconds using the CLI tool:
   ```bash
   node scripts/encode-year.js 2085 31 32 31 32 31 30 30 30 29 30 29 31
   # Output: Hex Code "bb9512" (ready for registry)
   ```
3. **Deep Reactivity Bridge**:
   Dispatches prototype DOM events (`input`, `change`) so **React Hook Form**, **Formik**, and **Angular** register updates immediately without custom glue code.
4. **Strict BS Calendar Validation**:
   Rejects non-existent dates (e.g. Baishakh 32 when Baishakh has only 31 days) with a shake animation and inline warning.

---

## 🎨 Interactive Demo
Open [`examples/demo/index.html`](examples/demo/index.html) in your browser to test live two-way sync, error shaking, theme switching, and event logging!

---

## 🏢 About & Maintenance

**Mero Miti** is proudly developed and maintained by **[Inline Tech Solution](https://inlinetech.com.np)**.

- **Website**: [https://inlinetech.com.np](https://inlinetech.com.np)
- **Web App**: [https://meromiti.com](https://meromiti.com)
- **GitHub**: [https://github.com/inlinetechsolution/mero-miti](https://github.com/inlinetechsolution/mero-miti)
- **Inquiries**: [contact@meromiti.com](mailto:contact@meromiti.com)

Licensed under the [MIT License](LICENSE).
