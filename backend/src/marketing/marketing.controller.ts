import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MarketingService } from './marketing.service';

@Controller('api/marketing')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Get('coupons')
  getCoupons() {
    return this.marketingService.getCoupons();
  }

  @Post('coupons')
  createCoupon(@Body() body: any) {
    return this.marketingService.createCoupon(body);
  }

  @Put('coupons/:id/toggle')
  toggleCoupon(@Param('id') id: string) {
    return this.marketingService.toggleCoupon(id);
  }

  @Delete('coupons/:id')
  deleteCoupon(@Param('id') id: string) {
    return this.marketingService.deleteCoupon(id);
  }

  @Get('boosted-listings')
  getBoostedListings() {
    return this.marketingService.getBoostedListings();
  }

  @Post('boosted-listings')
  createBoostedListing(@Body() body: any) {
    return this.marketingService.createBoostedListing(body);
  }

  @Delete('boosted-listings/:id')
  deleteBoostedListing(@Param('id') id: string) {
    return this.marketingService.deleteBoostedListing(id);
  }

  @Get('cms')
  getCmsPages() {
    return this.marketingService.getCmsPages();
  }

  @Put('cms/:slug')
  updateCmsPage(@Param('slug') slug: string, @Body() body: any) {
    return this.marketingService.updateCmsPage(slug, body);
  }

  @Get('templates')
  getTemplates() {
    return this.marketingService.getTemplates();
  }

  @Put('templates/:slug')
  updateTemplate(@Param('slug') slug: string, @Body() body: any) {
    return this.marketingService.updateTemplate(slug, body);
  }
}
