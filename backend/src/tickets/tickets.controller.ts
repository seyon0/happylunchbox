import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.ticketsService.findAll(req.user.userId);
  }

  @Post()
  create(@Request() req: any, @Body() data: any) {
    return this.ticketsService.create(req.user.userId, data);
  }
}
