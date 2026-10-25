/**
 * Mero Miti Companion Bridge
 * Non-destructive two-way synchronization between vendor Gregorian fields and Mero Miti Nepali fields.
 */

import {
  BsDate,
  adToBs,
  bsToAd,
  formatBsDate,
  formatAdDate,
  FormatOptions
} from '@meromiti/core';
import { CalendarPopover } from './calendar-popover';
import { attachInputMask } from './input-mask';
import { injectStyles } from './styles';
import { MERO_MITI_ICON_HTML } from './icons';

export interface CompanionOptions extends FormatOptions {
  position?: 'right' | 'bottom';
  label?: string;
  placeholder?: string;
  theme?: 'auto' | 'light' | 'dark';
  showBadge?: boolean;
  name?: string;
}

export class MeroMitiCompanionBridge {
  private targetInput: HTMLInputElement;
  private container: HTMLElement;
  private nepaliInput: HTMLInputElement;
  private iconBtn: HTMLButtonElement;
  private tooltipEl: HTMLElement;
  private popover: CalendarPopover | null = null;
  private currentBsDate: BsDate | null = null;
  private options: CompanionOptions;
  private isUpdating = false; // Prevents recursive update loops
  private attrObserver: MutationObserver | null = null;
  private formResetHandler: (() => void) | null = null;

  constructor(targetInput: HTMLInputElement, options: CompanionOptions = {}) {
    this.targetInput = targetInput;

    // Per-element data-* attribute overrides
    const elAttrs: Partial<CompanionOptions> = {};
    if (targetInput && targetInput.getAttribute) {
      const loc = targetInput.getAttribute('data-mero-miti-locale');
      if (loc) elAttrs.locale = loc as 'ne' | 'en';
      const fmt = targetInput.getAttribute('data-mero-miti-format');
      if (fmt) elAttrs.format = fmt;
      const pos = targetInput.getAttribute('data-mero-miti-position');
      if (pos) elAttrs.position = pos as 'right' | 'bottom';
      const num = targetInput.getAttribute('data-mero-miti-numeral');
      if (num) elAttrs.numeral = num as 'ne' | 'en';
      const th = targetInput.getAttribute('data-mero-miti-theme');
      if (th) elAttrs.theme = th as 'auto' | 'light' | 'dark';
      const ph = targetInput.getAttribute('data-mero-miti-placeholder');
      if (ph) elAttrs.placeholder = ph;
      const nm = targetInput.getAttribute('data-mero-miti-name');
      if (nm) elAttrs.name = nm;
    }

    const merged = { ...options, ...elAttrs };

    this.options = {
      format: merged.format || 'DD/MM/YYYY',
      position: merged.position || 'right',
      placeholder: merged.placeholder || (merged.format || 'DD/MM/YYYY'),
      label: merged.label !== undefined ? merged.label : undefined,
      showBadge: merged.showBadge !== false,
      theme: merged.theme || 'auto',
      numeral: merged.numeral || (merged.locale === 'ne' ? 'ne' : 'en'),
      name: merged.name || (targetInput.name ? `${targetInput.name}_bs` : undefined)
    };

    injectStyles();
    this.container = this.createCompanionDom();
    this.nepaliInput = this.container.querySelector('.mero-miti-input') as HTMLInputElement;
    this.iconBtn = this.container.querySelector('.mero-miti-icon-btn') as HTMLButtonElement;
    this.tooltipEl = this.container.querySelector('.mero-miti-tooltip') as HTMLElement;

    this.mount();
    this.matchTargetStyles();
    this.bindEvents();
    this.initialSync();
  }

  private matchTargetStyles(): void {
    if (typeof window === 'undefined') return;
    const computed = window.getComputedStyle(this.targetInput);
    if (!computed) return;

    const groupEl = this.container.querySelector('.mero-miti-input-group') as HTMLElement;
    if (!groupEl) return;

    if (computed.height && computed.height !== 'auto' && computed.height !== '0px') {
      groupEl.style.height = computed.height;
    }
    if (computed.borderRadius) {
      groupEl.style.borderRadius = computed.borderRadius;
    }
    if (computed.borderColor && computed.borderStyle !== 'none') {
      groupEl.style.borderColor = computed.borderColor;
    }
    if (computed.fontFamily) {
      this.nepaliInput.style.fontFamily = computed.fontFamily;
      groupEl.style.fontFamily = computed.fontFamily;
    }
    if (computed.fontSize) {
      this.nepaliInput.style.fontSize = computed.fontSize;
    }
    if (computed.fontWeight) {
      this.nepaliInput.style.fontWeight = computed.fontWeight;
    }
    if (computed.color && computed.color !== 'rgba(0, 0, 0, 0)') {
      this.nepaliInput.style.color = computed.color;
    }
    if (computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)' && computed.backgroundColor !== 'transparent') {
      groupEl.style.backgroundColor = computed.backgroundColor;
    }
  }

  private isTargetBlock(): boolean {
    if (typeof window === 'undefined') return false;
    const computed = window.getComputedStyle(this.targetInput);
    if (!computed) return false;
    if (computed.display === 'block') return true;
    if (computed.width === '100%') return true;
    const parentWidth = this.targetInput.parentElement?.getBoundingClientRect().width || 0;
    const inputWidth = this.targetInput.getBoundingClientRect().width || 0;
    if (parentWidth > 0 && inputWidth > 0 && (inputWidth / parentWidth) >= 0.82) {
      return true;
    }
    return false;
  }

  private createCompanionDom(): HTMLElement {
    const isBlock = this.options.position === 'bottom' || this.isTargetBlock();
    const wrapper = document.createElement('div');
    wrapper.className = `mero-miti-companion-wrapper ${isBlock ? 'mm-block' : ''}`;
    if (this.options.theme === 'dark') wrapper.classList.add('mero-miti-dark');

    const nameAttr = this.options.name ? ` name="${this.options.name}"` : '';
    const disabledAttr = this.targetInput.disabled ? ' disabled' : '';
    const readOnlyAttr = this.targetInput.readOnly ? ' readonly' : '';
    const badgeText = this.options.locale === 'ne' ? 'वि.सं.' : 'B.S.';
    const inlineBadgeHtml = this.options.showBadge !== false
      ? `<span class="mero-miti-inline-badge">${badgeText}</span>`
      : '';

    wrapper.innerHTML = `
      ${this.options.label ? `
        <label class="mero-miti-label">
          <span>${this.options.label}</span>
          ${this.options.showBadge ? '<span class="mero-miti-badge">B.S.</span>' : ''}
        </label>
      ` : ''}
      <div class="mero-miti-input-group">
        ${inlineBadgeHtml}
        <input 
          type="text"${nameAttr}${disabledAttr}${readOnlyAttr} 
          class="mero-miti-input" 
          placeholder="${this.options.placeholder}" 
          maxlength="10" 
          autocomplete="off"
          spellcheck="false"
        />
        <button type="button" class="mero-miti-icon-btn" title="पात्रो हेर्नुहोस् (Open Calendar)"${disabledAttr}>
          ${MERO_MITI_ICON_HTML}
        </button>
        <div class="mero-miti-tooltip"></div>
      </div>
    `;

    return wrapper;
  }

  private mount(): void {
    const isBlock = this.options.position === 'bottom' || this.isTargetBlock();
    if (isBlock && !this.container.classList.contains('mm-block')) {
      this.container.classList.add('mm-block');
    }

    if (this.options.position === 'bottom' || isBlock) {
      // Insert after the vendor input's parent or immediately next line
      if (this.targetInput.nextSibling) {
        this.targetInput.parentNode?.insertBefore(this.container, this.targetInput.nextSibling);
      } else {
        this.targetInput.parentNode?.appendChild(this.container);
      }
    } else {
      // Default: Place immediately to the right of the target input
      this.targetInput.insertAdjacentElement('afterend', this.container);
    }
  }

  private bindEvents(): void {
    const inputGroup = this.container.querySelector('.mero-miti-input-group') as HTMLElement;

    // 1. Listen for user typing in Mero Miti field
    attachInputMask(this.nepaliInput, inputGroup, this.tooltipEl, {
      format: this.options.format,
      onValid: (bsDate: BsDate) => {
        this.currentBsDate = bsDate;
        this.syncToGregorian(bsDate);
      },
      onClear: () => {
        this.currentBsDate = null;
        this.clearGregorian();
      }
    });

    // Clicking anywhere in the input group focuses the input
    inputGroup.addEventListener('click', (e: MouseEvent) => {
      if (e.target !== this.iconBtn && !this.iconBtn.contains(e.target as Node)) {
        this.nepaliInput.focus();
      }
    });

    this.nepaliInput.addEventListener('focus', () => {
      this.matchTargetStyles();
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        const isBlock = this.options.position === 'bottom' || this.isTargetBlock();
        if (isBlock) {
          this.container.classList.add('mm-block');
        } else if (this.options.position !== 'bottom') {
          this.container.classList.remove('mm-block');
        }
      });
    }

    // 2. Calendar Popover toggle on icon click
    this.iconBtn.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.popover) {
        this.popover.destroy();
        this.popover = null;
      } else {
        this.popover = new CalendarPopover(this.container, this.currentBsDate, {
          onSelect: (selectedBs: BsDate) => {
            this.currentBsDate = selectedBs;
            this.nepaliInput.value = formatBsDate(selectedBs, {
              format: this.options.format,
              numeral: this.options.numeral
            });
            inputGroup.classList.remove('mm-invalid');
            this.tooltipEl.textContent = '';
            this.syncToGregorian(selectedBs);
            this.popover = null;
          },
          onClose: () => {
            this.popover = null;
          }
        });
      }
    });

    // 3. Listen for changes on vendor's Gregorian input
    const onTargetChange = () => {
      if (this.isUpdating) return;
      this.syncFromGregorian();
    };
    this.targetInput.addEventListener('input', onTargetChange);
    this.targetInput.addEventListener('change', onTargetChange);

    // 4. Mirror disabled/readonly state
    if (typeof MutationObserver !== 'undefined') {
      this.attrObserver = new MutationObserver(() => {
        this.nepaliInput.disabled = this.targetInput.disabled;
        this.nepaliInput.readOnly = this.targetInput.readOnly;
        this.iconBtn.disabled = this.targetInput.disabled || this.targetInput.readOnly;
      });
      this.attrObserver.observe(this.targetInput, { attributes: true, attributeFilter: ['disabled', 'readonly'] });
    }

    // 5. Sync on Form Reset
    if (this.targetInput.form) {
      this.formResetHandler = () => {
        setTimeout(() => this.syncFromGregorian(), 10);
      };
      this.targetInput.form.addEventListener('reset', this.formResetHandler);
    }
  }

  public destroy(): void {
    if (this.attrObserver) this.attrObserver.disconnect();
    if (this.targetInput.form && this.formResetHandler) {
      this.targetInput.form.removeEventListener('reset', this.formResetHandler);
    }
    if (this.popover) this.popover.destroy();
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }

  /**
   * Reads vendor Gregorian input and updates Mero Miti companion.
   */
  private syncFromGregorian(): void {
    const val = this.targetInput.value;
    if (!val) {
      this.nepaliInput.value = '';
      this.currentBsDate = null;
      return;
    }

    const dateParts = val.split(/[-/.]/).map(Number);
    if (dateParts.length === 3) {
      let y: number, m: number, d: number;
      if (val.includes('-')) {
        // Standard YYYY-MM-DD
        [y, m, d] = dateParts;
      } else {
        // Assume DD/MM/YYYY or MM/DD/YYYY
        [d, m, y] = dateParts;
      }

      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        try {
          const bs = adToBs(new Date(y, m - 1, d));
          this.currentBsDate = bs;
          this.nepaliInput.value = formatBsDate(bs, {
            format: this.options.format,
            numeral: this.options.numeral
          });
          const group = this.container.querySelector('.mero-miti-input-group');
          group?.classList.remove('mm-invalid');
          this.tooltipEl.textContent = '';
        } catch (e) {
          // Date conversion out of range or unparsable
        }
      }
    }
  }

  /**
   * Converts Mero Miti date to Gregorian and safely dispatches events to vendor input.
   */
  private syncToGregorian(bsDate: BsDate): void {
    if (this.isUpdating) return;
    this.isUpdating = true;

    try {
      const ad = bsToAd(bsDate);
      const formattedAd = formatAdDate(ad, '-'); // Default standard YYYY-MM-DD for input[type="date"]

      // Deep React/Vue Prototype Value Setter trick:
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;

      if (nativeSetter) {
        nativeSetter.call(this.targetInput, formattedAd);
      } else {
        this.targetInput.value = formattedAd;
      }

      // Dispatch bubbles events so vendor forms (React Hook Form, Formik, Vanilla) react
      this.targetInput.dispatchEvent(new Event('input', { bubbles: true }));
      this.targetInput.dispatchEvent(new Event('change', { bubbles: true }));
    } finally {
      this.isUpdating = false;
    }
  }

  private clearGregorian(): void {
    if (this.isUpdating) return;
    this.isUpdating = true;
    try {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      if (nativeSetter) {
        nativeSetter.call(this.targetInput, '');
      } else {
        this.targetInput.value = '';
      }
      this.targetInput.dispatchEvent(new Event('input', { bubbles: true }));
      this.targetInput.dispatchEvent(new Event('change', { bubbles: true }));
    } finally {
      this.isUpdating = false;
    }
  }

  private initialSync(): void {
    if (this.targetInput.value) {
      this.syncFromGregorian();
    }
  }

  public destroy(): void {
    if (this.popover) this.popover.destroy();
    this.container.remove();
  }
}
