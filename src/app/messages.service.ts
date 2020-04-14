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
    return this.http.get("/api/messages");
  }

  createMessage(text: String) {
    return this.http.post("/api/messages", {text: text});
  }

  deleteMessage(message) {
    return this.http.delete(`/api/messages/${message._id}`)
  }
}
