<p align="center">
  <a href="https://meromiti.com" target="_blank" rel="noopener noreferrer">
    <img src="https://meromiti.com/app-icon.png" width="80" height="80" alt="Mero Miti Logo" style="border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
  </a>
</p>

# Mero Miti Python (`mero-miti`)

Official **Mero Miti (मेरो मिति)** Python library. Features ultra-compressed 24-bit Bikram Sambat calendar data (< 1 KB), bidirectional AD $\leftrightarrow$ BS conversions, runtime dynamic year patching, and first-class integrations for **Django** and **FastAPI**.

---

## 📦 Installation

```bash
pip install mero-miti
```

With Django or FastAPI extras:
```bash
pip install "mero-miti[django]"
pip install "mero-miti[pydantic]"
```

---

## 🚀 Quick Start

### 1. Basic Conversion
```python
import datetime
from mero_miti import ad_to_bs, bs_to_ad, BsDate, format_bs_date

# Gregorian (A.D.) to Bikram Sambat (B.S.)
today_bs = ad_to_bs(datetime.date.today())
print(today_bs) # 2081-05-19
print(format_bs_date(today_bs, format="DD/MM/YYYY", numeral="ne")) # १९/०५/२०८१

# Bikram Sambat (B.S.) to Gregorian (A.D.)
ad_date = bs_to_ad(BsDate(2081, 5, 19))
print(ad_date) # 2024-09-04
```

### 2. Nepali Fiscal Year (आर्थिक वर्ष) & Quarters
```python
from mero_miti import get_fiscal_year, get_fiscal_year_range, get_fiscal_year_quarters

# Current Fiscal Year
fy = get_fiscal_year()
print(fy.code) # "2081/82"
print(fy.nepali_code) # "२०८१/८२"

# Exact Date Boundaries (Shrawan 1 to Ashadh end)
r = get_fiscal_year_range(2081)
print(r.start_bs, r.end_bs) # 2081-04-01 2082-03-31
print(r.start_date, r.end_date) # Gregorian dates

# Financial Quarters (त्रैमासिक / चौमासिक)
quarters = get_fiscal_year_quarters(2081)
for q in quarters:
    print(f"{q.name}: {q.start_bs} to {q.end_bs}")
```

### 3. Strict Calendar Validation
```python
from mero_miti import validate_bs_date, parse_bs_date, BsDate

# Rejects non-existent days (e.g. Baishakh 32 when Baishakh only has 31 days)
result = validate_bs_date(BsDate(2081, 1, 32), locale="ne")
if not result.is_valid:
    print(result.error) # 2081 साल बैशाखमा 31 दिन मात्र छन्
```

### 3. Django Form Integration
```python
from django import forms
from mero_miti.integrations.django import BsDateField

class EmployeeForm(forms.Form):
    name = forms.CharField()
    dob = BsDateField(label="जन्म मिति (B.S.)", format="DD/MM/YYYY")
```

### 4. FastAPI / Pydantic Integration
```python
from fastapi import FastAPI
from pydantic import BaseModel
from mero_miti.integrations.pydantic import BsDateStr

app = FastAPI()

class UserRegistration(BaseModel):
    name: str
    dob_bs: BsDateStr # Automatically validates Bikram Sambat format & day bounds

@app.post("/register")
def register(user: UserRegistration):
    ad_date = user.dob_bs.to_ad_date() # Converts to Gregorian date for database
    return {"message": "Success", "ad_dob": str(ad_date)}
```
