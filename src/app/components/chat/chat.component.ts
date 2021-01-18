import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../providers/chat.service';
import { Message } from '../../interface/message.interface';
import { element } from 'protractor';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [
  ]
})
export class ChatComponent implements OnInit {

  message = '';
  containerChat: any;

  constructor( public chatService: ChatService) {
    this.chatService.loadingMessages().subscribe(
      // Para que el scroll se vaya al final. Se implementa con un retardo, porque react
      // renderiza la instrucion del scroll antes que toda la data.
      () =>  {
        setTimeout(() => {
          this.containerChat.scrollTop = this.containerChat.scrollHeight;
        }, 20);
      }
    );
  }

  ngOnInit(): void {
    this.containerChat = document.getElementById('app-messages');
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
