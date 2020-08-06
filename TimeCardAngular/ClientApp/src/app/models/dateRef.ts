export class DateRef {

  static baselineDate = "12/22/2018";
  static dayTicks = 24 * 60 * 60 * 1000;

  static getWorkDay(date: Date): number {
    if (date == null) {
      return 0;
    }
    const refDate = new Date(this.baselineDate);
    if (date < refDate) {
      return 0;
    }

    const days: number = (date.getTime() - refDate.getTime()) / this.dayTicks;
    return Math.floor(days / 14) + days % 14;

  }

  static currentWorkCycle(): number {
    return Math.floor(this.getWorkDay(new Date()));
  }

  static getWorkDate(workDay: number): Date {
    const cycle: number = Math.floor(workDay);
    const refNumber = new Date(this.baselineDate).getTime();
    const resultNumber = refNumber + (cycle * 14 + (workDay - cycle) * 100) * this.dayTicks;
    console.log('getWorkDate', { result: resultNumber });
    return new Date(resultNumber);
  }

  static periodEndDate(workDay: number): Date {
    const cycle: number = Math.floor(workDay);
    const refNumber = new Date(this.baselineDate).getTime();
    const resultNumber = refNumber + (cycle * 14 + 13) * this.dayTicks;
    return new Date(resultNumber);
  }

  static toString(d: Date) {
    return this.padLeft2(d.getMonth() + 1) + '/' + this.padLeft2(d.getDate()) + '/' + d.getFullYear.toString().slice(-2);
  }

  static toDate(s: string) {
    const ds: number[] = s.split(/\D/).map(t => parseInt(t));
    if (ds.length == 3) {
      return new Date(ds[0], ds[1] - 1, ds[2]);
    }
    return this.invalidDate();
  }

  static invalidDate() {
    return new Date(2000, 0, 1);
  }

  private static padLeft2(n: number): string {
    return ('0' + n).slice(-2);
  }
}
