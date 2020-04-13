import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  messages = [];

  constructor(
    private http: HttpClient
  ) { }

  getMessages() {
    return this.http.get("/api/test");
  }
}
