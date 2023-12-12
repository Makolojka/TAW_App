import { Component } from '@angular/core';
import {CategoryFilterService} from "../../services/category-filter.service";

@Component({
  selector: 'event-categories',
  templateUrl: './event-categories.component.html',
  styleUrls: ['./event-categories.component.css']
})
export class EventCategoriesComponent {
  constructor(private categoryFilterService: CategoryFilterService) {}
  onCategoryButtonClick(category: string) {
    this.categoryFilterService.selectedCategory = category;
  }

}
