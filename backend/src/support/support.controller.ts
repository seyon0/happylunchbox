import { Controller, Get, Put, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get('reviews')
  getReviews() {
    return this.supportService.getReviews();
  }

  @Put('reviews/:id/hide')
  hideReview(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.supportService.hideReview(id, body.reason);
  }

  @Get('tickets')
  getTickets() {
    return this.supportService.getTickets();
  }

  @UseGuards(JwtAuthGuard)
  @Get('tickets/my-tickets')
  getMyTickets(@Request() req: any) {
    return this.supportService.getMyTickets(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('tickets')
  createTicket(@Body() body: { subject: string, message: string }, @Request() req: any) {
    return this.supportService.createTicket(req.user.userId, body.subject, body.message);
  }

  @UseGuards(JwtAuthGuard)
  @Post('tickets/:id/reply')
  replyTicket(@Param('id') id: string, @Body() body: { text: string }, @Request() req: any) {
    // Determine if it's admin or customer. Let's use the role from token.
    const from = req.user.role === 'CUSTOMER' ? 'customer' : 'support';
    return this.supportService.replyTicket(id, from, body.text);
  }

  @Put('tickets/:id/status')
  updateTicketStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.supportService.updateTicketStatus(id, body.status);
  }

  @Put('tickets/:id/assign')
  assignTicket(@Param('id') id: string, @Body() body: { assignedTo: string }) {
    return this.supportService.assignTicket(id, body.assignedTo);
  }

  @Get('trends')
  getTrends() {
    return this.supportService.getTrends();
  }
}
