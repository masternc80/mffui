import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {baseURL} from '../settings';
import {Schedule} from '../dto/Schedule';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) {
  }

  getSchedules(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(baseURL + 'schedule')
      .pipe(catchError(this.handleError));
  }

  public handleError(response: HttpErrorResponse | any) {
    let errMsg: string;

    if (response.error instanceof ErrorEvent) {
      errMsg = response.error.message;
    } else {
      const error = response.error;
      errMsg = `${error.status} - ${error.statusText || ''} ${error.error}\n${error.message}`;
    }

    return throwError(errMsg);
  }

  postSchedule(schedule: Schedule): Observable<Schedule> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post<Schedule>(baseURL + 'schedule', schedule, httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteSchedule(id: number): Observable<{status: string}> {
    return this.http.delete<{status: string}>(baseURL + 'schedule/' + id)
      .pipe(catchError(this.handleError));
  }

  getSchedule(id: any): Observable<Schedule> {
    return this.http.get<Schedule>(baseURL + 'schedule/' + id)
      .pipe(catchError(this.handleError));
  }

  putSchedule(schedule: Schedule) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.put<Schedule>(baseURL + 'schedule/' + schedule.id, schedule, httpOptions)
      .pipe(catchError(this.handleError));
  }
}
