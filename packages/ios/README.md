<p align="center">
  <a href="https://meromiti.com" target="_blank" rel="noopener noreferrer">
    <img src="https://meromiti.com/app-icon.png" width="80" height="80" alt="Mero Miti Logo" style="border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
  </a>
</p>

# Mero Miti iOS (Swift & SwiftUI)

The official **Mero Miti (मेरो मिति)** native library for iOS and macOS, featuring ultra-compressed 24-bit Bikram Sambat calendar data (< 1 KB), two-way AD $\leftrightarrow$ BS conversions, and modern SwiftUI picker views.

---

## 📦 Installation via Swift Package Manager (SPM)

Add Mero Miti to your `Package.swift`:
```swift
dependencies: [
    .package(path: "path/to/mero-miti/packages/ios")
]
```
Or in Xcode:
1. File $\rightarrow$ Add Package Dependencies...
2. Enter local or repository URL.

---

## 🚀 Usage

### 1. SwiftUI Date Field
```swift
import SwiftUI
import MeroMiti

struct ContentView: View {
    @State private var dateText = "2081/05/19"

    var body: some View {
        MeroMitiDateField(
            text: $dateText,
            label: "जन्म मिति (Date of Birth)",
            locale: "ne", // or "en"
            onAdDateChange: { gregorianDate in
                print("Synchronized Gregorian Date: \(gregorianDate)")
            }
        )
    }
}
```

### 2. SwiftUI Standalone Date Picker View
```swift
@State private var selectedBsDate = BsDate(year: 2081, month: 5, day: 19)

MeroMitiDatePicker(
    selectedDate: $selectedBsDate,
    locale: "ne",
    onSelect: { bs in
        print("Selected: \(bs.year)/\(bs.month)/\(bs.day)")
    }
)
```

### 3. Core Conversions & Dynamic Year Extension
```swift
import MeroMiti

// AD to BS
let bs = MeroMitiCore.adToBs(date: Date())

// BS to AD
let ad = MeroMitiCore.bsToAd(bs: BsDate(year: 2081, month: 5, day: 19))

// Nepali Fiscal Year & Quarters
let fy = MeroMitiCore.getFiscalYear() // "2081/82"
let fyRange = MeroMitiCore.getFiscalYearRange(startBsYear: 2081) // Shrawan 1 to Ashadh end
let quarters = MeroMitiCore.getFiscalYearQuarters(startBsYear: 2081) // 4 quarters

// Runtime registration for newly published future years
MeroMitiCore.registerYear(year: 2095, hexCode: "bba445")
```
