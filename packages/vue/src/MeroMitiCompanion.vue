<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { MeroMitiCompanionBridge, CompanionOptions } from '@mero-miti/web/companion-bridge';

interface Props extends CompanionOptions {
  target: HTMLInputElement | string;
}

const props = defineProps<Props>();
let bridge: MeroMitiCompanionBridge | null = null;

onMounted(() => {
  const el = typeof props.target === 'string'
    ? document.querySelector<HTMLInputElement>(props.target)
    : props.target;

  if (el) {
    bridge = new MeroMitiCompanionBridge(el, props);
  }
});

onBeforeUnmount(() => {
  if (bridge) {
    bridge.destroy();
    bridge = null;
  }
});
</script>

<template>
  <!-- Mounts companion field directly adjacent to target in the DOM -->
  <span style="display: none;"></span>
</template>
