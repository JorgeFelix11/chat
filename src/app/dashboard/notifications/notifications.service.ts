import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from 'src/app/auth/user.model';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class NotificationsService{
  found: boolean;
  contact: User;
  contacts: any[] = [];
  private foundStatus = new Subject<boolean>();
  private addStatus = new Subject<boolean>();
  constructor(private http: HttpClient, public router: Router){}

  foundListener(){
    return this.foundStatus.asObservable();
  }

  addListener(){
    return this.addStatus.asObservable()
  }

  searchContact(email: string){
    this.http.post<any>('http://localhost:3000/api/users/search', {email})
      .subscribe(response => {
        this.contact = response.user;
        this.foundStatus.next(true)
      })
  }

  addContact(email: string, status: string){
    const contact = { email, status };
    this.http.post<any>('http://localhost:4000/api/contacts/add', contact)
      .subscribe(response => {
        this.contacts = []
        response.contacts.forEach(element => {
          this.contacts.push(element)
        });
        this.addStatus.next(true);
      })
  }

  getContacts(){    
    this.http.get<any>('http://localhost:4000/api/contacts/getcontacts')
    .subscribe(response => {
      this.contacts = response.contacts;
      this.foundStatus.next(true);
    })
  }

  acceptRequest(index){
    let contactAccepted = {
      friendId: this.contacts[index]._id
    }    
    this.http.post<any>('http://localhost:4000/api/contacts/accept', contactAccepted)
      .subscribe(response => {
        this.contacts = []
        response.contacts.forEach(element => {
          this.contacts.push(element)
        });
        this.addStatus.next(true);
      })
  }
}