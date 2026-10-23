import type { App, Plugin } from 'vue';
import MeroMitiPicker from './MeroMitiPicker.vue';
import MeroMitiCompanion from './MeroMitiCompanion.vue';

export { MeroMitiPicker, MeroMitiCompanion };
export * from '@mero-miti/core';

export const MeroMitiPlugin: Plugin = {
  install(app: App) {
    app.component('MeroMitiPicker', MeroMitiPicker);
    app.component('MeroMitiCompanion', MeroMitiCompanion);
  }
};

export default MeroMitiPlugin;
