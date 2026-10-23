import React, { useEffect, useRef, useState } from 'react';
import {
  BsDate,
  AdDate,
  adToBs,
  bsToAd,
  formatBsDate,
  formatAdDate,
  parseBsDate
} from '@mero-miti/core';
import { CalendarPopover } from '@mero-miti/web/calendar-popover';
import { injectStyles } from '@mero-miti/web/styles';
import { MERO_MITI_ICON_DATA_URL } from '@mero-miti/web/icons';

export interface MeroMitiPickerProps {
  value?: string; // Formatted date string or empty
  onChange?: (bsDateStr: string, adDateStr: string, details: { bs: BsDate; ad: AdDate }) => void;
  format?: 'DD/MM/YYYY' | 'DD.MM.YYYY' | 'YYYY-MM-DD' | string;
  numeral?: 'en' | 'ne';
  placeholder?: string;
  label?: string;
  theme?: 'auto' | 'light' | 'dark';
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const MeroMitiPicker: React.FC<MeroMitiPickerProps> = ({
  value = '',
  onChange,
  format = 'DD/MM/YYYY',
  numeral = 'en',
  placeholder = 'DD/MM/YYYY',
  label,
  theme = 'auto',
  disabled = false,
  className = '',
  style
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [currentBsDate, setCurrentBsDate] = useState<BsDate | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<CalendarPopover | null>(null);

  useEffect(() => {
    injectStyles();
  }, []);

  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
      if (value) {
        const parsed = parseBsDate(value, format);
        if (parsed.isValid && parsed.parsed) {
          setCurrentBsDate(parsed.parsed);
          setErrorMessage('');
        }
      }
    }
  }, [value, format]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    const sepMatch = format.match(/[/.-]/);
    const sep = sepMatch ? sepMatch[0] : '/';

    const clean = raw.replace(/[^0-9०-९]/g, '');
    let masked = '';

    if (format.startsWith('YYYY')) {
      if (clean.length > 0) masked += clean.slice(0, 4);
      if (clean.length > 4) masked += sep + clean.slice(4, 6);
      if (clean.length > 6) masked += sep + clean.slice(6, 8);
    } else {
      if (clean.length > 0) masked += clean.slice(0, 2);
      if (clean.length > 2) masked += sep + clean.slice(2, 4);
      if (clean.length > 4) masked += sep + clean.slice(4, 8);
    }

    setInputValue(masked);

    if (masked.length >= 10) {
      const res = parseBsDate(masked, format);
      if (res.isValid && res.parsed) {
        setCurrentBsDate(res.parsed);
        setErrorMessage('');
        if (onChange) {
          const ad = bsToAd(res.parsed);
          onChange(masked, formatAdDate(ad, '-'), { bs: res.parsed, ad });
        }
      } else {
        setErrorMessage(res.error || 'अमान्य मिति');
      }
    } else {
      setErrorMessage('');
    }
  };

  const togglePopover = () => {
    if (disabled) return;
    if (isPopoverOpen && popoverRef.current) {
      popoverRef.current.destroy();
      popoverRef.current = null;
      setIsPopoverOpen(false);
    } else if (containerRef.current) {
      popoverRef.current = new CalendarPopover(containerRef.current, currentBsDate, {
        onSelect: (selectedBs: BsDate) => {
          setCurrentBsDate(selectedBs);
          const formatted = formatBsDate(selectedBs, { format, numeral });
          setInputValue(formatted);
          setErrorMessage('');
          setIsPopoverOpen(false);
          if (onChange) {
            const ad = bsToAd(selectedBs);
            onChange(formatted, formatAdDate(ad, '-'), { bs: selectedBs, ad });
          }
        },
        onClose: () => {
          setIsPopoverOpen(false);
        }
      });
      setIsPopoverOpen(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`mero-miti-companion-wrapper ${theme === 'dark' ? 'mero-miti-dark' : ''} ${className}`}
      style={style}
    >
      {label && (
        <label className="mero-miti-label">
          <span>{label}</span>
          <span className="mero-miti-badge">B.S.</span>
        </label>
      )}
      <div className={`mero-miti-input-group ${errorMessage ? 'mm-invalid' : ''}`}>
        <input
          type="text"
          className="mero-miti-input"
          placeholder={placeholder}
          value={inputValue}
          disabled={disabled}
          onChange={handleInputChange}
          maxLength={10}
        />
        <button
          type="button"
          className="mero-miti-icon-btn"
          disabled={disabled}
          onClick={togglePopover}
          title="पात्रो हेर्नुहोस्"
        >
          <img className="mero-miti-trigger-img" src={MERO_MITI_ICON_DATA_URL} alt="पात्रो" />
        </button>
        {errorMessage && <div className="mero-miti-tooltip">{errorMessage}</div>}
      </div>
    </div>
  );
};
