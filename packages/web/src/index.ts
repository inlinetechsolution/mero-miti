/**
 * Mero Miti (मेरो मिति) - Universal Web Bundle
 */

import {
  adToBs,
  bsToAd,
  formatBsDate,
  formatAdDate,
  parseBsDate,
  validateBsDate,
  registerYear,
  getDaysInBsMonth,
  getFiscalYear,
  getFiscalYearRange,
  getFiscalYearQuarters,
  BsDate,
  AdDate
} from '@meromiti/core';
import { MeroMitiCompanionBridge, CompanionOptions } from './companion-bridge';
import { injectStyles } from './styles';

export interface MeroMitiGlobalConfig extends CompanionOptions {
  mode?: 'auto' | 'manual';
  autoSelector?: string;
}

class MeroMitiManager {
  private attachedInstances: Map<HTMLInputElement, MeroMitiCompanionBridge> = new Map();
  private observer: MutationObserver | null = null;
  private config: MeroMitiGlobalConfig = {
    mode: 'manual',
    autoSelector: 'input[type="date"], input[data-mero-miti="auto"]',
    format: 'DD/MM/YYYY',
    position: 'right',
    theme: 'auto'
  };

  constructor() {
    if (typeof window !== 'undefined') {
      injectStyles();
      this.checkScriptAttributes();
    }
  }

  /**
   * Reads data-* attributes on the library's script tag for zero-config drop-in auto setup.
   */
  private checkScriptAttributes(): void {
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
      const isAuto = script.getAttribute('data-mero-miti-auto');
      if (isAuto === 'true' || isAuto === '') {
        const format = script.getAttribute('data-mero-miti-format') || 'DD/MM/YYYY';
        const position = (script.getAttribute('data-mero-miti-position') as 'right' | 'bottom') || 'right';
        const theme = (script.getAttribute('data-mero-miti-theme') as 'auto' | 'light' | 'dark') || 'auto';

        this.init({
          mode: 'auto',
          format,
          position,
          theme
        });
      }
    });
  }

  /**
   * Initializes Mero Miti with configuration options.
   */
  public init(config: MeroMitiGlobalConfig = {}): void {
    this.config = { ...this.config, ...config };

    if (this.config.mode === 'auto') {
      this.startAutoScan();
    }
  }

  /**
   * Scans DOM and binds companions to matching inputs.
   */
  public startAutoScan(): void {
    if (typeof document === 'undefined') return;

    const scanAndAttach = () => {
      const inputs = document.querySelectorAll<HTMLInputElement>(this.config.autoSelector || 'input[type="date"]');
      inputs.forEach(input => {
        const mm = input.getAttribute('data-mero-miti');
        if (mm === 'false' || mm === 'none' || mm === 'off' || input.getAttribute('data-mero-miti-ignore') === 'true') {
          return;
        }
        if (!this.attachedInstances.has(input) && !input.getAttribute('data-mero-miti-attached')) {
          this.attach(input, this.config);
        }
      });
    };

    const initObserver = () => {
      if (!this.observer && typeof MutationObserver !== 'undefined' && document.body) {
        this.observer = new MutationObserver(mutations => {
          let shouldScan = false;
          for (const m of mutations) {
            if (m.addedNodes.length > 0) {
              shouldScan = true;
              break;
            }
          }
          if (shouldScan) scanAndAttach();
        });
        this.observer.observe(document.body, { childList: true, subtree: true });
      }
    };

    // Scan initial DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        scanAndAttach();
        initObserver();
      });
    } else {
      scanAndAttach();
      initObserver();
    }
  }

  /**
   * Manually attaches a Mero Miti companion to a target element or selector.
   */
  public attach(
    target: string | HTMLInputElement,
    options: CompanionOptions = {}
  ): MeroMitiCompanionBridge | null {
    const input = typeof target === 'string'
      ? document.querySelector<HTMLInputElement>(target)
      : target;

    if (!input) {
      console.warn(`[Mero Miti] Target input not found:`, target);
      return null;
    }

    if (this.attachedInstances.has(input)) {
      return this.attachedInstances.get(input)!;
    }

    const mergedOptions: CompanionOptions = { ...this.config, ...options };
    input.setAttribute('data-mero-miti-attached', 'true');
    const bridge = new MeroMitiCompanionBridge(input, mergedOptions);
    this.attachedInstances.set(input, bridge);
    return bridge;
  }

  /**
   * Detaches and cleans up a companion from an input.
   */
  public detach(target: string | HTMLInputElement): void {
    const input = typeof target === 'string'
      ? document.querySelector<HTMLInputElement>(target)
      : target;

    if (input && this.attachedInstances.has(input)) {
      this.attachedInstances.get(input)!.destroy();
      this.attachedInstances.delete(input);
      input.removeAttribute('data-mero-miti-attached');
    }
  }

  // Expose Core Conversion & Registration APIs directly on MeroMiti
  public adToBs = adToBs;
  public bsToAd = bsToAd;
  public formatBsDate = formatBsDate;
  public formatAdDate = formatAdDate;
  public parseBsDate = parseBsDate;
  public validateBsDate = validateBsDate;
  public registerYear = registerYear;
  public version = '1.0.0';
  public getFiscalYear = getFiscalYear;
  public getFiscalYearRange = getFiscalYearRange;
  public getFiscalYearQuarters = getFiscalYearQuarters;
}

export const MeroMiti = new MeroMitiManager();

// Attach to window object for CDN / Vanilla usage
if (typeof window !== 'undefined') {
  (window as any).MeroMiti = MeroMiti;
}

export default MeroMiti;
