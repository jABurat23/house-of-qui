import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { logger } from '../../core/logger';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AuditGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    logger.system(`Dynasty Dashboard connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    logger.system(`Dashboard disconnected: ${client.id}`);
  }

  broadcastLog(log: any) {
    this.server.emit('audit:broadcast', log);
  }

  broadcastTelemetry(data: any) {
    this.server.emit('telemetry:identity', data);
  }
}
