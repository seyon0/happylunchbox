import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { MenusService } from './menus.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  // ---- CATEGORIES ----
  @Get('categories')
  findAllCategories(@Query('shopId') shopId: string) {
    if (!shopId) return [];
    return this.menusService.findAllCategories(shopId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('KITCHEN', 'ADMIN')
  @Post('categories')
  createCategory(@Body() body: any) {
    const { shopId, ...data } = body;
    return this.menusService.createCategory(shopId, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('KITCHEN', 'ADMIN')
  @Put('categories/reorder')
  reorderCategories(@Body() body: { shopId: string, categoryIds: string[] }) {
    return this.menusService.reorderCategories(body.shopId, body.categoryIds);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('KITCHEN', 'ADMIN')
  @Put('categories/:id')
  updateCategory(@Param('id') id: string, @Body() body: any) {
    return this.menusService.updateCategory(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('KITCHEN', 'ADMIN')
  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.menusService.deleteCategory(id);
  }

  // ---- STOCK TOGGLE ----
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('KITCHEN', 'ADMIN')
  @Put('stock/toggle')
  toggleStock(@Body() body: { type: 'ITEM' | 'VARIANT' | 'ADDON', id: string, isAvailable: boolean, autoReEnableAt?: string }) {
    return this.menusService.toggleStock(body.type, body.id, body.isAvailable, body.autoReEnableAt);
  }

  // ---- ITEMS (Legacy base paths) ----
  @Get()
  findAll(@Query('shopId') shopId: string) {
    if (!shopId) return [];
    return this.menusService.findAllByShop(shopId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('KITCHEN', 'ADMIN')
  @Post()
  create(@Body() body: any) {
    const { shopId, ...data } = body;
    return this.menusService.create(shopId, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('KITCHEN', 'ADMIN')
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.menusService.update(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('KITCHEN', 'ADMIN')
  @Put(':id/promo')
  updatePromo(@Param('id') id: string, @Body() body: any) {
    return this.menusService.updatePromo(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('KITCHEN', 'ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menusService.remove(id);
  }
}
