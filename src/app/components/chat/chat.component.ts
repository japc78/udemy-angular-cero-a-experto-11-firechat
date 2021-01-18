import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../providers/chat.service';
import { Message } from '../../interface/message.interface';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [
  ]
})
export class ChatComponent {

  message = '';

  constructor( public chatService: ChatService) {
    this.chatService.loadingMessages().subscribe();
  }

  sendMessage(): void {

    if( this.message.length === 0 ) {
      return;
    }

    this.chatService.addMessage(this.message)
      .then(() => {
        console.log('Message saved');
        this.message = '';
      })
      .catch((err) => console.log(`Error to send: ${err}`));
    console.log(this.message);
  }
}
