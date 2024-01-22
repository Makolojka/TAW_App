import { Component, Input } from '@angular/core';
import { Ticket } from '../../../../interfaces/ticket';
import {Row} from "../../../../interfaces/row";
import {Seat} from "../../../../interfaces/seat";

@Component({
  selector: 'room-builder',
  templateUrl: './room-builder.component.html',
  styleUrls: ['./room-builder.component.css']
})
export class RoomBuilderComponent {
  @Input() tickets: Ticket[] = [];
  selectedTicket: Ticket | null = null;

  roomColumns: number = 0;
  selectedRowStyle: string = 'center';
  @Input() roomSchema: Row[] = [];
  @Input() roomSchemaStyle: string = this.selectedRowStyle;

  seatsIdIncrementation: number = 0;
  rowIdIncrementation: number = 0;

  addRow(){
    const row: Row = {
      seats: []
    };
    for (let i = 1; i <= this.roomColumns; i++) {
      const seat: Seat = {
        id: this.rowIdIncrementation+"."+this.seatsIdIncrementation,
        type: "",
        color: "",
        isAvailable: true
      };

      this.seatsIdIncrementation ++
      row.seats.push(seat);
    }
    this.rowIdIncrementation ++
    this.seatsIdIncrementation = 0;

    this.roomSchema.push(row);
    console.log("this room schema after toggle seat: ", this.roomSchema)
  }

  removeRow(): void {
    if (this.roomSchema.length > 0) {
      this.roomSchema.pop();
    }
  }

  toggleSeatAvailability(rowIndex: number, seatIndex: number): void {
    if (this.selectedTicket) {
      this.roomSchema[rowIndex].seats[seatIndex].color = this.selectedTicket.color;
      this.roomSchema[rowIndex].seats[seatIndex].type = this.selectedTicket.type;
    }
    console.log("this room schema after toggle seat: ", this.roomSchema)
  }

  applyTicketToRow(rowIndex: number): void {
    if (this.selectedTicket) {
      const row = this.roomSchema[rowIndex];
      row.seats.forEach(seat => {
        // @ts-ignore
        seat.color = this.selectedTicket.color;
        // @ts-ignore
        seat.type = this.selectedTicket.type;
      });
    }
  }

  toggleAlignment(alignment: string): void {
    this.selectedRowStyle = alignment;
    this.roomSchemaStyle = alignment;
    console.log("this.roomSchemaStyle: ", this.roomSchemaStyle)
  }

  isAlignmentSelected(alignment: string): boolean {
    return this.selectedRowStyle === alignment;
  }

  selectTicket(ticket: Ticket): void {
    this.selectedTicket = ticket;
  }

  getBackgroundColor(index: number): any {
    const colors = ['#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#e74c3c', '#1abc9c', '#34495e', '#e67e22', '#27ae60', '#95a5a6'];

    if (index < this.tickets.length) {
      return { 'background-color': this.tickets[index].color };
    } else {
      return { 'background-color': colors[index % colors.length] };
    }
  }
}
