import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateParserService {

  constructor() {}

  parseEventDate(dateString: string): { startDate: Date; endDate: Date } {
    const endDateString = dateString.split(' - ')[1] || dateString; // Extract end date or use the same as start date

    const dateParts = endDateString.split(' ');
    const [datePart, timePart] = dateParts;

    const [day, month, year] = datePart.split('.').map(Number); // Convert string parts to numbers

    let hours = 0;
    let minutes = 0;

    if (timePart) {
      const [hoursStr, minutesStr] = timePart.split(':');
      hours = parseInt(hoursStr, 10);
      minutes = parseInt(minutesStr, 10);
    }

    const startDate = new Date(year, month - 1, day, hours, minutes);
    const endDate = new Date(startDate);

    return { startDate, endDate };
  }
}
