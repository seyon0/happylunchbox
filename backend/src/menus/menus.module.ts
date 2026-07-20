import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { StockSchedulerService } from './stock-scheduler.service';

@Module({
  providers: [MenusService, StockSchedulerService],
  controllers: [MenusController]
})
export class MenusModule {}
