import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ScheduleService} from '../services/schedule.service';
import {Schedule} from '../dto/Schedule';
import {createScheduleForm, initValue} from '../shared/ScheduleValues';
import {EditScheduleComponent} from '../edit-schedule/edit-schedule.component';
import {MatDialog} from '@angular/material/dialog';
import {validateScheduleForm} from '../shared/FormValidation';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {NotificationComponent} from '../shared/notification.component';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

// import { expand } from '../animations/app.animation';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  animations: [
    //  expand()
  ]
})
export class ScheduleComponent implements OnInit {

  durationInSeconds = 2;
  @ViewChild('fform', {static: false}) scheduleFormDirective;
  schedules: Schedule[] = [];
  scheduleForm: FormGroup;
  schedule: Schedule;
  formErrors = {
    'name': '',
    'isPeriodic': '',
    'periodLength': '',
    'baseDayOfMonth': '',
    'startDate': ''
  };

  constructor(private service: ScheduleService,
              private fb: FormBuilder,
              public dialog: MatDialog,
              private _modalService: NgbModal,
              private snackBar: MatSnackBar) {
    createScheduleForm(this);
  }

  ngOnInit() {
    this.service.getSchedules().subscribe((schedules) => {
      this.schedules = schedules;
      for (const curSchedule of this.schedules) {
        const nextDate = new Date(curSchedule.nextDate);
        curSchedule['hint'] = '' +
          (curSchedule.isPeriodic
            ? ('Periodic, every ' +
              curSchedule.periodLength +
              ' ' +
              curSchedule.periodUnit +
              's, starting ' +
              new Date(curSchedule.startDate).toLocaleDateString())
            : ('Fixed on ' +
              curSchedule.baseDayOfMonth +
              ' every month')) +
          '\nnext date:' +
          nextDate.toLocaleDateString() +
          '\nfalls back ' +
          (curSchedule.isPriorWeekend ? 'prior' : 'after') +
          ' weekend';
      }
    });
  }

  onSubmit() {
    this.schedule = this.scheduleForm.value;
    this.service.postSchedule(this.schedule).subscribe((schedule) => this.schedules.push(schedule));
    this.scheduleFormDirective.resetForm(initValue);
    this.schedule = null;
  }

  onValueChanged(data?: any) {
    validateScheduleForm(this, data);
  }

  deleteSchedule(id: number) {
    let curSchedule: Schedule;
    for (let i = 0; i < this.schedules.length; i++) {
      if (this.schedules[i].id === id) {
        curSchedule = this.schedules[i];
        break;
      }
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Delete schedule \'' + curSchedule.name + '\'?'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result === 'Ok') {
        this.service.deleteSchedule(id).subscribe((status) => {
          if (status.status === 'OK') {
            for (let i = 0; i < this.schedules.length; i++) {
              if (this.schedules[i].id === id) {
                this.schedules.splice(i, 1);
                this.openSnackBar('Schedule deleted', false);
                break;
              }
            }
          } else {
            this.openSnackBar(status.status, true);
          }
        }, errMess => {
          this.openSnackBar(errMess, true);
        });
      }});
  }

  openEditForm(id: number) {
    const dialogRef = this.dialog.open(EditScheduleComponent, {
      width: '348px',
      data: {id: id}
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.openSnackBar(result.message, result.isError);
        if (!result.isError) {
          console.log(this.schedules);
          this.schedules = this.schedules.map(s => s.id === id ? result.schedule : s);
          console.log(this.schedules);
        }}
    });
  }

  openSnackBar(message: string, isError: boolean) {
    const config = new MatSnackBarConfig();
    config.data = {message: message, class: (isError ? 'error' : 'success')};
    config.duration = this.durationInSeconds * 1000;
    this.snackBar.openFromComponent(NotificationComponent, config);
  }
}
