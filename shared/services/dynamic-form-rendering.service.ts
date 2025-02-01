import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CustomValidatorsService } from './custom-validators.service';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormRenderingService {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private customValidatorsService: CustomValidatorsService
  ) { }

  loadFormSchema(schemaPath: string): Observable<any> {
    return this.http.get<any>(schemaPath).pipe(
      map(schema => {
        // Basic schema validation example (add more robust validation using JSON Schema if needed)
        if (!schema || !schema.fields || !Array.isArray(schema.fields)) {
          throw new Error('Invalid form schema format.');
        }
        return schema;
      }),
      catchError(error => {
        console.error('Error loading form schema:', error);
        return of(null);
      })
    );
  }

  generateFormGroup(schema: any): FormGroup {
    const formGroup: FormGroup = this.fb.group({}, { validators: this.getFormGroupValidators(schema.validators, schema.fields) });

    if (schema && schema.fields) {
      schema.fields.forEach((fieldSchema: any) => {
        formGroup.addControl(fieldSchema.name, this.createFormControl(fieldSchema));
      });
    }

    return formGroup;
  }

  private createFormControl(fieldSchema: any): FormControl {
    const validators: ValidatorFn[] = this.getValidators(fieldSchema.validators, fieldSchema.name);
    return this.fb.control('', validators);
  }

  private getValidators(validatorsConfig: string[] | undefined, fieldName: string): ValidatorFn[] {
    if (!validatorsConfig || !Array.isArray(validatorsConfig)) {
      return [];
    }

    const validatorFns: ValidatorFn[] = [];
    validatorsConfig.forEach(validatorName => {
      if (validatorName === 'required') {
        validatorFns.push(Validators.required);
      } else if (validatorName.startsWith('minLength:')) {
        const length = parseInt(validatorName.split(':')[1], 10);
        if (!isNaN(length)) {
          validatorFns.push(Validators.minLength(length));
        }
      } else if (validatorName.startsWith('maxLength:')) {
        const length = parseInt(validatorName.split(':')[1], 10);
        if (!isNaN(length)) {
          validatorFns.push(Validators.maxLength(length));
        }
      } else if (validatorName.startsWith('pattern:')) {
        const pattern = validatorName.split(':')[1];
        if (pattern) {
          validatorFns.push(Validators.pattern(pattern));
        }
      } else if (validatorName === 'email') {
        validatorFns.push(Validators.email);
      } else if (validatorName.startsWith('max:')) {
        const maxVal = parseInt(validatorName.split(':')[1], 10);
        if (!isNaN(maxVal)) {
          validatorFns.push(Validators.max(maxVal));
        }
      } else if (validatorName.startsWith('min:')) {
        const minVal = parseInt(validatorName.split(':')[1], 10);
        if (!isNaN(minVal)) {
          validatorFns.push(Validators.min(minVal));
        }
      } else if (validatorName === 'validDateTimeRange') {
        validatorFns.push(this.customValidatorsService.validDateTimeRange());
      }
      // ... Add logic to handle more custom validators by name ...
    });
    return validatorFns;
  }

  private getFormGroupValidators(validatorsConfig: string[] | undefined, fieldsSchema: any[]): ValidatorFn[] {
    if (!validatorsConfig || !Array.isArray(validatorsConfig)) {
      return [];
    }

    const validatorFns: ValidatorFn[] = [];
    validatorsConfig.forEach(validatorName => {
       if (validatorName === 'validDateTimeRange') {
          validatorFns.push(this.customValidatorsService.validDateTimeRange());
        }
      // ... Add logic to handle more form-level custom validators by name ...
    });
    return validatorFns;
  }
}
