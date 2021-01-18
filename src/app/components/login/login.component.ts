import { Component } from '@angular/core';
import { ChatService } from '../../providers/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent {

  constructor( public chatService: ChatService) { }

  login(provider: string) {
    this.chatService.login(provider);
    console.log(provider);
  }

}
