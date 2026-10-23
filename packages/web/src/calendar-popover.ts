/**
 * Mero Miti Calendar Popover Component
 */

import {
  BsDate,
  getDaysInBsMonth,
  bsToJsDate,
  adToBs,
  NEPALI_MONTHS_NP,
  NEPALI_DAYS_SHORT_NP,
  toNepaliDigits
} from '@meromiti/core';
import { MERO_MITI_ICON_DATA_URL } from './icons';

export interface PopoverCallbacks {
  onSelect: (date: BsDate) => void;
  onClose?: () => void;
}

export class CalendarPopover {
  private element: HTMLElement;
  private currentYear: number;
  private currentMonth: number; // 1-12
  private selectedDate: BsDate | null = null;
  private callbacks: PopoverCallbacks;
  private triggerElement: HTMLElement;
  private clickOutsideHandler: (e: MouseEvent) => void;

  constructor(triggerEl: HTMLElement, initialDate: BsDate | null, callbacks: PopoverCallbacks) {
    this.triggerElement = triggerEl;
    this.callbacks = callbacks;
    this.selectedDate = initialDate;

    const todayBs = adToBs(new Date());
    this.currentYear = initialDate ? initialDate.year : todayBs.year;
    this.currentMonth = initialDate ? initialDate.month : todayBs.month;

    this.element = document.createElement('div');
    this.element.className = 'mero-miti-popover';

    this.clickOutsideHandler = (e: MouseEvent) => {
      if (!this.element.contains(e.target as Node) && !this.triggerElement.contains(e.target as Node)) {
        this.destroy();
      }
    };

    this.render();
    this.position();
    document.body.appendChild(this.element);

    setTimeout(() => {
      document.addEventListener('mousedown', this.clickOutsideHandler);
    }, 10);
  }

  public setDate(date: BsDate | null): void {
    this.selectedDate = date;
    if (date) {
      this.currentYear = date.year;
      this.currentMonth = date.month;
    }
    this.render();
  }

  private position(): void {
    const rect = this.triggerElement.getBoundingClientRect();
    const popoverHeight = 290;
    const viewportHeight = window.innerHeight;

    let top = rect.bottom + window.scrollY + 4;
    // Auto-flip if not enough space below
    if (rect.bottom + popoverHeight > viewportHeight && rect.top > popoverHeight) {
      top = rect.top + window.scrollY - popoverHeight - 4;
    }

    let left = rect.left + window.scrollX;
    if (left + 280 > window.innerWidth) {
      left = window.innerWidth - 290;
    }

    this.element.style.top = `${Math.max(10, top)}px`;
    this.element.style.left = `${Math.max(10, left)}px`;
  }

  private render(): void {
    const todayBs = adToBs(new Date());
    const daysInMonth = getDaysInBsMonth(this.currentYear, this.currentMonth);

    // Calculate which weekday the 1st of this month falls on
    const firstDayAd = bsToJsDate({ year: this.currentYear, month: this.currentMonth, day: 1 });
    const startWeekday = firstDayAd.getDay(); // 0 = Sun, 6 = Sat

    // Build Year options (2000 to 2090)
    let yearOptionsHtml = '';
    for (let y = 2000; y <= 2090; y++) {
      const selected = y === this.currentYear ? 'selected' : '';
      yearOptionsHtml += `<option value="${y}" ${selected}>${toNepaliDigits(y)} (${y})</option>`;
    }

    // Build Month options
    let monthOptionsHtml = '';
    for (let m = 1; m <= 12; m++) {
      const selected = m === this.currentMonth ? 'selected' : '';
      monthOptionsHtml += `<option value="${m}" ${selected}>${NEPALI_MONTHS_NP[m - 1]}</option>`;
    }

    // Header
    let html = `
      <div class="mero-miti-header">
        <button class="mero-miti-nav-btn" data-action="prev" title="अघिल्लो महिना">◀</button>
        <div class="mero-miti-selects">
          <select class="mero-miti-select" data-select="month">${monthOptionsHtml}</select>
          <select class="mero-miti-select" data-select="year">${yearOptionsHtml}</select>
        </div>
        <button class="mero-miti-nav-btn" data-action="next" title="पछिल्लो महिना">▶</button>
      </div>

      <div class="mero-miti-weekdays">
        ${NEPALI_DAYS_SHORT_NP.map((d, i) => `<span class="${i === 6 ? 'mm-saturday' : ''}">${d}</span>`).join('')}
      </div>

      <div class="mero-miti-days">
    `;

    // Empty cells before start weekday
    for (let i = 0; i < startWeekday; i++) {
      html += `<div class="mero-miti-day mm-empty"></div>`;
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const weekday = (startWeekday + day - 1) % 7;
      const isSat = weekday === 6;
      const isSelected = this.selectedDate &&
        this.selectedDate.year === this.currentYear &&
        this.selectedDate.month === this.currentMonth &&
        this.selectedDate.day === day;
      const isToday = todayBs.year === this.currentYear &&
        todayBs.month === this.currentMonth &&
        todayBs.day === day;

      const classes = [
        'mero-miti-day',
        isSat ? 'mm-saturday' : '',
        isSelected ? 'mm-selected' : '',
        isToday ? 'mm-today' : ''
      ].filter(Boolean).join(' ');

      html += `<div class="${classes}" data-day="${day}">${toNepaliDigits(day)}</div>`;
    }

    html += `
      </div>
      <div class="mero-miti-footer">
        <button class="mero-miti-today-btn" data-action="today">आज (${toNepaliDigits(todayBs.day)} ${NEPALI_MONTHS_NP[todayBs.month - 1]})</button>
        <a href="https://meromiti.com" target="_blank" class="mero-miti-brand">
          <img class="mero-miti-brand-mark" src="${MERO_MITI_ICON_DATA_URL}" alt="Mero Miti" />
          <span>मेरो मिति</span>
        </a>
      </div>
    `;

    this.element.innerHTML = html;
    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    // Nav Prev / Next
    this.element.querySelector('[data-action="prev"]')?.addEventListener('click', () => {
      this.currentMonth--;
      if (this.currentMonth < 1) {
        this.currentMonth = 12;
        this.currentYear--;
      }
      this.render();
    });

    this.element.querySelector('[data-action="next"]')?.addEventListener('click', () => {
      this.currentMonth++;
      if (this.currentMonth > 12) {
        this.currentMonth = 1;
        this.currentYear++;
      }
      this.render();
    });

    // Month / Year Selects
    this.element.querySelector('[data-select="month"]')?.addEventListener('change', (e: Event) => {
      this.currentMonth = parseInt((e.target as HTMLSelectElement).value, 10);
      this.render();
    });

    this.element.querySelector('[data-select="year"]')?.addEventListener('change', (e: Event) => {
      this.currentYear = parseInt((e.target as HTMLSelectElement).value, 10);
      this.render();
    });

    // Today Button
    this.element.querySelector('[data-action="today"]')?.addEventListener('click', () => {
      const today = adToBs(new Date());
      this.callbacks.onSelect(today);
      this.destroy();
    });

    // Day Click
    this.element.querySelectorAll('.mero-miti-day:not(.mm-empty)').forEach(el => {
      el.addEventListener('click', () => {
        const day = parseInt(el.getAttribute('data-day')!, 10);
        this.callbacks.onSelect({
          year: this.currentYear,
          month: this.currentMonth,
          day: day
        });
        this.destroy();
      });
    });
  }

  public destroy(): void {
    document.removeEventListener('mousedown', this.clickOutsideHandler);
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    if (this.callbacks.onClose) {
      this.callbacks.onClose();
    }
  }
}
