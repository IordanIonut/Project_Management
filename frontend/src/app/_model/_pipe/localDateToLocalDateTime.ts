import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localDateToLocalDateTime',
  standalone: true,
})
export class LocalDateToLocalDateTimePipe implements PipeTransform {
  transform(value: string | Date, time: string = '00:00:00'): string {
    if (!value) {
      return '';
    }

    let year: number, month: number, day: number;
    let hours = 0,
      minutes = 0,
      seconds = 0;

    if (value instanceof Date) {
      year = value.getFullYear();
      month = value.getMonth() + 1;
      day = value.getDate();
    } else {
      const [y, m, d] = value.split('-').map(Number);
      year = y;
      month = m;
      day = d;
    }

    if (time) {
      [hours, minutes, seconds] = time.split(':').map(Number);
    }

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(
      minutes
    )}:${pad(seconds)}`;
  }
}
