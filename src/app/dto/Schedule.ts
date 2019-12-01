export class Schedule {
  id: number;
  name: string;
  isPeriodic: boolean;
  periodLength: number;
  periodUnit: string;
  startDate: string;
  baseDayOfMonth: number;
  isPriorWeekend: boolean;
  nextDate: string;
  canDelete: boolean;
}
