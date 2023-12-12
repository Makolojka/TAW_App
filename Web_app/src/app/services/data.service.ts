import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from "./auth.service";
import {LikesAndFollows} from "../interfaces/likes-and-follows";
import {Observable} from "rxjs";
import {Ticket} from "../components/event-card/Ticket";
import {Event} from "../interfaces/Event";
import {LikedResponse} from "../interfaces/is-liked-followed";
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url = 'http://localhost:3001';
  private token = this.authService.getToken();
  constructor(private http: HttpClient, public authService: AuthService) {
  }
  // Events endpoints
  // TODO: zabezpieczyć tokenem resztę ważnych endpointów
  getAll() {
    return this.http.get(this.url + '/api/events');
  }
  getById(id: string) {
    return this.http.get(this.url + '/api/events/' + id);
  }

  // Artists endpoints
  getAllArtists() {
    return this.http.get(this.url + '/api/artists');
  }
  getArtistsForEvent(eventId: string) {
    return this.http.get(this.url + '/api/events/' + eventId + '/artists');
  }

  createNewArtist(newArtist: { image: string; career: string; name: string; shortDescription: string }) {
    return this.http.post(this.url + '/api/artist', newArtist);
  }


  //Tickets endpoints
  getTicketsForEvent(eventId: string) {
    return this.http.get(this.url + '/api/events/' + eventId + '/tickets');
  }

  // Creates new ticket
  createNewTicket(newTicket: Ticket) {
    return this.http.post(this.url + '/api/events/ticket/id', newTicket);
  }

  // Creates new event
  createNewEvent(newEvent: Event) {
    return this.http.post(this.url + '/events/transaction', newEvent);
  }

  //Cart endpoints
  getCart(userId: string) {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.token,
      'Content-Type': 'application/json'})
    return this.http.get(this.url + '/api/user/' + userId + '/cart', {headers: headers});
  }
  removeTicketFromCart(userId: string, eventId: string, ticketId: string, quantity: number) {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.token,
      'Content-Type': 'application/json'})
    const body = { quantity: quantity };
    return this.http.post(this.url + '/api/user/' + userId + '/cart/remove-ticket/' + eventId + '/' + ticketId, body, {headers: headers});
  }

  addTicketToCart(userId: string, eventId: string, ticketId: string) {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.token,
      'Content-Type': 'application/json'})
    return this.http.post(this.url + '/api/user/' + userId + '/cart/add-ticket/' + eventId + '/' + ticketId, {}, {headers: headers});
  }

  // TODO: dodać autoryzację
  //User Like and follow endpoints /api/profile/:userId/:actionType
  addUserLikeOrFollower(userId: string, eventId: string, actionType: string) {
    // console.log("eventId: "+eventId)
    // const body = { userId: userId, actionType: actionType, eventId: eventId };
    return this.http.post(this.url + '/api/profile/like-follow/'+userId+'/'+eventId+'/'+actionType,{});
  }

  // Get users follows and likes
  getUserLikedOrFollowedEvents(userId: string, actionType: string) {
    return this.http.get(this.url + '/api/profile/likes-follows/' + userId + '/' + actionType);
  }

  //Event Like and follow endpoints /api/event/likes-follows/:userId/:actionType
  addEventLikeOrFollower(eventId: string, userId: string, actionType: string) {
    return this.http.post(this.url + '/api/event/likes-follows/' + eventId + '/' + userId + '/' + actionType, {});
  }

  // Get event follows and likes /api/event/:eventId/follow-likes/:actionType
  getEventLikedOrFollowedCount(eventId: string, actionType: string) {
    return this.http.get(this.url + '/api/event/likes-follows/' + eventId + '/' + actionType);
  }

  //Get followed and liked events count
  getUserLikedOrFollowedEventsCount(userId: string) {
    return this.http.get<LikesAndFollows>(this.url + '/api/profile/likes-follows/' + userId);
  }

  //Increment views for event
  incrementEventViews(eventId: string) {
    return this.http.post(this.url + '/api/event/views/'+eventId,{});
  }

  // Returns true if event is liked or followed by the specific user or false if it is not
  checkIfEventIsLiked(userId: string, eventId: string, actionType: string) {
    return this.http.post<LikedResponse>(this.url + '/api/profile/check-if-event-liked/'+userId+'/'+eventId+'/'+actionType,{});
  }

  // Get organizers ownedEvents
  getOwnedEvents(id: string) {
    return this.http.get(this.url + '/api/organizer/' + id);
  }

  // Adds event to organisers ownedEvents field
  addEventToOwnedEvents(userId: string, eventId: string) {
    return this.http.post(this.url + '/api/organizer/' + userId + '/add-event/' + eventId, {});
  }

  // Get sold tickets for a specific event
  getTicketsSoldByEvent(eventId: string): Observable<any> {
    return this.http.get(this.url+'/api/organiser/stats/tickets-sold-by-event/'+eventId);
  }

  // Get sold tickets for a specific organizer
  getTicketsSoldByOrganiser(organiserName: string): Observable<any> {
    return this.http.get(this.url+'/api/organiser/stats/tickets-sold-by-organiser/'+organiserName);
  }

  // Get total earnings for a specific organizer
  getTotalEarningsByOrganiser(organiserName: string): Observable<any> {
    return this.http.get(this.url+'/api/organiser/stats/total-earnings-by-organiser/'+organiserName);
  }

  // Get total earnings for a specific event
  getTotalEarningsByEvent(eventId: string): Observable<any> {
    return this.http.get(this.url+'/api/organiser/stats/total-earnings-by-event/'+eventId);
  }

  // Get total views for a specific organiser
  getTotalViewsForOrganiser(organiserName: string): Observable<any> {
    return this.http.get(this.url+'/api/organiser/stats/total-views-by-organiser/'+organiserName);
  }

  // Get sale data for chart
  getSaleDataForOrganiser(organiserName: string): Observable<any> {
    return this.http.get(this.url+'/api/organiser/sale-data/'+organiserName);
  }

}
