<p align="center">
  <a href="https://meromiti.com" target="_blank" rel="noopener noreferrer">
    <img src="https://meromiti.com/app-icon.png" width="80" height="80" alt="Mero Miti Logo" style="border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
  </a>
</p>

# Mero Miti .NET & C# (`MeroMiti`)

Official **Mero Miti (मेरो मिति)** library for .NET and C#. Features ultra-compressed 24-bit Bikram Sambat calendar data (< 1 KB), bidirectional AD $\leftrightarrow$ BS conversions, runtime dynamic year registration, and ASP.NET Core `[BsDate]` model validation attributes.

---

## 📦 Installation

```bash
dotnet add package MeroMiti
```

Supports `.NET Standard 2.0`, `.NET 6.0`, `.NET 7.0`, `.NET 8.0`, and `.NET 10.0+`.

---

## 🚀 Quick Start

### 1. Basic Conversions
```csharp
using MeroMiti;

// Gregorian (A.D.) to Bikram Sambat (B.S.)
BsDate todayBs = MeroMitiCore.AdToBs(DateTime.UtcNow);
Console.WriteLine(todayBs); // 2081-05-19
Console.WriteLine(MeroMitiCore.FormatBsDate(todayBs, "DD/MM/YYYY", numeral: "ne")); // १९/०५/२०८१

// Bikram Sambat (B.S.) to Gregorian (A.D.)
DateTime adDate = MeroMitiCore.BsToAd(new BsDate(2081, 5, 19));
Console.WriteLine(adDate.ToString("yyyy-MM-dd")); // 2024-09-04
```

### 2. Nepali Fiscal Year (आर्थिक वर्ष) & Quarters
```csharp
// Current Fiscal Year
var fy = MeroMitiCore.GetFiscalYear();
Console.WriteLine(fy.Code);       // "2081/82"
Console.WriteLine(fy.NepaliCode); // "२०८१/८२"

// Exact Gregorian and BS Boundaries
var range = MeroMitiCore.GetFiscalYearRange(2081);
Console.WriteLine($"{range.StartBs} to {range.EndBs}"); // 2081-04-01 to 2082-03-31

// Financial Quarters (त्रैमासिक)
var quarters = MeroMitiCore.GetFiscalYearQuarters(2081);
foreach (var q in quarters)
{
    Console.WriteLine($"{q.Name}: {q.StartBs} to {q.EndBs}");
}
```

### 3. Strict Calendar Validation
```csharp
var result = MeroMitiCore.ValidateBsDate(new BsDate(2081, 1, 32), locale: "ne");
if (!result.IsValid)
{
    Console.WriteLine(result.Error); // 2081 साल बैशाखमा 31 दिन मात्र छन्
}
```

### 3. ASP.NET Core Model Validation
Annotate your DTOs or ViewModels with `[BsDate]`:
```csharp
using System.ComponentModel.DataAnnotations;
using MeroMiti.Attributes;

public class EmployeeRegistrationDto
{
    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [BsDate(Format = "DD/MM/YYYY", Locale = "ne")]
    public string DateOfBirthBs { get; set; } = string.Empty;
}
```

### 4. Dynamic Runtime Year Registration
```csharp
// Register newly published calendar year at runtime
MeroMitiCore.RegisterYear(2095, "bba445");
```
