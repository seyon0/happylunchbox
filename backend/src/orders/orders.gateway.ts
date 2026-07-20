import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribeToShop')
  handleSubscribeToShop(
    @MessageBody() data: { shopId: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (data && data.shopId) {
      client.join(data.shopId);
      console.log(`Client ${client.id} joined room ${data.shopId}`);
      return { event: 'subscribed', data: { shopId: data.shopId } };
    }
  }

  emitOrderCreated(shopId: string, order: any) {
    this.server.to(shopId).emit('order.created', order);
  }

  emitOrderUpdated(shopId: string, order: any) {
    this.server.to(shopId).emit('order.updated', order);
  }
}
