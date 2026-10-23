<p align="center">
  <a href="https://meromiti.com" target="_blank" rel="noopener noreferrer">
    <img src="https://meromiti.com/app-icon.png" width="80" height="80" alt="Mero Miti Logo" style="border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
  </a>
</p>

# Mero Miti Angular (`@mero-miti/angular`)

Official **Mero Miti (मेरो मिति)** date picker and `ControlValueAccessor` component for Angular applications. Integrates seamlessly with **Angular Reactive Forms** (`formControlName`, `[formControl]`) and Template-Driven Forms (`[(ngModel)]`).

---

## 📦 Installation

```bash
npm install @mero-miti/angular
# or
pnpm add @mero-miti/angular
```

---

## 🚀 Quick Start

### 1. Import `MeroMitiModule`
In your `app.module.ts` or standalone component `imports`:
```typescript
import { MeroMitiModule } from '@mero-miti/angular';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ReactiveFormsModule,
    MeroMitiModule
  ]
})
export class AppModule {}
```

### 2. Reactive Forms Integration (`formControlName`)
```typescript
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <mero-miti-picker
        formControlName="dob"
        label="जन्म मिति (Date of Birth)"
        locale="ne"
        format="DD/MM/YYYY"
        (dateChange)="onDateChange($event)"
      ></mero-miti-picker>

      <button type="submit" [disabled]="userForm.invalid">Submit</button>
    </form>
  `
})
export class UserFormComponent {
  userForm = new FormGroup({
    dob: new FormControl('2081/05/19', [Validators.required])
  });

  onDateChange(event: any) {
    console.log('BS Date:', event.bsStr);
    console.log('Synchronized AD Date:', event.adStr);
  }

  onSubmit() {
    console.log('Form Value:', this.userForm.value);
  }
}
```

### 3. Companion Directive on Native Inputs
Attach the Mero Miti companion field directly to an existing `<input type="date">` without changing your backend template:
```html
<input 
  type="date" 
  formControlName="gregorianDate" 
  [meroMitiCompanion]="{ position: 'right', format: 'DD/MM/YYYY' }" 
/>
```
