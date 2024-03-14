import { AuthService } from './../modules/auth/auth.service';
/* eslint-disable prettier/prettier */
import { MessageService } from './../modules/message/message.service';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Message } from 'src/modules/message/schemas/message.schemas';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private messageService: MessageService, private authService: AuthService) { }

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: Message): Promise<void> {
    await this.messageService.createMessage(payload);
    this.server.emit('recMessage', payload);
  }

  afterInit(server: Server) {
    console.log(server);
    //Do stuffs
  }

  handleDisconnect(socket: Socket) {
    console.log(`Disconnected: ${socket.id}, data: ${socket.data}`);
    //Do stuffs
  }

  async handleConnection(socket: Socket,) {
    console.log(`Connected ${socket.id}`);
    const authHeader = socket.handshake.headers.authorization;
    if (authHeader && (authHeader as string).split('')[1]) {
      try {
        socket.data = await this.authService.handleVerifyToken((authHeader as string).split('')[1])
        console.log("sd", socket.data)
      } catch (error) {

      }
    }
    //Do stuffs
  }
}