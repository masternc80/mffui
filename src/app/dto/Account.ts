import {Schedule} from './Schedule';

export class Account {
  id: number;
  accountType: string;
  name: string;
  currentBalance: number;
  statementBalance: number;
  monthlySpend: number;
  scheduleId: number;
  schedule: Schedule;
}
