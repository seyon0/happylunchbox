import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Status } from '@prisma/client';

@Controller('api/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles('CUSTOMER')
  @Get('my-orders')
  findMyOrders(@Request() req: any, @Query('skip') skip?: string, @Query('take') take?: string) {
    return this.ordersService.findAllByUser(
      req.user.userId, 
      skip ? parseInt(skip) : 0, 
      take ? parseInt(take) : 50
    );
  }

  @Roles('KITCHEN', 'ADMIN')
  @Get('kitchen')
  findByKitchen(@Query('shopId') shopId: string, @Query('skip') skip?: string, @Query('take') take?: string) {
    return this.ordersService.findAllByShop(
      shopId,
      skip ? parseInt(skip) : 0, 
      take ? parseInt(take) : 50
    );
  }

  @Roles('KITCHEN', 'ADMIN')
  @Get('shop/:shopId/active')
  findActiveQueue(@Param('shopId') shopId: string) {
    return this.ordersService.findActiveQueue(shopId);
  }

  @Roles('RIDER')
  @Get('rider/my-deliveries')
  findRiderDeliveries(@Request() req: any) {
    return this.ordersService.findRiderDeliveries(req.user.userId);
  }

  @Roles('RIDER')
  @Get('rider/incentives')
  getRiderIncentives(@Request() req: any) {
    return this.ordersService.getRiderIncentives(req.user.userId);
  }

  @Roles('CUSTOMER')
  @Post()
  create(@Body() body: any, @Request() req: any) {
    return this.ordersService.create(req.user.userId, body);
  }

  @Roles('KITCHEN', 'RIDER', 'ADMIN')
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: Status) {
    return this.ordersService.updateStatus(id, status);
  }
}
