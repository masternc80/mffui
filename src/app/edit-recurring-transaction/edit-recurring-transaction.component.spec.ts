import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRecurringTransactionComponent } from './edit-recurring-transaction.component';

describe('EditRecurringTransactionComponent', () => {
  let component: EditRecurringTransactionComponent;
  let fixture: ComponentFixture<EditRecurringTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRecurringTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRecurringTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
