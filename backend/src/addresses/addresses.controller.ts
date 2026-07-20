import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/addresses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.addressesService.findAll(req.user.userId);
  }

  @Post()
  create(@Request() req: any, @Body() createAddressDto: any) {
    return this.addressesService.create(req.user.userId, createAddressDto);
  }

  @Put(':id/default')
  setAsDefault(@Request() req: any, @Param('id') id: string) {
    return this.addressesService.setAsDefault(req.user.userId, id);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.addressesService.remove(req.user.userId, id);
  }
}
