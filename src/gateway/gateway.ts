import { OnModuleInit, Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway()
export class Gateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    if (!this.server) {
      throw new Error('WebSocket server is not available.');
    }

    this.server.on('connection', (socket: Socket) => {
      console.log(`Socket connected: ${socket.id}`);
    });
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any): void {
    if (!this.server) {
      throw new Error('WebSocket server is not available.');
    }

    this.server.emit('newMessage', body);
  }
}
