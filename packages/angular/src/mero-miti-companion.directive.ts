import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Optional
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { MeroMitiCompanionBridge, CompanionOptions } from '@meromiti/web/companion-bridge';

@Directive({
  selector: 'input[meroMitiCompanion]'
})
export class MeroMitiCompanionDirective implements OnInit, OnDestroy {
  @Input('meroMitiCompanion') options?: CompanionOptions;

  private bridge: MeroMitiCompanionBridge | null = null;

  constructor(
    private el: ElementRef<HTMLInputElement>,
    @Optional() private ngControl?: NgControl
  ) {}

  ngOnInit(): void {
    const input = this.el.nativeElement;
    this.bridge = new MeroMitiCompanionBridge(input, this.options || {});
  }

  ngOnDestroy(): void {
    if (this.bridge) {
      this.bridge.destroy();
      this.bridge = null;
    }
  }
}
