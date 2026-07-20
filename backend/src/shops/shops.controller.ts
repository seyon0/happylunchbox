import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ShopRolesGuard } from '../auth/shop-roles.guard';
import { ShopRoles } from '../auth/shop-roles.decorator';

@Controller('api/shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Get()
  findAll() {
    return this.shopsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopsService.findOne(id);
  }

  // Create a shop (requires KITCHEN role globally, but we'll assume JwtAuthGuard is enough for now, 
  // and the frontend handles role selection on registration)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any, @Body('ownerId') ownerId: string) {
    return this.shopsService.create(body, ownerId);
  }

  @UseGuards(JwtAuthGuard, ShopRolesGuard)
  @ShopRoles('OWNER', 'MANAGER')
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.shopsService.update(id, body);
  }

  @UseGuards(JwtAuthGuard, ShopRolesGuard)
  @ShopRoles('OWNER', 'MANAGER')
  @Put(':id/operations')
  updateOperations(@Param('id') id: string, @Body() body: any) {
    return this.shopsService.updateOperations(id, body);
  }

  @UseGuards(JwtAuthGuard, ShopRolesGuard)
  @ShopRoles('OWNER', 'MANAGER') // STAFF cannot see performance
  @Get(':id/performance')
  getPerformance(@Param('id') id: string, @Query('range') range: string) {
    return this.shopsService.getPerformance(id, range);
  }

  // Staff Management
  @UseGuards(JwtAuthGuard, ShopRolesGuard)
  @ShopRoles('OWNER') // Only OWNER can manage staff
  @Post(':id/staff')
  addStaff(@Param('id') id: string, @Body() body: { email: string, role: 'MANAGER' | 'STAFF' }) {
    return this.shopsService.addStaff(id, body.email, body.role);
  }

  @UseGuards(JwtAuthGuard, ShopRolesGuard)
  @ShopRoles('OWNER')
  @Delete(':id/staff/:userId')
  removeStaff(@Param('id') id: string, @Param('userId') userId: string) {
    return this.shopsService.removeStaff(id, userId);
  }
}
