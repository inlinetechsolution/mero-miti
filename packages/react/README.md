<p align="center">
  <a href="https://meromiti.com" target="_blank" rel="noopener noreferrer">
    <img src="https://meromiti.com/app-icon.png" width="80" height="80" alt="Mero Miti Logo" style="border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
  </a>
</p>

# @mero-miti/react

> React and Next.js Bikram Sambat (B.S.) Nepali date picker components, hooks, and companion bridge.
>
> **A product of [Inline Tech Solution](https://inlinetech.com.np).**

---

## 📦 Installation

```bash
npm install @mero-miti/react @mero-miti/core
```

---

## 🚀 Usage

### 1. Standalone Nepali Date Picker
```tsx
import React, { useState } from 'react';
import { MeroMitiPicker } from '@mero-miti/react';

export default function BookingForm() {
  const [bsDate, setBsDate] = useState('2081/05/19');

  return (
    <div>
      <label>मिति चयन गर्नुहोस् (Select Date):</label>
      <MeroMitiPicker
        value={bsDate}
        onChange={(newBsDate, adEquivalent) => {
          setBsDate(newBsDate);
          console.log('BS:', newBsDate, 'AD:', adEquivalent);
        }}
        format="DD/MM/YYYY"
        locale="ne"
      />
    </div>
  );
}
```

### 2. Companion Bridge (Side-by-side with Existing Gregorian Input)
```tsx
import React, { useState } from 'react';
import { MeroMitiCompanion } from '@mero-miti/react';

export default function FormWithCompanion() {
  const [adDate, setAdDate] = useState('2024-09-04');

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input
        type="date"
        value={adDate}
        onChange={(e) => setAdDate(e.target.value)}
      />
      <MeroMitiCompanion
        adValue={adDate}
        onBsChange={(bs, ad) => setAdDate(ad)}
      />
    </div>
  );
}
```

---

## 📄 License
MIT License - Copyright (c) Inline Tech Solution
