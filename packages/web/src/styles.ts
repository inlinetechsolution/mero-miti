/**
 * Mero Miti Injected CSS Styles
 * Scoped with .mero-miti-* to guarantee zero collisions with vendor CSS.
 */

export const MERO_MITI_STYLES = `
:root {
  --mm-primary: #10b981;
  --mm-primary-hover: #059669;
  --mm-primary-light: #ecfdf5;
  --mm-bg: #ffffff;
  --mm-card-bg: #ffffff;
  --mm-text: #1f2937;
  --mm-text-muted: #6b7280;
  --mm-border: #d1d5db;
  --mm-border-focus: #10b981;
  --mm-radius: 6px;
  --mm-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --mm-danger: #ef4444;
  --mm-font: inherit;
}

@media (prefers-color-scheme: dark) {
  [data-mero-miti-theme="auto"], .mero-miti-dark {
    --mm-bg: #1f2937;
    --mm-card-bg: #111827;
    --mm-text: #f9fafb;
    --mm-text-muted: #9ca3af;
    --mm-border: #374151;
    --mm-primary-light: #064e3b;
    --mm-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
  }
}

.mero-miti-dark {
  --mm-bg: #1f2937;
  --mm-card-bg: #111827;
  --mm-text: #f9fafb;
  --mm-text-muted: #9ca3af;
  --mm-border: #374151;
  --mm-primary-light: #064e3b;
}

/* Companion Container - Perfectly baseline aligned */
.mero-miti-companion-wrapper {
  display: inline-flex;
  flex-direction: column;
  position: relative;
  font-family: var(--mm-font);
  box-sizing: border-box;
  vertical-align: middle;
  margin-left: 8px;
  margin-top: 0;
  padding: 0;
}

.mero-miti-companion-wrapper.mm-block {
  display: flex;
  margin-left: 0;
  margin-top: 8px;
  width: 100%;
}

.mero-miti-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--mm-text-muted);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Input Group with auto-matching border & height */
.mero-miti-input-group {
  display: inline-flex;
  align-items: center;
  position: relative;
  background: var(--mm-bg);
  border: 1px solid var(--mm-border);
  border-radius: var(--mm-radius);
  height: 38px;
  box-sizing: border-box;
  vertical-align: middle;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.mero-miti-input-group:focus-within {
  border-color: var(--mm-border-focus);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.mero-miti-input-group.mm-invalid {
  border-color: var(--mm-danger) !important;
  animation: mm-shake 0.3s ease-in-out;
}

@keyframes mm-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

/* Inline [B.S.] or [वि.सं.] pill badge */
.mero-miti-inline-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 5px;
  margin-left: 6px;
  margin-right: 2px;
  border-radius: 4px;
  background: var(--mm-primary-light);
  color: var(--mm-primary);
  user-select: none;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.mero-miti-input {
  border: none;
  background: transparent;
  padding: 6px 8px;
  font-size: 14px;
  color: var(--mm-text);
  outline: none;
  font-family: inherit;
  width: 105px;
  box-sizing: border-box;
}

.mero-miti-icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--mm-text-muted);
  transition: color 0.15s ease;
  border-radius: var(--mm-radius);
  line-height: 1;
}

.mero-miti-icon-btn:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

.mero-miti-icon-btn img,
.mero-miti-trigger-img {
  width: 22px;
  height: 22px;
  object-fit: contain;
  display: block;
  border-radius: 4px;
}

.mero-miti-brand-mark {
  width: 16px;
  height: 16px;
  object-fit: contain;
  display: inline-block;
  vertical-align: middle;
  border-radius: 3px;
  margin-right: 4px;
}

/* Calendar Popover */
.mero-miti-popover {
  position: absolute;
  z-index: 99999;
  background: var(--mm-card-bg);
  border: 1px solid var(--mm-border);
  border-radius: var(--mm-radius);
  box-shadow: var(--mm-shadow);
  width: 290px;
  padding: 12px;
  box-sizing: border-box;
  font-family: var(--mm-font);
  color: var(--mm-text);
  user-select: none;
}

.mero-miti-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.mero-miti-selects {
  display: flex;
  gap: 4px;
}

.mero-miti-select {
  background: var(--mm-bg);
  color: var(--mm-text);
  border: 1px solid var(--mm-border);
  border-radius: 4px;
  padding: 2px 4px;
  font-size: 13px;
  outline: none;
  cursor: pointer;
}

.mero-miti-nav-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--mm-text-muted);
  border-radius: 4px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mero-miti-nav-btn:hover {
  background: var(--mm-primary-light);
  color: var(--mm-primary);
}

.mero-miti-lang-btn {
  background: var(--mm-primary-light);
  color: var(--mm-primary);
  border: 1px solid var(--mm-primary);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 2px;
}

.mero-miti-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: var(--mm-text-muted);
  margin-bottom: 6px;
}

.mero-miti-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.mero-miti-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  color: var(--mm-text);
}

.mero-miti-day:hover:not(.mm-empty) {
  background: var(--mm-primary-light);
  color: var(--mm-primary);
}

.mero-miti-day.mm-selected {
  background: var(--mm-primary) !important;
  color: #ffffff !important;
  font-weight: 700;
}

.mero-miti-day.mm-today {
  border: 1px solid var(--mm-primary);
  font-weight: 600;
}

.mero-miti-day.mm-saturday {
  color: var(--mm-danger);
}

.mero-miti-footer {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--mm-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
}

.mero-miti-today-btn {
  background: transparent;
  border: 1px solid var(--mm-primary);
  color: var(--mm-primary);
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
}

.mero-miti-today-btn:hover {
  background: var(--mm-primary);
  color: #ffffff;
}

.mero-miti-brand {
  color: var(--mm-text-muted);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 3px;
  font-weight: 600;
  font-size: 10px;
}

.mero-miti-brand:hover {
  color: var(--mm-primary);
}

.mero-miti-tooltip {
  position: absolute;
  bottom: -20px;
  left: 0;
  font-size: 11px;
  color: var(--mm-danger);
  white-space: nowrap;
  pointer-events: none;
}
`;

let stylesInjected = false;
export function injectStyles(): void {
  if (stylesInjected || typeof document === 'undefined') return;
  const styleEl = document.createElement('style');
  styleEl.setAttribute('data-mero-miti-styles', 'true');
  styleEl.textContent = MERO_MITI_STYLES;
  document.head.appendChild(styleEl);
  stylesInjected = true;
}
