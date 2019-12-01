import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Schedule} from '../dto/Schedule';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ScheduleService} from '../services/schedule.service';
import {createScheduleForm} from '../shared/ScheduleValues';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {validateScheduleForm} from '../shared/FormValidation';

@Component({
  selector: 'app-edit-schedule',
  templateUrl: './edit-schedule.component.html',
  styleUrls: ['../schedule/schedule.component.css']
})
export class EditScheduleComponent implements OnInit {

  id: number;
  @ViewChild('fform', {static: false}) scheduleFormDirective;
  scheduleForm: FormGroup;
  schedule: Schedule;
  formErrors = {
    'name': '',
    'isPeriodic': '',
    'periodLength': '',
    'baseDayOfMonth': '',
    'startDate': ''
  };

  constructor(private scheduleService: ScheduleService,
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<EditScheduleComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.id = data.id;
    createScheduleForm(this);
  }

  ngOnInit() {
    this.scheduleService.getSchedule(this.id).subscribe((schedule) => {
      this.scheduleForm.patchValue({
        name: schedule.name,
        isPeriodic: schedule.isPeriodic ? 'true' : 'false',
        baseDayOfMonth: schedule.baseDayOfMonth,
        periodUnit: schedule.periodUnit,
        periodLength: schedule.periodLength,
        startDate: new Date(schedule.startDate).toISOString().slice(0, 10),
        isPriorWeekend: schedule.isPriorWeekend
      });
    });
  }

  onValueChanged(data?: any) {
    validateScheduleForm(this, data);
  }

  onSubmit() {
    this.schedule = this.scheduleForm.value;
    this.schedule.id = this.id;
    this.scheduleService.putSchedule(this.schedule).subscribe((schedule) => {
      this.dialogRef.close({message: 'Schedule updated', isError: false, schedule: schedule});
    }, error => {
      this.dialogRef.close({message: error, isError: true});
    });
    this.scheduleForm.disable();
  }
}
