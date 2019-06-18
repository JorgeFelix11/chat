import * as io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Socket } from 'socket.io';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ChatService{
  private url = 'http://localhost:5000';
  private socket: Socket;

  constructor(private http: HttpClient, public router: Router){
    this.socket = io(this.url);
  }

  message(message: string, conversation: string){
    // this.socket.emit('message', message)
    this.http.post("http://localhost:5000/message", {message, conversation})
    .subscribe(response => {})
  }

  joinRoom(id: string){
    this.socket.emit('join', id)
  }

  leaveRoom(id: string){
    this.socket.emit('leave', id)
  }
  
  getMessages(){
    return Observable.create((observer) => {
      this.socket.on('message', (message) => {
        observer.next(message)
      })
    })
  }

}