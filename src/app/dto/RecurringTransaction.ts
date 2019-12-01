import {Schedule} from './Schedule';

export class RecurringTransaction {
  id: number;
  name: string;
  amount: number;
  scheduleIds: number[];
  schedules: Schedule[];
}
