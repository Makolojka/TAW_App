import {Component, Input, OnInit} from '@angular/core';
import {ScaleType} from "@swimlane/ngx-charts";
import {DataService} from "../../../services/data.service";
import {PanelManagerService} from "../../../services/panel-manager.service";
import {AuthService} from "../../../services/auth.service";

interface SeriesData {
  name: string;
  value: number;
}

interface MergedSeries {
  [key: string]: SeriesData[];
}

@Component({
  selector: 'app-reports-panel',
  templateUrl: './reports-panel.component.html',
  styleUrls: ['./reports-panel.component.css']
})
export class ReportsPanelComponent implements OnInit{

  @Input() userId: string = '';
  public imageMissing: string = '././assets/img/sopot.jpg';

  // Events details
  ownedEvents: any[] = [];
  eventDetails: any[] = [];
  areEventsPresent: boolean = false;

  // Chart data
  saleData: any[] = [];

  // Main chart options
  legend: boolean = true;
  legendTitle: string = 'Legenda';
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Data';
  yAxisLabel: string = 'Liczba sprzedanych biletów';
  timeline: boolean = true;
  colorScheme = {
    name: 'purple',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#6B3FA0',
      '#2d1a42',
      '#e5b8ff'
    ]
  };

  // General stats
  totalViews: number = 0;
  totalEarnings: number = 0;
  totalSold: number = 0;
  organiserName: string = '';

  // Stats only for specific event
  eventSelectedToggle: boolean = false;
  totalEarningsForEvent: number = 0;
  totalSoldForEvent: number = 0;
  totalViewsForEvent: number = 0;
  lastEventId: string = '';

  constructor(private service: DataService, private authService: AuthService, public panelManagerService: PanelManagerService) {}
  ngOnInit() {
    this.getOrganizerName();
    this.getOwnedEvents();
    this.fetchTotalViews();
    this.fetchTotalEarnings();
    this.fetchTotalSold();
    this.fetchAndMergeSaleData(this.organiserName);
  }
  getOrganizerName(){
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.organiserName = currentUser.name;
    }
  }
  getOwnedEvents(){
    this.service.getOwnedEvents(this.userId).subscribe(
      (res: any) => {
        this.ownedEvents = res.ownedEvents;
        // console.log('Owned Events:', this.ownedEvents);
        this.fetchEventDetails();
        if(this.ownedEvents.length !== 0){
          this.areEventsPresent = true;
        }
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  fetchEventDetails() {
    this.ownedEvents.forEach((eventId: string) => {
      this.service.getById(eventId).subscribe((res: any) => {
        this.eventDetails.push(res);
      });
    });
  }

  fetchTotalViews(): void {
    this.service.getTotalViewsForOrganiser(this.organiserName)
      .subscribe(
        (response) => {
          this.totalViews = response.totalViews;
        },
        (error) => {
          console.error('Error fetching total views:', error);
        }
      );
  }
  fetchTotalEarnings(): void {
    this.service.getTotalEarningsByOrganiser(this.organiserName).subscribe(
      (response: any) => {
        this.totalEarnings = response.totalEarnings;
      },
      (error) => {
        console.error('Error fetching total earnings:', error);
      }
    );
  }

  fetchTotalSold(): void {
    this.service.getTicketsSoldByOrganiser(this.organiserName).subscribe(
      (response: any) => {
        this.totalSold = response.ticketsSold;
      },
      (error) => {
        console.error('Error fetching total sold tickets:', error);
      }
    );
  }

  fetchSaleData(organiserName: string): void {
    this.service.getSaleDataForOrganiser(organiserName)
      .subscribe(
        (response) => {
          this.saleData = response.saleData; // Assign saleData from the response
          console.log('Sale data:', this.saleData);
        },
        (error) => {
          console.error('Error fetching sale data:', error);
        }
      );
  }

  // All sale data in different series
  fetchAndMergeSaleData(organiserName: string): void {
    // Inside your component
    this.service.getSaleDataForOrganiser(organiserName)
      .subscribe(
        (response) => {
          this.saleData = this.mergeSeries(response.saleData);
        },
        (error) => {
          console.error('Error fetching sale data:', error);
        }
      );

  }

  // One merged sale data
  mergeSeries(saleData: any[]): any[] {
    const mergedSeries: MergedSeries = {};

    saleData.forEach((data) => {
      const name: string = data.name;
      const series: SeriesData[] = data.series;

      if (!mergedSeries[name]) {
        mergedSeries[name] = [];
      }

      series.forEach((point) => {
        const existingPoint = mergedSeries[name].find((item) => item.name === point.name);

        if (existingPoint) {
          existingPoint.value += point.value;
        } else {
          mergedSeries[name].push({ name: point.name, value: point.value });
        }
      });

      // Sort the series by date in ascending order
      mergedSeries[name].sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
    });

    return Object.keys(mergedSeries).map((name) => {
      return {name, series: mergedSeries[name]};
    });
  }

  showEventDetails(eventId: string) {
    if (this.eventSelectedToggle && this.lastEventId === eventId) {
      this.eventSelectedToggle = false;
      this.lastEventId = '';
    } else {
      this.eventSelectedToggle = false;
      this.getEventData(eventId);
      this.eventSelectedToggle = true;
      this.lastEventId = eventId;
    }
  }
  async getEventData(eventId: string) {
    try {
      // Fetch total earnings for the event
      this.service.getTotalEarningsByEvent(eventId)
        .subscribe((earningsResponse: any) => {
          this.totalEarningsForEvent = earningsResponse.totalEarningsForEvent;
        }, error => {
          console.error('Error fetching total earnings:', error);
        });

      // Fetch sold tickets for the event
      this.service.getTicketsSoldByEvent(eventId)
        .subscribe((soldTicketsResponse: any) => {
          this.totalSoldForEvent = soldTicketsResponse.ticketsSold;
        }, error => {
          console.error('Error fetching sold tickets:', error);
        });
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  }

}
