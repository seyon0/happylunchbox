import {
  Controller, Get, Put, Post, Delete, Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Put('ip-allowlist')
  updateIpAllowlist(@Body() body: { targetUserId: string; ips: string }, @Request() req: any) {
    // In a real scenario, restrict to super-admins
    return this.adminService.updateIpAllowlist(body.targetUserId, body.ips);
  }

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardMetrics();
  }

  @Get('audit-logs')
  getAuditLogs(@Query('page') page: string, @Query('limit') limit: string) {
    return this.adminService.getAuditLogs(+page || 1, +limit || 20);
  }

  @Get('vendors')
  getAllVendors(@Query('page') page: string, @Query('limit') limit: string) {
    return this.adminService.getAllShops(+page || 1, +limit || 20);
  }

  @Get('vendors/onboarding')
  getOnboardingQueue() {
    return this.adminService.getVendorOnboardingQueue();
  }

  @Put('vendors/:id/status')
  updateVendorStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req: any,
  ) {
    return this.adminService.updateVendorStatus(id, status, req.user.userId);
  }

  @Get('system-config')
  getSystemConfig() {
    return this.adminService.getSystemConfig();
  }

  @Put('system-config')
  updateSystemConfig(@Body() body: { key: string; value: string }, @Request() req: any) {
    return this.adminService.updateSystemConfig(body.key, body.value, req.user.userId);
  }

  @Get('commission-tiers')
  getCommissionTiers() {
    return this.adminService.getCommissionTiers();
  }

  @Post('commission-tiers')
  createCommissionTier(@Body() body: any) {
    return this.adminService.createCommissionTier(body);
  }

  @Get('customers')
  getAllCustomers(@Query('page') page: string, @Query('limit') limit: string) {
    return this.adminService.getAllCustomers(+page || 1, +limit || 20);
  }

  @Put('customers/:id/ban')
  banCustomer(@Param('id') id: string, @Request() req: any) {
    return this.adminService.banCustomer(id, req.user.userId);
  }

  @Put('customers/:id/unban')
  unbanCustomer(@Param('id') id: string, @Request() req: any) {
    return this.adminService.unbanCustomer(id, req.user.userId);
  }

  @Get('orders')
  getAllOrders(@Query('page') page: string, @Query('limit') limit: string) {
    return this.adminService.getAllOrders(+page || 1, +limit || 20);
  }

  @Put('orders/:id/force-cancel')
  forceCancelOrder(@Param('id') id: string, @Request() req: any) {
    return this.adminService.forceCancelOrder(id, req.user.userId);
  }

  @Get('riders')
  getAllRiders(@Query('page') page: string, @Query('limit') limit: string) {
    return this.adminService.getAllRiders(+page || 1, +limit || 20);
  }

  @Put('riders/:id/toggle-status')
  toggleRiderStatus(@Param('id') id: string, @Request() req: any) {
    return this.adminService.toggleRiderAvailability(id, req.user.userId);
  }

  @Get('support')
  getSupportTickets(@Query('page') page: string, @Query('limit') limit: string) {
    return this.adminService.getSupportTickets(+page || 1, +limit || 20);
  }

  @Put('support/:id')
  updateTicket(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    return this.adminService.updateTicket(id, data, req.user.userId);
  }

  @Get('payouts')
  getPayouts(@Query('page') page: string, @Query('limit') limit: string) {
    return this.adminService.getPayouts(+page || 1, +limit || 20);
  }

  // --- SUB-ADMINS & ROLES ---
  @Get('subadmins')
  getSubAdmins() {
    return this.adminService.getSubAdmins();
  }

  @Post('subadmins')
  createSubAdmin(@Body() body: any) {
    return this.adminService.createSubAdmin(body);
  }

  @Put('subadmins/:id')
  updateSubAdmin(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateSubAdmin(id, body);
  }

  @Get('permissions')
  getPermissions() {
    return this.adminService.getPermissions();
  }

  // --- PROMOTIONS ---
  @Get('promotions')
  getPromotions() {
    return this.adminService.getPromotions();
  }

  @Post('promotions')
  createPromotion(@Body() body: any) {
    return this.adminService.createPromotion(body);
  }

  @Put('promotions/:id')
  updatePromotion(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updatePromotion(id, body);
  }

  @Delete('promotions/:id')
  deletePromotion(@Param('id') id: string) {
    return this.adminService.deletePromotion(id);
  }
}
