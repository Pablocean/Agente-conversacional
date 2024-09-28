import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  template: `
    <a (click)="sendMessage()"></a>
    <app-chat (showEnable)="enableSidebar($event)"></app-chat>
  `,
})
export class SidebarComponent implements AfterViewInit {
  @ViewChild(ChatComponent)
  chat!: ChatComponent;
  title = 'agenteConversacional';
  colorBackRight: string = '#007bff';
  colorFontRight: string = '#ffffff';
  colorBackLeft: string = '#eeeeee';
  colorFontLeft: string = '#343a40';
  messages = [];
  enable: boolean = true;

  ngAfterViewInit() {
    this.loadScript('assets/js/sidebar.js');
  }

  loadScript(src: string) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      console.log('Script loaded successfully');
    };
    document.body.appendChild(script);
  }

  sendMessage(message: string) {
    this.chat.textInput = message;
    this.chat.sendMessage();
  }

  enableSidebar(enabled: boolean) {
    this.enable = enabled; // Asigna el valor recibido
  }
}
