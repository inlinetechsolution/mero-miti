import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  BsDate,
  AdDate,
  bsToAd,
  formatBsDate,
  formatAdDate,
  parseBsDate
} from '@mero-miti/core';
import { CalendarPopover } from '@mero-miti/web/calendar-popover';
import { injectStyles } from '@mero-miti/web/styles';
import { MERO_MITI_ICON_DATA_URL } from '@mero-miti/web/icons';

@Component({
  selector: 'mero-miti-picker',
  template: `
    <div
      #container
      class="mero-miti-companion-wrapper"
      [class.mero-miti-dark]="theme === 'dark'"
    >
      <label *ngIf="label" class="mero-miti-label">
        <span>{{ label }}</span>
      </label>

      <div class="mero-miti-input-group" [class.mm-invalid]="errorMessage">
        <span class="mero-miti-inline-badge">
          {{ locale === 'ne' ? 'वि.सं.' : 'B.S.' }}
        </span>

        <input
          #nativeInput
          type="text"
          class="mero-miti-input"
          [placeholder]="placeholder"
          [value]="value"
          [disabled]="disabled"
          maxlength="10"
          autocomplete="off"
          spellcheck="false"
          (input)="onInput($event)"
          (blur)="onBlur()"
        />

        <button
          type="button"
          class="mero-miti-icon-btn"
          [disabled]="disabled"
          title="पात्रो हेर्नुहोस्"
          (click)="togglePopover()"
        >
          <img class="mero-miti-trigger-img" [src]="brandIconUrl" alt="पात्रो" />
        </button>

        <div *ngIf="errorMessage" class="mero-miti-tooltip">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MeroMitiPickerComponent),
      multi: true
    }
  ]
})
export class MeroMitiPickerComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() format: string = 'DD/MM/YYYY';
  @Input() numeral: 'en' | 'ne' = 'en';
  @Input() placeholder: string = 'DD/MM/YYYY';
  @Input() label: string = '';
  @Input() locale: 'ne' | 'en' = 'ne';
  @Input() theme: 'auto' | 'light' | 'dark' = 'auto';

  @Output() dateChange = new EventEmitter<{ bs: BsDate; ad: AdDate; bsStr: string; adStr: string }>();

  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLElement>;

  value: string = '';
  disabled: boolean = false;
  errorMessage: string = '';
  brandIconUrl = MERO_MITI_ICON_DATA_URL;

  private currentBsDate: BsDate | null = null;
  private popover: CalendarPopover | null = null;
  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    injectStyles();
  }

  ngOnDestroy(): void {
    if (this.popover) {
      this.popover.destroy();
      this.popover = null;
    }
  }

  // ControlValueAccessor methods
  writeValue(obj: any): void {
    this.value = obj ? String(obj) : '';
    if (this.value) {
      this.validateDate(this.value, false);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value;
    const sep = this.format.includes('.') ? '.' : (this.format.includes('-') ? '-' : '/');
    const clean = raw.replace(/[^0-9०-९]/g, '');
    let masked = '';

    if (this.format.startsWith('YYYY')) {
      if (clean.length > 0) masked += clean.slice(0, 4);
      if (clean.length > 4) masked += sep + clean.slice(4, 6);
      if (clean.length > 6) masked += sep + clean.slice(6, 8);
    } else {
      if (clean.length > 0) masked += clean.slice(0, 2);
      if (clean.length > 2) masked += sep + clean.slice(2, 4);
      if (clean.length > 4) masked += sep + clean.slice(4, 8);
    }

    this.value = masked;
    this.onChange(masked);
    this.validateDate(masked, true);
  }

  onBlur(): void {
    this.onTouched();
  }

  private validateDate(val: string, emitChange = true): void {
    if (val.length >= 10) {
      const res = parseBsDate(val, this.format, this.locale);
      if (res.isValid && res.parsed) {
        this.currentBsDate = res.parsed;
        this.errorMessage = '';
        if (emitChange) {
          const ad = bsToAd(res.parsed);
          this.dateChange.emit({
            bs: res.parsed,
            ad,
            bsStr: val,
            adStr: formatAdDate(ad, '-')
          });
        }
      } else {
        this.errorMessage = res.error || 'अमान्य मिति';
      }
    } else {
      this.errorMessage = '';
    }
  }

  togglePopover(): void {
    if (this.disabled) return;

    if (this.popover) {
      this.popover.destroy();
      this.popover = null;
    } else {
      this.popover = new CalendarPopover(
        this.containerRef.nativeElement,
        this.currentBsDate,
        {
          onSelect: (selectedBs: BsDate) => {
            this.currentBsDate = selectedBs;
            const formatted = formatBsDate(selectedBs, {
              format: this.format,
              numeral: this.numeral
            });
            this.value = formatted;
            this.errorMessage = '';
            this.onChange(formatted);

            const ad = bsToAd(selectedBs);
            this.dateChange.emit({
              bs: selectedBs,
              ad,
              bsStr: formatted,
              adStr: formatAdDate(ad, '-')
            });
            this.popover = null;
          },
          onClose: () => {
            this.popover = null;
          }
        },
        this.locale
      );
    }
  }
}
