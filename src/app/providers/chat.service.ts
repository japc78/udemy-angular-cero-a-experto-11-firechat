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
  public userLogin: any = {};

  constructor(
    private afs: AngularFirestore,
    public auth: AngularFireAuth) {
      this.auth.authState.subscribe(user => {
        console.log('Estado del usuario: ', user);

        if ( !user ) {
          return;
        }

        this.userLogin.name = user.displayName;
        this.userLogin.uid = user.uid;
      })
    }


  login(provider: string) {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
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
      name: 'Demo',
      msg: txt,
      date: new Date().getTime()
    };

    // Es una promesa, por lo tanto then y cath. Que es posible llamarlas desde aquí
    // o donde se invoque el servicio. En este caso se realiza desde el componente.
    return this.itemsCollection.add(msg);
  }
}
