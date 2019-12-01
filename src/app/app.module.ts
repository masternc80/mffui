import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { MatGridListModule} from '@angular/material/grid-list';
import {HttpClientModule} from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { ForecastComponent } from './forecast/forecast.component';
import {ScheduleComponent} from './schedule/schedule.component';
import { RecurringTransactionsComponent } from './recurring-transactions/recurring-transactions.component';
import {ScheduleService} from './services/schedule.service';

import {appRoutes} from './routes';
import { EditScheduleComponent } from './edit-schedule/edit-schedule.component';
import { AccountsComponent } from './accounts/accounts.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import {NotificationComponent} from './shared/notification.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  exports: [
    MatDialogModule,
    MatInputModule,
  ],
  declarations: [
    AppComponent,
    ForecastComponent,
    ScheduleComponent,
    NotificationComponent,
    RecurringTransactionsComponent,
    EditScheduleComponent,
    AccountsComponent,
    EditAccountComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    HttpClientModule,
    FlexLayoutModule,
    MatGridListModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSliderModule,
    FormsModule,
    MatSlideToggleModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatSnackBarModule,
    NgbModule,
    RouterModule.forRoot(appRoutes),
    MatCardModule
  ],
  providers: [
    ScheduleService
  ],
  entryComponents: [
    AppComponent,
    EditScheduleComponent,
    EditAccountComponent,
    NotificationComponent,
    ConfirmDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
