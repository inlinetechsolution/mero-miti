<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import {
  BsDate,
  AdDate,
  adToBs,
  bsToAd,
  formatBsDate,
  formatAdDate,
  parseBsDate
} from '@meromiti/core';
import { CalendarPopover } from '@meromiti/web/calendar-popover';
import { injectStyles } from '@meromiti/web/styles';
import { MERO_MITI_ICON_DATA_URL } from '@meromiti/web/icons';

interface Props {
  modelValue?: string;
  format?: string;
  numeral?: 'en' | 'ne';
  placeholder?: string;
  label?: string;
  locale?: 'ne' | 'en';
  theme?: 'auto' | 'light' | 'dark';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  format: 'DD/MM/YYYY',
  numeral: 'en',
  placeholder: 'DD/MM/YYYY',
  label: '',
  locale: 'ne',
  theme: 'auto',
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', bsStr: string, adStr: string, details: { bs: BsDate; ad: AdDate }): void;
  (e: 'select', bsDate: BsDate): void;
  (e: 'adChange', adDateStr: string): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const inputValue = ref(props.modelValue);
const errorMessage = ref('');
const currentBsDate = ref<BsDate | null>(null);
let popoverInstance: CalendarPopover | null = null;

onMounted(() => {
  injectStyles();
  if (props.modelValue) {
    validateAndSync(props.modelValue, false);
  }
});

onBeforeUnmount(() => {
  if (popoverInstance) {
    popoverInstance.destroy();
    popoverInstance = null;
  }
});

watch(() => props.modelValue, (newVal) => {
  if (newVal !== inputValue.value) {
    inputValue.value = newVal;
    validateAndSync(newVal, false);
  }
});

function validateAndSync(val: string, emitEvent = true) {
  if (val.length >= 10) {
    const res = parseBsDate(val, props.format, props.locale);
    if (res.isValid && res.parsed) {
      currentBsDate.value = res.parsed;
      errorMessage.value = '';
      if (emitEvent) {
        const ad = bsToAd(res.parsed);
        const adFormatted = formatAdDate(ad, '-');
        emit('change', val, adFormatted, { bs: res.parsed, ad });
        emit('adChange', adFormatted);
      }
    } else {
      errorMessage.value = res.error || 'अमान्य मिति';
    }
  } else {
    errorMessage.value = '';
  }
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  let raw = target.value;
  const sep = props.format.includes('.') ? '.' : (props.format.includes('-') ? '-' : '/');
  const clean = raw.replace(/[^0-9०-९]/g, '');
  let masked = '';

  if (props.format.startsWith('YYYY')) {
    if (clean.length > 0) masked += clean.slice(0, 4);
    if (clean.length > 4) masked += sep + clean.slice(4, 6);
    if (clean.length > 6) masked += sep + clean.slice(6, 8);
  } else {
    if (clean.length > 0) masked += clean.slice(0, 2);
    if (clean.length > 2) masked += sep + clean.slice(2, 4);
    if (clean.length > 4) masked += sep + clean.slice(4, 8);
  }

  inputValue.value = masked;
  emit('update:modelValue', masked);
  validateAndSync(masked, true);
}

function togglePopover() {
  if (props.disabled || !containerRef.value) return;

  if (popoverInstance) {
    popoverInstance.destroy();
    popoverInstance = null;
  } else {
    popoverInstance = new CalendarPopover(
      containerRef.value,
      currentBsDate.value,
      {
        onSelect: (selectedBs: BsDate) => {
          currentBsDate.value = selectedBs;
          const formatted = formatBsDate(selectedBs, {
            format: props.format,
            numeral: props.numeral
          });
          inputValue.value = formatted;
          errorMessage.value = '';
          emit('update:modelValue', formatted);
          emit('select', selectedBs);

          const ad = bsToAd(selectedBs);
          const adFormatted = formatAdDate(ad, '-');
          emit('change', formatted, adFormatted, { bs: selectedBs, ad });
          emit('adChange', adFormatted);

          popoverInstance = null;
        },
        onClose: () => {
          popoverInstance = null;
        }
      },
      props.locale
    );
  }
}
</script>

<template>
  <div
    ref="containerRef"
    class="mero-miti-companion-wrapper"
    :class="{ 'mero-miti-dark': theme === 'dark' }"
  >
    <label v-if="label" class="mero-miti-label">
      <span>{{ label }}</span>
    </label>

    <div class="mero-miti-input-group" :class="{ 'mm-invalid': errorMessage }">
      <span class="mero-miti-inline-badge">
        {{ locale === 'ne' ? 'वि.सं.' : 'B.S.' }}
      </span>

      <input
        type="text"
        class="mero-miti-input"
        :placeholder="placeholder"
        :value="inputValue"
        :disabled="disabled"
        maxlength="10"
        autocomplete="off"
        spellcheck="false"
        @input="handleInput"
      />

      <button
        type="button"
        class="mero-miti-icon-btn"
        :disabled="disabled"
        title="पात्रो हेर्नुहोस्"
        @click="togglePopover"
      >
        <img class="mero-miti-trigger-img" :src="MERO_MITI_ICON_DATA_URL" alt="पात्रो" />
      </button>

      <div v-if="errorMessage" class="mero-miti-tooltip">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>
