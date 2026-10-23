<p align="center">
  <a href="https://meromiti.com" target="_blank" rel="noopener noreferrer">
    <img src="https://meromiti.com/app-icon.png" width="80" height="80" alt="Mero Miti Logo" style="border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
  </a>
</p>

# Mero Miti Vue 3 (`@mero-miti/vue`)

Official **Mero Miti (मेरो मिति)** date picker component for Vue 3 and Nuxt applications. Features two-way `v-model` binding, live masking, strict B.S. calendar validation, and automatic Gregorian synchronization.

---

## 📦 Installation

```bash
npm install @mero-miti/vue
# or
pnpm add @mero-miti/vue
```

---

## 🚀 Quick Start

### 1. Global Registration (Optional)
In your `main.ts` or `main.js`:
```typescript
import { createApp } from 'vue';
import { MeroMitiPlugin } from '@mero-miti/vue';
import App from './App.vue';

const app = createApp(App);
app.use(MeroMitiPlugin);
app.mount('#app');
```

### 2. Standalone Component Usage (`v-model`)
```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MeroMitiPicker } from '@mero-miti/vue';

const nepaliDate = ref('2081/05/19');

function handleDateChange(bsDateStr: string, adDateStr: string) {
  console.log('BS Date:', bsDateStr);
  console.log('Synchronized AD Date:', adDateStr);
}
</script>

<template>
  <MeroMitiPicker
    v-model="nepaliDate"
    label="जन्म मिति (Date of Birth)"
    locale="ne"
    format="DD/MM/YYYY"
    @change="handleDateChange"
  />
</template>
```

### 3. Companion Bridge for Existing Gregorian Inputs
If you already have an `<input type="date">` in your Vue form, attach the companion field non-destructively:
```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MeroMitiCompanion } from '@mero-miti/vue';

const nativeInputRef = ref<HTMLInputElement | null>(null);
</script>

<template>
  <div>
    <input ref="nativeInputRef" type="date" id="dob" v-model="gregorianDate" />
    <MeroMitiCompanion v-if="nativeInputRef" :target="nativeInputRef" />
  </div>
</template>
```
