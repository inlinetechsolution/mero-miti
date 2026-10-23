/**
 * Mero Miti Input Mask & Live Validation
 */

import { parseBsDate, BsDate } from '@meromiti/core';

export interface MaskOptions {
  format?: string;        // 'DD/MM/YYYY' (default), 'DD.MM.YYYY', etc.
  separator?: string;     // '/' or '.'
  onValid?: (date: BsDate) => void;
  onInvalid?: (error: string) => void;
  onClear?: () => void;
}

export function attachInputMask(
  inputEl: HTMLInputElement,
  groupEl: HTMLElement,
  tooltipEl: HTMLElement,
  options: MaskOptions = {}
): void {
  const format = options.format || 'DD/MM/YYYY';
  const sepMatch = format.match(/[/.-]/);
  const separator = options.separator || (sepMatch ? sepMatch[0] : '/');

  inputEl.addEventListener('input', (e: Event) => {
    let val = inputEl.value;
    if (!val) {
      groupEl.classList.remove('mm-invalid');
      tooltipEl.textContent = '';
      if (options.onClear) options.onClear();
      return;
    }

    // Auto-mask digits as user types
    // Strip everything except digits and devanagari digits
    const rawDigits = val.replace(/[^0-9०-९]/g, '');

    let masked = '';
    if (format.startsWith('DD') || format.startsWith('MM')) {
      // Format: DD/MM/YYYY or MM/DD/YYYY
      if (rawDigits.length > 0) {
        masked += rawDigits.slice(0, 2);
      }
      if (rawDigits.length > 2) {
        masked += separator + rawDigits.slice(2, 4);
      }
      if (rawDigits.length > 4) {
        masked += separator + rawDigits.slice(4, 8);
      }
    } else if (format.startsWith('YYYY')) {
      // Format: YYYY/MM/DD
      if (rawDigits.length > 0) {
        masked += rawDigits.slice(0, 4);
      }
      if (rawDigits.length > 4) {
        masked += separator + rawDigits.slice(4, 6);
      }
      if (rawDigits.length > 6) {
        masked += separator + rawDigits.slice(6, 8);
      }
    } else {
      masked = val;
    }

    // Update value without jumping cursor if changed
    if (inputEl.value !== masked) {
      inputEl.value = masked;
    }

    // If complete length reached (10 chars for DD/MM/YYYY), validate
    if (masked.length >= 10) {
      const result = parseBsDate(masked, format);
      if (result.isValid && result.parsed) {
        groupEl.classList.remove('mm-invalid');
        tooltipEl.textContent = '';
        if (options.onValid) options.onValid(result.parsed);
      } else {
        groupEl.classList.add('mm-invalid');
        tooltipEl.textContent = result.error || 'अमान्य मिति';
        if (options.onInvalid) options.onInvalid(result.error || 'अमान्य मिति');
      }
    } else {
      // In-progress typing, remove error indicator
      groupEl.classList.remove('mm-invalid');
      tooltipEl.textContent = '';
    }
  });

  inputEl.addEventListener('blur', () => {
    if (inputEl.value && inputEl.value.length < 10) {
      groupEl.classList.add('mm-invalid');
      tooltipEl.textContent = 'मिति अपूर्ण छ';
    }
  });
}
