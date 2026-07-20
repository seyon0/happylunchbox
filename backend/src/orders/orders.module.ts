import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { RiderAssignmentService } from './rider-assignment.service';
import { OrdersGateway } from './orders.gateway';

@Module({
  providers: [OrdersService, RiderAssignmentService, OrdersGateway],
  controllers: [OrdersController]
})
export class OrdersModule {}
