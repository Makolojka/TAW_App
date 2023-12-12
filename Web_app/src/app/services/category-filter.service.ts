import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryFilterService {
  selectedCategory: string = '';
  constructor() { }
}
