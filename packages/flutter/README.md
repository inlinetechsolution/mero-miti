<p align="center">
  <a href="https://meromiti.com" target="_blank" rel="noopener noreferrer">
    <img src="https://meromiti.com/app-icon.png" width="80" height="80" alt="Mero Miti Logo" style="border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
  </a>
</p>

# Mero Miti Flutter (mero_miti)

> A modern, ultra-compact (< 1 KB data), and vendor-friendly Nepali (Bikram Sambat - B.S.) date picker, converter, and calendar library for Flutter.
> 
> **A product of [Inline Tech Solution](https://inlinetech.com.np).**

---

## 📦 Installation

Add `mero_miti` to your Flutter project's `pubspec.yaml`:

```yaml
dependencies:
  mero_miti: ^1.0.0
```

Or run:
```bash
flutter pub add mero_miti
```

---

## 🚀 Quick Start

### 1. Nepali Date Text Field
```dart
import 'package:flutter/material.dart';
import 'package:mero_miti/mero_miti.dart';

class MyDateScreen extends StatefulWidget {
  @override
  _MyDateScreenState createState() => _MyDateScreenState();
}

class _MyDateScreenState extends State<MyDateScreen> {
  final _controller = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Mero Miti Date Picker')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: MeroMitiTextField(
          controller: _controller,
          labelText: 'जन्म मिति (Date of Birth)',
          locale: 'ne', // 'ne' or 'en'
          onChanged: (bsDate, adDate) {
            print('Selected BS: $bsDate, AD: $adDate');
          },
        ),
      ),
    );
  }
}
```

### 2. Show Modal Date Picker Dialog
```dart
import 'package:mero_miti/mero_miti.dart';

final selected = await showMeroMitiDatePicker(
  context: context,
  initialDate: BsDate(year: 2081, month: 5, day: 19),
  locale: 'ne',
);

if (selected != null) {
  print('Selected BS: ${selected.year}/${selected.month}/${selected.day}');
}
```

### 3. Core Conversions & Fiscal Year
```dart
import 'package:mero_miti/mero_miti.dart';

// AD to BS
final bs = adToBs(DateTime.now());

// BS to AD
final ad = bsToAd(BsDate(year: 2081, month: 5, day: 19));

// Formatting
final formattedEn = formatBsDate(bs, format: 'DD/MM/YYYY', locale: 'en');
final formattedNp = formatBsDate(bs, format: 'DD/MM/YYYY', locale: 'ne');

// Nepali Fiscal Year & Quarters
final fy = getFiscalYear(); // 2081/82
final fyRange = getFiscalYearRange(2081); // Shrawan 1 to Ashadh end
final quarters = getFiscalYearQuarters(2081); // 4 Financial Quarters

// Dynamic year patch registration
registerYear(2095, 'bba445');
```

---

## 📄 License
MIT License - Copyright (c) Inline Tech Solution
