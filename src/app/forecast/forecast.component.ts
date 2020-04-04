import {Component, ElementRef, OnInit, Renderer, Renderer2, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {ForecastService} from '../services/forecast.service';
import {Transaction} from '../dto/Transaction';
import {MatIcon, MatTable} from '@angular/material';
import {toNumbers} from '@angular/compiler-cli/src/diagnostics/typescript_version';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {

  displayCross: boolean;
  displayEdit: boolean;
  editCallback: any;
  deleteCallback: any;
  editForm: FormGroup;

  header = {'recordDate': 'Date', 'amount': 'Amount', 'balance': 'Balance', 'description': 'Description'};
  fields: string[] = ['recordDate', 'amount', 'balance', 'description'];
  transactions: Transaction[] = [];
  @ViewChild('forecast', {static: false}) forecastTable;

  constructor(private service: ForecastService,
              private renderer: Renderer2,
              private fb: FormBuilder,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) {
    this.editForm = this.fb.group({
      date: new FormControl('', Validators.required),
      amount: new FormControl( '', Validators.required),
      description: new FormControl('', Validators.compose([Validators.required, Validators.min(3), Validators.max(30)]))
    });
    this.editForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
  }

  ngOnInit() {
    this.service.getForecast().subscribe((transactions) => {
      this.transactions = transactions;
      let i = 0;
      this.transactions.forEach(t => {
        i++;
        if (t.credit === 0) {
          t['amount'] = '(' + t.debit.toString() + ')';
          t['amount-class'] = '-negative';
        } else {
          t['amount'] = t.credit.toString();
          t['amount-class'] = '-positive';
        }
      });
    });
    this.displayCross = this.displayEdit = true;
  }

  mouseOver(element: Transaction, column: string) {
    if (column === 'recordDate' && this.displayCross) {
      const cell = document.getElementById('leftspanrecordDate' + element.id);
      if (cell) {
        cell.className = 'floatingEntry';
        cell.innerHTML = '+';
      }
    } else
    if (column === 'description' && this.displayEdit) {
      const cell = document.getElementById('rightspandescription' + element.id);
      if (cell) {
        cell.className = 'floatingEdit';
        const table = document.getElementById('actionsTable');
        this.renderer.appendChild(cell, table);
        table.hidden = false;
        const edit = document.getElementById('edittr');
        const thisclass = this;
        this.editCallback = function(event) {
          thisclass.editTransaction(element);
        };
        edit.addEventListener('click', this.editCallback);
      }
    }
  }
  mouseOut(element: Transaction, column: string) {
    if (column === 'recordDate' && this.displayCross) {
      const cell = document.getElementById('leftspanrecordDate' + element.id);
      if (cell) {
        const childNodes = cell.childNodes;
        cell.innerHTML = '';
      }
    } else
    if (column === 'description' && this.displayEdit) {
      const cell = document.getElementById('rightspandescription' + element.id);
      if (cell) {
        const table = document.getElementById('actionsTable');
        const div = document.getElementById('mainDiv');
        div.appendChild(table);
        table.hidden = true;
        const edit = document.getElementById('edittr');
        edit.removeEventListener('click', this.editCallback);
      }
    }
  }
  addRow(id: number) {
    const table: MatTable<Transaction> = this.forecastTable;
    this.displayCross = false;
    this.displayEdit = false;
    for (let i = 0; i < this.transactions.length; i++) {
      const t = this.transactions[i];
      let item: Transaction = { id: -1 };
      if (t.id === id) {
        item['amount-class'] = '-neutral';
        item['oldId'] = id;
        this.transactions.splice(i + 1, 0, item);
        table.renderRows();
        const row = document.getElementById('row' + id).nextElementSibling;
        row.setAttribute('id', 'insertRow');
        const newRow = document.getElementById('newRow').childNodes;
        row.innerHTML = '';
        while (newRow.length > 0) {
          row.appendChild(newRow.item(0));
        }
        break;
      }
    }
    const cell = document.getElementById('spanrecordDate' + id.toString());
    if (cell) {
      cell.innerHTML = '';
    }
  }

  spanClick(element: Transaction, column: string) {
    if (column === 'recordDate') {
      const cell = document.getElementById('leftspanrecordDate' + element.id);
      if (cell.innerHTML === '+') {
        cell.innerHTML = '‒';
        this.addRow(element.id);
        this.editForm.reset();
      } else {
        this.cancelTransaction();
        cell.innerHTML = '+';
      }
    }
  }

  cancelTransaction() {
    const table: MatTable<Transaction> = this.forecastTable;
    const newRow = document.getElementById('newRow');
    const insertRow = document.getElementById('row-1').childNodes;
    while (insertRow.length > 0) {
      newRow.appendChild(insertRow.item(0));
    }
    for (let i = 0; i < this.transactions.length; i++) {
      const t = this.transactions[i];
      if (t.id === -1) {
        this.transactions.splice(i, 1);
        const cell = document.getElementById('leftspanrecordDate' + t['oldId']);
        cell.innerHTML = '';
      }
      const row = document.getElementById('row' + t.id);
      row.hidden = false;
    }
    table.renderRows();
    this.displayCross = true;
    this.displayEdit = true;
  }

  editTransaction(element: any) {
    const edit = document.getElementById('edittr');
    edit.removeEventListener('click', this.editCallback);
    const id = element['id'];
    this.addRow(id);
    this.transactions.forEach((t) => {
      if (t['id'] === id) {
        this.editForm.patchValue({
          'date': t.recordDateValue,
          'amount': t.credit === 0 ? -t.debit : t.credit,
          'description': t.description
        });
      }
    });
    const row = document.getElementById('row' + id);
    row.hidden = true;
  }

  private onValueChanged(data: any) {
  }
}
