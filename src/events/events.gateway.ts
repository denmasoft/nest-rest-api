import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LoggerService } from '../common/logger/logger.service';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {
    this.logger.setContext('EventsGateway');
  }

  afterInit(server: Server) {
    server.engine.opts.cors = {
      origin: this.configService.get('APP_URL'),
      methods: ['GET', 'POST'],
      credentials: true,
    };

    this.logger.info(`Socket.IO Gateway Initialized`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.info(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.info(`Client disconnected: ${client.id}`);
  }

  sendMessageToClient(clientId: string, event: string, payload: any) {
    this.server.to(clientId).emit(event, payload);
  }
}
