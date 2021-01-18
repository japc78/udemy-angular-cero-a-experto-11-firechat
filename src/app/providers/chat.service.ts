import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Message } from '../interface/message.interface';
import { map } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Message>;
  public chats: Message[] = [];
  public userApp: any = {};

  constructor(
    private afs: AngularFirestore,
    public auth: AngularFireAuth) {
      this.auth.authState.subscribe(user => {
        console.log('Estado del usuario: ', user);

        if ( !user ) {
          return;
        }

        this.userApp.name = user.displayName;
        this.userApp.uid = user.uid;
        console.log(this.userApp);

      });
    }


  login(provider: string): void {
    if (provider === 'google') {
      this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }
  }

  logout(): void {
    this.userApp = {};
    this.auth.signOut();
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
      name: this.userApp.name,
      msg: txt,
      date: new Date().getTime(),
      uid: this.userApp.uid
    };

    // Es una promesa, por lo tanto then y cath. Que es posible llamarlas desde aquí
    // o donde se invoque el servicio. En este caso se realiza desde el componente.
    return this.itemsCollection.add(msg);
  }
}
