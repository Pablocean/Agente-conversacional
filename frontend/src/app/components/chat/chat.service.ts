import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TextMessage } from '../../shared/models/text-messsage.model';
import { Message } from '../../shared/models/message.model';
import { catchError, Observable, of, throwError } from 'rxjs';
import { MESSAGES_URL } from '../../shared/constants/urls';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
    }),
  };

  sendMessage(textMessage: TextMessage): Observable<string> {
    return this.http.post<string>(MESSAGES_URL, textMessage).pipe(
      catchError((error) => {
        console.error('Error al enviar el mensaje:', error);
        return of(
          'Error al enviar el mensaje. Intente nuevamente después del tiempo requerido.'
        );
      })
    );
  }
}
