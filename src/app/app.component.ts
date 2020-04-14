import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessagesService } from './messages.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  constructor(
    private messageService: MessagesService,
    private formBuilder: FormBuilder
  ) {
    this.messageForm = this.formBuilder.group({
      text: ["", Validators.required]
    })
  }

  messages = [];
  messageForm;

  ngOnInit() {
    this.messageService.getMessages().subscribe((messages) => {
      this.messages = <any[]>messages;
    });
  }

  createMessage() {
    if (this.messageForm.dirty && this.messageForm.valid) {
      this.messageService.createMessage(this.messageForm.value.text).subscribe(message => {
        this.messages.splice(0, 0, message);
        this.messageForm.reset();
      });
    }
  }

  deleteMessage(message) {
    this.messageService.deleteMessage(message).subscribe(() => {
      this.messages = this.messages.filter(m => m != message);
    })
  }
}
