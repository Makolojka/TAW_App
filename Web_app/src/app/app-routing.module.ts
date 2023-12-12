import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from "./components/home-page/home-page.component";
import {UserAuthComponent} from "./components/user-auth/user-auth.component";
import {EventDetailComponent} from "./components/event-detail/event-detail.component";
import {WishListComponent} from "./components/wish-list/wish-list.component";
import {LikedComponent} from "./components/liked/liked.component";
import {CartComponent} from "./components/cart/cart.component";
import {CategoriesComponent} from "./components/categories/categories.component";
import {AuthGuard} from "./services/auth.guard";
import {EventManagerComponent} from "./components/event-manager/event-manager.component";
import {OrganizerOverviewPageComponent} from "./components/organizer-overview-page/organizer-overview-page.component";
import {OrganizerAuthGuard} from "./services/organiser-panel.guard";

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'login',
    component: UserAuthComponent
  },
  {
    path: 'event/detail',
    component: EventDetailComponent,
  },
  {
    path: 'wishlist',
    component: WishListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'liked',
    component: LikedComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  //Categories
  {
    path: 'events',
    component: CategoriesComponent,
  },
  {
    path: 'event/detail/:id',
    component: EventDetailComponent
  },
  {
    path: 'events/event/detail/:id',
    component: EventDetailComponent
  },
  {
    path: 'cart/event/detail/:id',
    component: EventDetailComponent
  },
  {
    path: 'wishlist/event/detail/:id',
    component: EventDetailComponent
  },
  {
    path: 'event-manager',
    component: EventManagerComponent,
    canActivate: [OrganizerAuthGuard]
  },
  {
    path: 'organizer/overview',
    component: OrganizerOverviewPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
