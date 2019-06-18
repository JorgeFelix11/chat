import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService } from './notifications/notifications.service';
import { User } from '../auth/user.model';
import { Subscription } from 'rxjs';
import { ChatService } from './notifications/chat.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private buttonClicked: string;
  private foundListenerSubs: Subscription;
  private messageListenerSubs: Subscription;
  user: User;
  found: boolean;
  contact: User;
  messages: any[] = [];
  conversationId: string = '';
  contacts: {status: boolean, emailFriend: string, _id: string}[];
  constructor(
    private notificationsService: NotificationsService, 
    private chatService: ChatService, 
    private authService: AuthService
  ) { }
  
  ngOnInit() {
    this.user = this.authService.user;
    this.foundListenerSubs = this.notificationsService.foundListener()
    .subscribe()
    this.notificationsService.getContacts();
    this.notificationsService.foundListener()
      .subscribe(() => {
        this.contacts = this.notificationsService.contacts;
      })
    this.chatService.getMessages().subscribe(message => {
      this.messages.push(message)
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

  onChat(index){
    this.notificationsService.chat(index);
    this.chatService.leaveRoom(this.conversationId);
    this.messageListenerSubs = this.notificationsService.foundListener()
      .subscribe(found => {
        this.messages = this.notificationsService.messages
        this.conversationId = this.notificationsService.conversation;
        this.chatService.joinRoom(this.conversationId);
      })
  }

  sendMessage(messageForm: NgForm){
    let message = messageForm.value.message
    this.chatService.message(message, this.conversationId)
    messageForm.resetForm()
  }
  
  ngOnDestroy(){
    if(this.foundListenerSubs)this.foundListenerSubs.unsubscribe()
    if(this.messageListenerSubs)this.messageListenerSubs.unsubscribe();
  }
}
