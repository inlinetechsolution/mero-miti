<p align="center">
  <a href="https://meromiti.com" target="_blank" rel="noopener noreferrer">
    <img src="https://meromiti.com/app-icon.png" width="80" height="80" alt="Mero Miti Logo" style="border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
  </a>
</p>

# Mero Miti Android (Kotlin & Jetpack Compose)

The official **Mero Miti (मेरो मिति)** native library for Android, featuring ultra-compressed 24-bit Bikram Sambat calendar data (< 1 KB), two-way AD $\leftrightarrow$ BS conversions, and modern Jetpack Compose UI components.

---

## 📦 Installation

In your Android project's `settings.gradle.kts`:
```kotlin
include(":mero-miti-android")
project(":mero-miti-android").projectDir = file("path/to/mero-miti/packages/android")
```

In your module's `build.gradle.kts`:
```kotlin
dependencies {
    implementation(project(":mero-miti-android"))
}
```

---

## 🚀 Usage

### 1. Jetpack Compose Date Field
```kotlin
var nepaliDateText by remember { mutableStateOf("2081/05/19") }

MeroMitiTextField(
    value = nepaliDateText,
    onValueChange = { nepaliDateText = it },
    label = "जन्म मिति (Date of Birth)",
    locale = "ne", // or "en"
    onAdDateChange = { gregorianDate ->
        println("Synchronized Gregorian Date: $gregorianDate")
    }
)
```

### 2. Standalone Date Picker Dialog
```kotlin
var showPicker by remember { mutableStateOf(false) }

if (showPicker) {
    MeroMitiDatePickerDialog(
        initialDate = BsDate(2081, 5, 19),
        onDismissRequest = { showPicker = false },
        onDateSelected = { bsDate ->
            println("Selected BS Date: ${bsDate.year}/${bsDate.month}/${bsDate.day}")
        }
    )
}
```

### 3. Core Conversions & Dynamic Year Extension
```kotlin
import com.meromiti.core.MeroMitiCore
import com.meromiti.core.BsDate
import java.time.LocalDate

// AD to BS
val bsDate = MeroMitiCore.adToBs(LocalDate.now())

// BS to AD
val adDate = MeroMitiCore.bsToAd(BsDate(2081, 5, 19))

// Nepali Fiscal Year & Quarters
val fy = MeroMitiCore.getFiscalYear() // "2081/82"
val fyRange = MeroMitiCore.getFiscalYearRange(2081) // Shrawan 1 to Ashadh end
val quarters = MeroMitiCore.getFiscalYearQuarters(2081) // 4 financial quarters

// Dynamic runtime year registration for future years
MeroMitiCore.registerYear(2095, "bba445")
```
