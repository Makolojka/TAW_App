import {Component, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
import {Ticket} from "../event-card/Ticket";
import {ActivatedRoute, Router} from "@angular/router";
import {CategoryFilterService} from "../../services/category-filter.service";

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  public items$: any;
  public ticketsMap: { [eventId: string]: Ticket[] } = {}; // Map to store tickets for each event
  public originalItems$: any;
  isRegularView = false; // Set the initial view to wide cards
  sortOption: string = '';
  locationFilter: string = '';
  categoriesFilterValue: string = '';
  subCategoriesFilterValue: string = '';
  startDate: string = '';
  endDate: string = '';
  isResultEmpty: boolean = false;

  // TODO: przerobić filtrowanie na requesty GET, żeby nie pobierać wszystkich wydarzeń
  onCategoryChange(event: Event) {
    // The selected value will be available in 'categoriesFilter' property
    console.log('Selected value:', this.categoriesFilterValue);
  }

  onSubCategoryChange(event: Event) {
    // The selected value will be available in 'categoriesFilter' property
    console.log('SubCategoriesFilterValue value:', this.subCategoriesFilterValue);
  }

  onDateStart(event: Event) {
    // The selected value will be available in 'categoriesFilter' property
    console.log('startDate value:', this.startDate);
  }

  onDateEnd(event: Event) {
    // The selected value will be available in 'categoriesFilter' property
    console.log('endDate value:', this.endDate);
  }

  toggleView(view: 'regular' | 'wide'): void {
    this.isRegularView = view === 'regular';
  }

  constructor(private service: DataService, private router: Router, private route:
    ActivatedRoute, private categoryFilterService: CategoryFilterService) {
  }

  ngOnInit() {
    this.getAll();
    this.categoriesFilterValue = this.categoryFilterService.selectedCategory;
    console.log('Selected category from home:', this.categoryFilterService.selectedCategory);
    this.applyFilters();
  }

  getAll() {
    this.service.getAll().subscribe(response => {
      this.items$ = response;
      this.fetchTicketsForEachEvent(); // Fetch tickets for each event after getting all events
      this.originalItems$ = response;
      this.startDate = '06.12.1999 18:00';
      this.endDate = '06.12.2100 18:00';
      if(!this.categoryFilterService.selectedCategory){
        this.categoriesFilterValue = 'Wszystkie';
      }
      this.subCategoriesFilterValue = 'Wszystkie';
      this.sortOption = 'default';
      this.applyFilters();
    });
  }

  fetchTicketsForEachEvent() {
    this.items$.forEach((event: any) => {
      this.service.getTicketsForEvent(event.id).subscribe((res: any) => {
        this.ticketsMap[event.id] = res;
      });
    });
  }

  // Applies filters
  applyFilters(): void {
    // Safeguard for cleaning a date
    if(this.startDate == '')
    {
      this.startDate = '06.12.1999 18:00';
    }
    else if(this.endDate == ''){
      this.endDate = '06.12.2100 18:00';
    }

    // if (!filteredItems || filteredItems.length === 0) {
    //   this.isResultEmpty = true;
    //   console.log("this.isResultEmpty: "+this.isResultEmpty)
    // }
    // else {
    //   this.isResultEmpty = false;
    //   console.log("this.isResultEmpty: "+this.isResultEmpty)
    // }

    if (!this.originalItems$ || this.originalItems$.length === 0) {
      return;
    }

    let filteredItems = [...this.originalItems$];

    // Filter by location
    if (this.locationFilter === '') {
      // console.log("this.locationFilter empty");
    } else if (this.locationFilter) {
      filteredItems = filteredItems.filter((item: any) =>
        item.location.toLowerCase().includes(this.locationFilter.toLowerCase())
      );
    }

    // Filter by categories
    if (this.categoriesFilterValue && this.categoriesFilterValue !== 'Wszystkie') {
      filteredItems = filteredItems.filter((item: any) => {
        if (item.category && Array.isArray(item.category)) {
          return item.category.includes(this.categoriesFilterValue);
        } else {
          // console.log("Skipped event without property 'category':", item.title);
          return false; // Skip the event if it doesn't have the 'category' property or it's not an array
        }
      });
    }

    // Filter by subcategories
    if (this.subCategoriesFilterValue && this.subCategoriesFilterValue !== 'Wszystkie') {
      filteredItems = filteredItems.filter((item: any) => {
        if (item.subCategory && Array.isArray(item.subCategory)) {
          return item.subCategory.includes(this.subCategoriesFilterValue);
        } else {
          // console.log("Skipped event without property 'subCategory':", item.title);
          return false; // Skip the event if it doesn't have the 'subCategory' property or it's not an array
        }
      });
    }

    // Filter by date range
    filteredItems = filteredItems.filter((item: any) => {
      const { startDate, endDate } = this.convertDate(item);
      const filterStartDate = new Date(this.startDate);
      // console.log("filterStartDate "+filterStartDate)
      const filterEndDate = new Date(this.endDate);
      // console.log("filterEndDate "+filterEndDate)
      return startDate >= filterStartDate && endDate <= filterEndDate;
    });

    // Apply sorting based on the user's selected option
    switch (this.sortOption) {
      case 'default':
        filteredItems.sort((a: any, b: any) => a.title.localeCompare(b.title));
        break;
      case 'popularity':
        filteredItems.sort((a: any, b: any) => b.views - a.views);
        break;
      case 'newest':
        filteredItems.sort((a: any, b: any) => {
          const dateA = a.createdAt ? new Date(a.createdAt.substring(0, 10)) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt.substring(0, 10)) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case 'lowest':
        filteredItems.sort((a: any, b: any) => this.getLowestTicketPrice(a.id) - this.getLowestTicketPrice(b.id));
        break;
      case 'highest':
        const highestOfLowestPrice = this.getHighestOfLowestTicketPrice();
        filteredItems.sort((a: any, b: any) => highestOfLowestPrice - this.getLowestTicketPrice(a.id) - (highestOfLowestPrice - this.getLowestTicketPrice(b.id)));
        break;
      default:
        break;
    }

    this.items$ = filteredItems;
    this.isResultEmpty = filteredItems.length === 0;
  }

  // Returns the lowest price of all tickets for the given event
  getLowestTicketPrice(eventId: string): number {
    const tickets = this.ticketsMap[eventId];
    if (!tickets || tickets.length === 0) {
      return 0;
    }

    return tickets.reduce((minPrice, ticket) => {
      return ticket.price < minPrice ? ticket.price : minPrice;
    }, tickets[0].price);
  }

// Returns the highest price of all tickets for the given event
  getHighestTicketPrice(eventId: string): number {
    const tickets = this.ticketsMap[eventId];
    if (!tickets || tickets.length === 0) {
      return 0;
    }

    return tickets.reduce((maxPrice, ticket) => {
      return ticket.price > maxPrice ? ticket.price : maxPrice;
    }, tickets[0].price);
  }

  // Returns the highest price of the lowest price of all events
  getHighestOfLowestTicketPrice(): number {
    let highestOfLowestPrice = 0;

    for (const eventId in this.ticketsMap) {
      const lowestTicketPrice = this.getLowestTicketPrice(eventId);
      if (lowestTicketPrice > highestOfLowestPrice) {
        highestOfLowestPrice = lowestTicketPrice;
      }
    }

    return highestOfLowestPrice;
  }

  // Converts strings with different formats to Date type
  convertDate(item: any): { startDate: Date, endDate: Date } {
    // console.log("item: "+JSON.stringify(item))
    let dateStr = item.date;
    let startDate: Date;
    let endDate: Date;

      // Handle date format "30.03.2024"
      const dateParts = dateStr.split('.');
      if (dateParts.length === 3 && !dateStr.includes(' ') && !dateStr.includes('-')) {
        const [day, month, year] = dateParts;
        dateStr = `${year}-${month}-${day}`;
        startDate = new Date(dateStr);
        endDate = startDate; // For single dates, endDate is the same as startDate
      } else if (dateStr.includes("-") && !dateStr.includes(' ') && !dateStr.includes(':')) {
        // This pattern: 28-29.07.2023
        const [startDatePart, endDatePart] = dateStr.split('-');

        if (item.date.length <= 13) { // Check if the pattern is "28-29.07.2023"
          const [day, monthYear] = startDatePart.split('.');
          const [endDay, endMonth, endYear] = endDatePart.split('.');

          // Construct the start date string
          const startDateStr = `${endYear}-${endMonth}-${day}`;
          // console.log("startDateStr:" + startDateStr + " for event " + item.title);

          // Construct the end date string
          const endDateStr = `${endYear}-${endMonth}-${endDay}`;
          // console.log("endDateStr:" + endDateStr + " for event " + item.title);

          startDate = new Date(startDateStr);
          endDate = new Date(endDateStr);
        } else {
          const [startDay, startMonth, startYear] = startDatePart.split('.');
          const [endDay, endMonth, endYear] = endDatePart.split('.');

          // Construct the start date string
          const startDateStr = `${startYear}-${startMonth}-${startDay}`;
          // console.log("startDateStr:" + startDateStr + " for event " + item.title);

          // Construct the end date string
          const endDateStr = `${endYear}-${endMonth}-${endDay}`;
          // console.log("endDateStr:" + endDateStr + " for event " + item.title);

          startDate = new Date(startDateStr);
          endDate = new Date(endDateStr);
        }
      } else {
        // Handle date format "02.03.2024 18:00"
        if (dateStr.includes(' ')) {
          const [datePart, timePart] = dateStr.split(' ');
          const [day, month, year] = datePart.split('.');
          const [hour, minute] = timePart.split(':');
          dateStr = `${year}-${month}-${day}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:00`;
        }
        startDate = new Date(dateStr);
        endDate = startDate; // For single dates, endDate is the same as startDate
      }

      // console.log("Event: " + item.title + " startDate: " + startDate + " | endDate: " + endDate);

    return { startDate, endDate };
  }
}
