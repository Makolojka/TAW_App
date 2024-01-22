import {Component, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
import {AuthService} from "../../services/auth.service";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit{
  userId: string = '';
  transactions: any[] = [];
  logoBase64: string = '';
  private http: any;
  constructor(private service: DataService, private authService: AuthService, private httpClient: HttpClient) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.getTransactions();
    this.loadAndConvertImageToBase64('assets/log.png');
  }

  getTransactions(): void {
    this.service.getAllTransactions(this.userId).subscribe((transactions: any) => {
      this.transactions = transactions;

      this.transactions.forEach(transaction => {
        transaction.ticketDetails = [];

        transaction.tickets.forEach((ticket: any) => {
          this.service.getTicketDetailsById(ticket.ticketId).subscribe((ticketDetails: any) => {
            const ticketDetail = {
              count: ticket.count,
              ticketName: ticketDetails.type,
              ticketPrice: ticketDetails.price,
              eventId: ticket.eventId,
              ticketId: ticket.ticketId
            };
            transaction.ticketDetails.push(ticketDetail);
          });
        });
      });
    });
  }

  generateTicketPdf(ticketName: string, ticketPrice: number, ticketCount: number, eventId: string, transactionId: string, transaction: any) {
    const seatNumbers = transaction.tickets.reduce((numbers: string[], ticket: any) => {
      if (ticket.seatNumbers.length > 0) {
        numbers.push(...ticket.seatNumbers);
      }
      return numbers;
    }, []);

    this.service.getById(eventId).subscribe((eventDetails: any) => {
      const eventName = eventDetails.title || 'Nazwa niedostępna';

      const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 40, 40, 40],
        content: [
          {
            canvas: [
              {
                type: 'rect',
                x: 0,
                y: 0,
                w: 800,
                h: 50,
                color: '#2d1a42' // Background color for header
              }
            ]
          },
          {
            text: 'Bilet',
            style: 'header',
            absolutePosition: { x: 80, y: 50 },
            color: '#ffffff'
          },
          {
            columns: [
              {
                width: '60%',
                stack: [
                  { text: 'Bilet na wydarzenie', color: '#2d1a42', fontSize: 18 },
                  { text: eventName, bold: true, margin: [0, 5, 0, 10], color: '#333333', fontSize: 18 },
                  { text: 'Typ/Nazwa biletu', color: '#2d1a42', fontSize: 18 },
                  { text: ticketName, margin: [0, 5, 0, 10], color: '#333333', fontSize: 20 },
                  { text: 'Cena za jeden bilet', color: '#2d1a42', fontSize: 18 },
                  { text: `${ticketPrice} zł`, margin: [0, 5, 0, 10], color: '#333333', fontSize: 20 },
                  { text: 'Ilość biletów', color: '#2d1a42', fontSize: 18 },
                  { text: ticketCount.toString(), margin: [0, 5, 0, 10], color: '#333333', fontSize: 20 },
                  seatNumbers.length > 0 ? { text: 'Numer(y) miejsc: ' + seatNumbers.join(', '), margin: [0, 5, 0, 10], color: '#2d1a42', fontSize: 18 } : null
                ].filter(Boolean),
                margin: [10, 0, 0, 0],
                color: '#ffffff'
              },
              {
                width: 'auto',
                stack: [
                  { qr: transactionId, fit: 100 },
                ],
                margin: [100, 0, 0, 0]
              }
            ]
          },
        ],
        styles: {
          header: {
            fontSize: 24,
            bold: true,
            alignment: 'left',
            margin: [10, 10, 0, 10],
            color: '#ffffff'
          }
        },
        footer: {
          columns: [
            {
              stack: [
                { image: this.logoBase64, width: 100, height: 75, alignment: 'center' },
              ],
              width: 800,
              alignment: 'center',
              margin: [0, 0] // Adjust margins within the column
            }
          ],
          margin: [-100, -100], // Outer margin of the footer
        }
      };


      // @ts-ignore
      pdfMake.createPdf(docDefinition).open();
    });
  }

  loadImageBlob(imagePath: string): Observable<Blob> {
    return this.httpClient.get(imagePath, { responseType: 'blob' });
  }

  convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  loadAndConvertImageToBase64(imagePath: string) {
    this.loadImageBlob(imagePath).subscribe(
      (blob: Blob) => {
        this.convertBlobToBase64(blob).then(
          (base64: string) => {
            this.logoBase64 = base64;
          },
          (error: any) => {
            console.error('Error converting blob to base64:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error loading image blob:', error);
      }
    );
  }

}
