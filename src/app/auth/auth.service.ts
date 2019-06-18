import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NotificationsService } from '../dashboard/notifications/notifications.service';

@Injectable({providedIn: 'root'})
export class AuthService{
  user: User;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  constructor(private http: HttpClient, public router: Router, private notificationsService: NotificationsService){}

  signup(email: string, username: string, password: string, image: File){
    let userData = new FormData();
    userData.append('email', email);
    userData.append('username', username);
    userData.append('password', password);
    userData.append('image', image, username);
    
    this.http.post<any>('http://localhost:3000/api/users/signup', userData)
      .subscribe(response => {
        this.router.navigate(['/'])
      })
  }

  authListener(){
    return this.authStatusListener.asObservable();
  }

  login(email: string, password: string){
    const authData: AuthData = { email, password }
    this.http.post<{message: string, contacts: [{email: string, imagePath: string, username: string}], user: {id: string, email: string, username: string, imagePath: string}}>('http://localhost:3000/api/users/login', authData)
    .subscribe(response => {
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      this.user = response.user;

      this.router.navigate(['/dashboard']);
      })
  }

  logout(){
    this.http.post('http://localhost:3000/api/users/logout', {message: 'logging out'})
      .subscribe(response => {
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.router.navigate(['/login'])
        this.notificationsService.contacts = []
      })
  }

  isLogged(){
    this.http.post<{message: string, user: {email: string, username: string, imagePath: string}}>('http://localhost:3000/api/users/info', {})
      .subscribe((response) => {
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(['/dashboard']);
        this.user = response.user;
      })
  }

  isUserAuthenticated(){
    return this.isAuthenticated;
  }
}