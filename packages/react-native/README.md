<p align="center">
  <a href="https://meromiti.com" target="_blank" rel="noopener noreferrer">
    <img src="https://meromiti.com/app-icon.png" width="80" height="80" alt="Mero Miti Logo" style="border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
  </a>
</p>

# @meromiti/react-native

> Native Nepali Bikram Sambat (B.S.) Date Picker modal, input, and converter for React Native and Expo.
>
> **A product of [Inline Tech Solution](https://inlinetech.com.np).**

---

## 📦 Installation

```bash
npm install @meromiti/react-native @meromiti/core
```

---

## 🚀 Usage

### 1. Modal Nepali Date Picker
```tsx
import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { MeroMitiModalPicker } from '@meromiti/react-native';

export default function App() {
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2081/05/19');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Selected Date: {selectedDate}</Text>
      <Button title="Choose Nepali Date" onPress={() => setVisible(true)} />

      <MeroMitiModalPicker
        visible={visible}
        initialDate={selectedDate}
        locale="ne"
        onConfirm={(bsDate, adDate) => {
          setSelectedDate(bsDate);
          setVisible(false);
        }}
        onCancel={() => setVisible(false)}
      />
    </View>
  );
}
```

### 2. Nepali Date Input Field
```tsx
import React, { useState } from 'react';
import { MeroMitiMobileInput } from '@meromiti/react-native';

<MeroMitiMobileInput
  label="जन्म मिति"
  value={birthDate}
  onChange={(bs, ad) => setBirthDate(bs)}
  locale="ne"
/>
```

---

## 📄 License
MIT License - Copyright (c) Inline Tech Solution
