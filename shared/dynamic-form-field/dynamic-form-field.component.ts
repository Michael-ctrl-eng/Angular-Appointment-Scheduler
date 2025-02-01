import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dynamic-form-field',
  templateUrl: './dynamic-form-field.component.html',
  styleUrls: ['./dynamic-form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom
})
export class DynamicFormFieldComponent implements OnInit, OnDestroy {
  @Input() fieldSchema: any;
  @Input() formGroup!: FormGroup;
  isVisible: boolean = true;
  private visibilitySubscription: Subscription | undefined;

  constructor() { }

  ngOnInit(): void {
    this.checkVisibilityCondition();
    this.subscribeToValueChanges();
  }

  ngOnDestroy(): void {
    if (this.visibilitySubscription) {
      this.visibilitySubscription.unsubscribe();
    }
  }

  get control() {
    return this.formGroup.get(this.fieldSchema.name);
  }

  private checkVisibilityCondition(): void {
    if (this.fieldSchema.condition) {
      const condition = this.fieldSchema.condition;
      const controllingControl = this.formGroup.get(condition.field);
      if (controllingControl) {
        this.isVisible = condition.values.includes(controllingControl.value);
      } else {
        this.isVisible = false;
        console.warn(`Controlling field "${condition.field}" not found for conditional field "${this.fieldSchema.name}"`);
      }
    } else {
      this.isVisible = true;
    }
  }

  private subscribeToValueChanges(): void {
    if (this.fieldSchema.condition) {
      const condition = this.fieldSchema.condition;
      const controllingControl = this.formGroup.get(condition.field);
      if (controllingControl) {
        this.visibilitySubscription = controllingControl.valueChanges.subscribe(() => {
          this.checkVisibilityCondition();
        });
      }
    }
  }
}
