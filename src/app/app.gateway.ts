/* eslint-disable prettier/prettier */
import { MessageService } from './../modules/message/message.service';
import { AuthService } from './../modules/auth/auth.service';
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
import { RoomService } from 'src/modules/room/room.service';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private messageService: MessageService,
    private authService: AuthService,
    private roomService: RoomService

  ) { }

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: Message): Promise<void> {
    console.log("client", client)
    console.log("clientId", client.id)
    const [result] = await Promise.all([
      this.messageService.createMessage(payload),
      this.roomService.updateChatRoomService({
        sender_id: payload.sender_id,
        receiver_id: payload.receiver_id,
        lastMessage: payload.content
      })
    ]);
    console.log("result", result)
    if (client.id) {
      client.to(client.id).emit('receive_message', {
        payload: result
      });
    }
    // this.server.emit('recMessage', payload);
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
      } catch (error) {

      }
    }
    //Do stuffs
  }
}