import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import { HomePageComponent } from './components/home-page/home-page.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import {MatMenuModule} from "@angular/material/menu";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { CarouselComponent } from './components/carousel/carousel.component';
import { FooterComponent } from './components/footer/footer.component';
import { LatestEventsComponent } from './components/latest-events/latest-events.component';
import { EventCardComponent } from './components/event-card/event-card.component';
import { MainButtonComponent } from './components/main-button/main-button.component';
import { LikeButtonComponent } from './components/like-button/like-button.component';
import { EventCategoriesComponent } from './components/event-categories/event-categories.component';
import { UserAuthComponent } from './components/user-auth/user-auth.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { MultiItemCarouselComponent } from './components/multi-item-carousel/multi-item-carousel.component';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { CartComponent } from './components/cart/cart.component';
import { LikedComponent } from './components/liked/liked.component';
import { LocalEventsComponent } from './components/local-events/local-events.component';
import {CategoriesComponent} from "./components/categories/categories.component";
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatSliderModule} from '@angular/material/slider';
import { EventCardWideComponent } from './components/event-card-wide/event-card-wide.component';
import {DataService} from "./services/data.service";
import { TextRestrainPipe } from './pipes/text-restrain.pipe';
import {NgOptimizedImage} from "@angular/common";
import {AuthService} from "./services/auth.service";
import {AuthInterceptor} from "./services/auth.interceptor";
import {CategoryFilterService} from "./services/category-filter.service";
import {EventManagerComponent} from "./components/event-manager/event-manager.component";
import { NgxChartsModule }from '@swimlane/ngx-charts';
import { SnackbarComponent } from './components/snackbars/snackbar-error/snackbar.component';
import {ServerErrorInterceptor} from "./interceptors/server-error.interceptor";
import { SnackbarSuccessComponent } from './components/snackbars/snackbar-success/snackbar-success.component';
import { OrganizerOverviewPageComponent } from './components/organizer-overview-page/organizer-overview-page.component';
import {ActiveEventsPanelComponent} from "./components/event-manager/active-events-panel/active-events-panel.component";
import {ReportsPanelComponent} from "./components/event-manager/reports-panel/reports-panel.component";
import {EventCreatorPanelComponent} from "./components/event-manager/event-creator-panel/event-creator-panel.component";
@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavBarComponent,
    CarouselComponent,
    FooterComponent,
    LatestEventsComponent,
    EventCardComponent,
    MainButtonComponent,
    LikeButtonComponent,
    EventCategoriesComponent,
    UserAuthComponent,
    EventDetailComponent,
    MultiItemCarouselComponent,
    WishListComponent,
    CartComponent,
    LikedComponent,
    LocalEventsComponent,
    CategoriesComponent,
    EventCardWideComponent,
    TextRestrainPipe,
    EventManagerComponent,
    SnackbarComponent,
    SnackbarSuccessComponent,
    OrganizerOverviewPageComponent,
    ActiveEventsPanelComponent,
    ReportsPanelComponent,
    EventCreatorPanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    NgOptimizedImage,
    NgxChartsModule

  ],
  providers: [
    DataService,
    CategoryFilterService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorInterceptor,
      multi: true
    }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
