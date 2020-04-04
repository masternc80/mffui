import { FormControl, Validators} from '@angular/forms';
import {validatorField} from './FormValidation';
import {Schedule} from '../dto/Schedule';

export const initValue = {
  name: '',
  isPeriodic: null,
  periodLength: '',
  periodUnit: 'DAY',
  startDate: '',
  baseDayOfMonth: null,
  isPriorWeekend: false
};

export function createScheduleForm(scheduleClass: any) {
  scheduleClass.scheduleForm = scheduleClass.fb.group({
    name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(25)])),
    isPeriodic: new FormControl(null, Validators.required),
    periodLength: new FormControl('',
      Validators.compose([
        Validators.pattern('^[0-9]*$'),
        Validators.min(1),
        Validators.max(31),
        validatorField(true, scheduleClass)
      ])),
    periodUnit: new FormControl('DAY'),
    startDate: new FormControl('', validatorField(true, scheduleClass)),
    baseDayOfMonth: new FormControl(null,
      Validators.compose([
        Validators.pattern('^[0-9]*$'),
        Validators.min(1),
        Validators.max(31),
        validatorField(false, scheduleClass)
      ])),
    isPriorWeekend: new FormControl(false)
  });
  scheduleClass.scheduleForm.valueChanges
    .subscribe(data => scheduleClass.onValueChanged(data));
}

export function findSchedule(id: number, scheduleClass: any): Schedule {
  for (const schedule of scheduleClass.schedules) {
    if (schedule.id === id) {
      return schedule;
    }
  }
  return {
    baseDayOfMonth: 0,
    isPeriodic: false,
    isPriorWeekend: false,
    nextDate: '',
    periodLength: 0,
    periodUnit: '',
    startDate: '',
    id: id,
    name: '<MISSING>',
    canDelete: false
  };
}
