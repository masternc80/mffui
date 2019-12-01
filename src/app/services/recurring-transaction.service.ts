import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {baseURL} from '../settings';
import {catchError} from 'rxjs/operators';
import {RecurringTransaction} from '../dto/RecurringTransaction';

@Injectable({
  providedIn: 'root'
})
export class RecurringTransactionService {

  transactionURL: string = baseURL + 'transaction';
  constructor(private http: HttpClient) { }

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
  getRecurringTransactions(): Observable<RecurringTransaction[]> {
    return this.http.get<RecurringTransaction[]>(this.transactionURL)
      .pipe(catchError(this.handleError));
  }

  postRecurringTransaction(transaction: RecurringTransaction): Observable<RecurringTransaction> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post<RecurringTransaction>(this.transactionURL, transaction, httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteRecurringTransaction(id: number): Observable<{status: string}> {
    return this.http.delete<{status: string}>(this.transactionURL + '/' + id)
      .pipe(catchError(this.handleError));
  }

  getRecurringTransaction(id: any): Observable<RecurringTransaction> {
    return this.http.get<RecurringTransaction>(this.transactionURL + '/' + id)
      .pipe(catchError(this.handleError));
  }

  putRecurringTransaction(transaction: RecurringTransaction) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.put<Account>(this.transactionURL + '/' + transaction.id, transaction, httpOptions)
      .pipe(catchError(this.handleError));
  }

}
