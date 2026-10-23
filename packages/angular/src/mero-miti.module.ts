import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeroMitiPickerComponent } from './mero-miti-picker.component';
import { MeroMitiCompanionDirective } from './mero-miti-companion.directive';

@NgModule({
  declarations: [
    MeroMitiPickerComponent,
    MeroMitiCompanionDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MeroMitiPickerComponent,
    MeroMitiCompanionDirective
  ]
})
export class MeroMitiModule {}
