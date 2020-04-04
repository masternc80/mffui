import {AbstractControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';

export const validationMessages = {
  name: {
    required: 'Name is required',
    minlength: 'Name must be at least 2 characters long',
    maxlength: 'Name cannot be more than 25 characters long'
  },
  isPeriodic: {
    'required': 'Schedule type is required'
  },
  periodLength: {
    'min': 'Minimum is 1',
    'max': 'Maximum is 31',
    'pattern': 'Only numbers allowed',
    'required': 'Period Length is required'
  },
  baseDayOfMonth: {
    'min': 'Minimum is 1',
    'max': 'Maximum is 31',
    'pattern': 'Only numbers allowed',
    'required': 'Day of month is required'
  },
  amount: {
    'required': 'Amount required',
    'pattern': 'Only numbers, minus and period allowed',
  },
  startDate: {
    'required': 'Start date is required'
  },
  currentBalance: {
    'required': 'Current balance is required',
    'pattern': 'Only numbers allowed',
  },
  statementBalance: {
    'required': 'Statement balance is required',
    'pattern': 'Only numbers allowed',
  },
  monthlySpend: {
    'required': 'Monthly spend is required',
    'pattern': 'Only numbers allowed',
  }
};

function updateError(formClass: any, field: string, form: any) {
  // clear previous error message (if any)
  formClass.formErrors[field] = '';
  const control = form.get(field);
  control.updateValueAndValidity({onlySelf: true, emitEvent: false});
  if (control && control.dirty && !control.valid) {
    const messages = validationMessages[field];
    if (messages) {
      for (const key in control.errors) {
        if (control.errors.hasOwnProperty(key)) {
          formClass.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
}

export function validateScheduleForm(scheduleClass: any, data?: any) {
  if (!scheduleClass.scheduleForm) {
    return;
  }
  const form = scheduleClass.scheduleForm;
  for (const field in scheduleClass.formErrors) {
    if (scheduleClass.formErrors.hasOwnProperty(field)) {
      updateError(scheduleClass, field, form);
    }
  }
  form.updateValueAndValidity({onlySelf: true, emitEvent: false});
  scheduleClass.schedule = scheduleClass.scheduleForm.value;
}

export function validateAccountForm(accountClass: any, data?: any) {
  if (!accountClass.accountForm) {
    return;
  }
  const form = accountClass.accountForm;
  for (const field in accountClass.formErrors) {
    if (accountClass.formErrors.hasOwnProperty(field)) {
      updateError(accountClass, field, form);
    }
  }
  form.updateValueAndValidity({onlySelf: true, emitEvent: false});
  accountClass.account = accountClass.accountForm.value;
}

export function validatorField(isPeriodic: Boolean, component: any): ValidatorFn {
  return function (currentControl: AbstractControl): ValidationErrors {
    if (component.scheduleForm != null && component.scheduleForm.get('isPeriodic').value === (isPeriodic ? 'true' : 'false')) {
      return Validators.required(currentControl);
    }
    return null;
  };
}

export function validateTransactionsForm(transactionClass: any, data?: any) {
  if (!transactionClass.transactionForm) {
    return;
  }
  const form = transactionClass.transactionForm;
  for (const field in transactionClass.formErrors) {
    if (transactionClass.formErrors.hasOwnProperty(field)) {
      updateError(transactionClass, field, form);
    }
  }
  let controls = false;
  for (const field in form.controls) {
    if (field && field.startsWith('schedule_')) {
      const control = form.get(field);
      if (control.value === true) {
        for (const subfield in form.controls) {
          if (subfield && subfield.startsWith('schedule_') && subfield !== field) {
            console.log('field ' + field + ', subfield: ' + subfield);
            const subcontrol = form.get(subfield);
            subcontrol.clearValidators();
            subcontrol.updateValueAndValidity({emitEvent: false});
            // console.log(control);
          }
        }
        controls = true;
      }
    }
  }
  if (controls === false) {
    for (const field in form.controls) {
      if (field && field.startsWith('schedule_')) {
        const control = form.get(field);
        control.setValidators( Validators.requiredTrue );
        control.updateValueAndValidity({emitEvent: false});
      }
    }
  }
  form.updateValueAndValidity({onlySelf: true, emitEvent: false});
  transactionClass.transaction = transactionClass.transactionForm.value;
}
