import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Message } from '../interface/message.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Message>;
  public chats: Message[] = [];

  constructor(private afs: AngularFirestore) {
  }

  loadingMessages(): Observable<Message[]> {
    this.itemsCollection = this.afs.collection<Message>('chats');
    // return this.itemsCollection.valueChanges();
    return this.itemsCollection.valueChanges().pipe(
        map ( (messages: Message[]) => {
          this.chats = messages;
          // console.log(this.chats);
          return this.chats;
        })
      );
  }

  addMessage( txt: string) {

    let msg: Message = {
      name: 'Demo',
      msg: txt,
      date: new Date().getTime()
    };

    // Es una promesa, por lo tanto then y cath. Que es posible llamarlas desde aquí
    // o donde se invoque el servicio. En este caso se realiza desde el componente.
    return this.itemsCollection.add(msg);
  }
}
