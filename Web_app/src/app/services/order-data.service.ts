import {Injectable, OnInit} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderDataService {
  userId: string = '';
  cartData: any;
  constructor() { }
}
