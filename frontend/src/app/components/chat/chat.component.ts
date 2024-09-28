import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ChatService } from './chat.service';
import { Message } from '../../shared/models/message.model';
import { TextMessage } from '../../shared/models/text-messsage.model';
import { ResponseMessage } from '../../shared/models/response-message.model';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  BACK_ENABLED: boolean = true;
  @Input('messages')
  messages!: Message[];
  @Input('colorBackRight')
  colorBackRight!: string;
  @Input('colorFontRight')
  colorFontRight!: string;
  @Input('colorBackLeft')
  colorBackLeft!: string;
  @Input('colorFontLeft')
  colorFontLeft!: string;

  @Output()
  showEnable = new EventEmitter<boolean>();

  textInput = '';

  info: string = ''; // Tiempo en segundos
  showCountdown: boolean = false;
  interval: any;
  regex = /https?:\/\/[^\s]+/g;

  // maxHeight: number = 100; // Altura máxima en píxeles

  // @ViewChild('textArea') textArea!: ElementRef;

  constructor(private chatService: ChatService) {}

  ngOnInit() {}

  sendMessage() {
    this.showEnable.emit(false);
    this.showCountdown = true;
    this.info = 'Procesando la solicitud. ';
    let newMessage: Message = {
      text: this.textInput,
      date: '',
      userOwner: true,
      error: false,
    };

    this.messages.push(newMessage);

    let messageBack: TextMessage = {
      firstname: environment.firstName,
      textInput: this.textInput,
    };
    if (this.BACK_ENABLED) {
      this.chatService.sendMessage(messageBack).subscribe((serverMessage) => {
        let messageError: boolean = false;
        if (serverMessage.includes('Error')) {
          messageError = true;
          this.waitAndShowMessage();
        } else {
          this.showCountdown = false;
          this.showEnable.emit(true);
          if (this.regex.test(serverMessage)) {
            serverMessage = this.linkFormat(serverMessage);
          }
        }

        let messageReturn: Message = {
          text: serverMessage,
          date: new Date().toDateString(),
          userOwner: false,
          error: messageError,
        };

        this.messages.push(messageReturn);
      });
    }
    this.textInput = '';
  }

  onKey(event: any) {
    if (event.keyCode == 13) {
      this.sendMessage();
    }
    // this.adjustHeight();
  }
  // adjustHeight() {
  //   const textArea = this.textArea.nativeElement;
  //   textArea.style.height = 'auto'; // Restablecer la altura para calcular el nuevo tamaño
  //   textArea.style.height =
  //     Math.min(textArea.scrollHeight, this.maxHeight) + 'px'; // Ajustar la altura
  // }

  waitAndShowMessage() {
    this.showCountdown = true; // Ocultar el mensaje al iniciar
    let countdown: number = 30; // Reiniciar la cuenta regresiva

    this.interval = setInterval(() => {
      countdown--;
      this.info =
        'Ocurrió un error... Podrá realizar otra solicitud después de: ' +
        countdown.toString() +
        ' segundos';

      if (countdown <= 0) {
        clearInterval(this.interval); // Detener el intervalo
        this.showCountdown = false; // Mostrar el mensaje después de 30 segundos
        this.showEnable.emit(true);
      }
    }, 1000); // Actualizar cada segundo
  }

  linkFormat(texto: string): string {
    return texto.replace(
      this.regex,
      (enlace) => `<a href="${enlace}" target="_blank">${enlace}</a>`
    );
  }
}
