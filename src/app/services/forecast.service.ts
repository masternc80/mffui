import { Injectable } from '@angular/core';
import {baseURL} from '../settings';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Transaction} from '../dto/Transaction';

@Injectable({
  providedIn: 'root'
})
export class ForecastService {
  forecastURL: string = baseURL + 'forecast';

  constructor(private http: HttpClient) {
  }

  public handleError(response: HttpErrorResponse | any) {
    let errMsg: string;

    if (response.error instanceof ErrorEvent) {
      errMsg = response.error.message;
    } else {
      const error = response.error;
      console.log(error);
      errMsg = `${error.status} - ${error.statusText || ''} ${error.error}`;
    }

    return throwError(errMsg);
  }

  getForecast(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.forecastURL)
      .pipe(catchError(this.handleError));
  }

}
