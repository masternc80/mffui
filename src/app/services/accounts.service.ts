import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {baseURL} from '../settings';
import {catchError} from 'rxjs/operators';
import {Account} from '../dto/Account';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

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
  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(baseURL + 'account')
      .pipe(catchError(this.handleError));
  }

  postAccount(account: Account): Observable<Account> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post<Account>(baseURL + 'account', account, httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteAccount(id: number): Observable<{status: string}> {
    return this.http.delete<{status: string}>(baseURL + 'account/' + id)
      .pipe(catchError(this.handleError));
  }

  getAccount(id: any): Observable<Account> {
    return this.http.get<Account>(baseURL + 'account/' + id)
      .pipe(catchError(this.handleError));
  }

  putAccount(account: Account) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.put<Account>(baseURL + 'account/' + account.id, account, httpOptions)
      .pipe(catchError(this.handleError));
  }
}
