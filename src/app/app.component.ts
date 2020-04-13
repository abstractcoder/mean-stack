import { Component, OnInit } from '@angular/core';
import { MessagesService } from './messages.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  constructor(
    private messageService: MessagesService
  ) {}

  messages;

  ngOnInit() {
    this.messages = this.messageService.getMessages();
  }
}
