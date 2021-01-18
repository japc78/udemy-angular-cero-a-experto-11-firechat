import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Message } from '../interface/message.interface';
import { map } from 'rxjs/operators';
import { MessagePlaceholder } from '@angular/compiler/src/i18n/i18n_ast';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Message>;
  public chats: Message[] = [];

  constructor(private afs: AngularFirestore) {
  }

  loadingMessages(): Observable<Message[]> {
    // ref es un segundo parametro para mandar querys sobre firebase
    this.itemsCollection = this.afs.collection<Message>('chats',
      // Consulta
      ref => ref.orderBy('date', 'desc').limit(5));

    return this.itemsCollection.valueChanges().pipe(
        map ( (messages: Message[]) => {
          // Para que se muestren los últimos mensajes primero.
          this.chats = [];
          messages.forEach(chat => {
            this.chats.unshift(chat);
          });
          return this.chats;
        })
      );
  }

  addMessage( txt: string): Promise<any> {
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
