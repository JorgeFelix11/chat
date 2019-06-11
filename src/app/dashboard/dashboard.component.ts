import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService } from './notifications/notifications.service';
import { User } from '../auth/user.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private buttonClicked: string;
  private foundListenerSubs: Subscription
  found: boolean;
  contact: User;
  contacts: {status: boolean, emailFriend: string, _id: string}[];
  constructor(private notificationsService: NotificationsService, private authService: AuthService) { }
  
  ngOnInit() {
    this.foundListenerSubs = this.notificationsService.foundListener()
    .subscribe()
    this.notificationsService.getContacts();
    this.notificationsService.foundListener()
      .subscribe(() => {
        this.contacts = this.notificationsService.contacts;
      })
  }

  onAddContact(addContactForm: NgForm){
    if(this.buttonClicked == 'search'){
      this.notificationsService.searchContact(addContactForm.value.email)
      this.foundListenerSubs = this.notificationsService.foundListener()
        .subscribe(wasFound => {
          this.found = wasFound;
          this.contact = this.notificationsService.contact;
        })
    }else if(this.buttonClicked == 'add'){
      this.notificationsService.addContact(this.contact.email, "Invited")
      this.notificationsService.addListener()
        .subscribe(() => {
          this.contacts = this.notificationsService.contacts
        })
      this.found = false;
      addContactForm.reset()
    }
  }

  onAccept(index){
    this.notificationsService.acceptRequest(index)
    this.notificationsService.addListener()
      .subscribe(() => {
        this.contacts = this.notificationsService.contacts
      })
    this.found = false;
  }
  
  ngOnDestroy(){
    this.foundListenerSubs.unsubscribe()
  }
}
