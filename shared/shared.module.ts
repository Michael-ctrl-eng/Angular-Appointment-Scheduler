import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from './angular-material.module';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { DynamicFormFieldComponent } from './dynamic-form-field/dynamic-form-field.component';

@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    DynamicFormFieldComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AngularMaterialModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AngularMaterialModule,
    ConfirmationDialogComponent,
    DynamicFormFieldComponent
  ]
})
export class SharedModule { }
