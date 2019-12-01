import { Routes } from '@angular/router';
import {ForecastComponent} from './forecast/forecast.component';
import {ScheduleComponent} from './schedule/schedule.component';
import {RecurringTransactionsComponent} from './recurring-transactions/recurring-transactions.component';
import {AccountsComponent} from './accounts/accounts.component';

export const appRoutes: Routes = [
  { path: 'forecast', component: ForecastComponent },
  { path: '',
    redirectTo: '/forecast',
    pathMatch: 'full'
  },
  { path: 'schedules', component: ScheduleComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'recurring', component: RecurringTransactionsComponent }
];
