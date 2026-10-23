<p align="center">
  <a href="https://meromiti.com" target="_blank" rel="noopener noreferrer">
    <img src="https://meromiti.com/app-icon.png" width="80" height="80" alt="Mero Miti Logo" style="border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
  </a>
</p>

# @meromiti/web (mero-miti.js)

> Zero-dependency drop-in browser script, modal picker, and companion bridge for Bikram Sambat date picking.
>
> **A product of [Inline Tech Solution](https://inlinetech.com.np).**

---

## 📦 Usage

### Option 1: Zero-Config Drop-in Script (Vanilla HTML)
Add a single script tag before `</body>`. Mero Miti automatically attaches a synced companion picker next to all date fields:

```html
<script 
  src="https://meromiti.com/mero-miti.js" 
  data-mero-miti-auto="true"
  data-mero-miti-auto-sync="true"
  data-mero-miti-format="DD/MM/YYYY">
</script>
```

### Option 2: npm Package
```bash
npm install @meromiti/web
```

```javascript
import MeroMiti from '@meromiti/web';

// Manual attachment to existing Gregorian date field
MeroMiti.attach('#dob_input', {
  format: 'DD/MM/YYYY',
  position: 'right', // 'right' | 'bottom'
  theme: 'auto',     // 'auto' | 'light' | 'dark'
  numeral: 'en'      // 'en' (19/05/2081) or 'ne' (१९/०५/२०८१)
});
```

### Option 3: Core Conversion Engine
```javascript
import { adToBs, bsToAd, getFiscalYear } from '@meromiti/web';

const bs = adToBs(new Date());
const fy = getFiscalYear();
```

---

## 📄 License
MIT License - Copyright (c) Inline Tech Solution
