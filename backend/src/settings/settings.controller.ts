import { Controller, Get, Put, Body, Param, Res } from '@nestjs/common';
import { SettingsService } from './settings.service';
import type { Response } from 'express';

@Controller('api/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getAllSettings() {
    return this.settingsService.getAllSettings();
  }

  @Put(':key')
  updateSetting(@Param('key') key: string, @Body() body: any) {
    return this.settingsService.updateSetting(key, body.value);
  }

  @Get('backup')
  async exportBackup(@Res() res: Response) {
    const backupData = await this.settingsService.generateBackup();
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=platform-backup-${Date.now()}.json`);
    res.send(JSON.stringify(backupData, null, 2));
  }

  @Get('integrations')
  getIntegrations() {
    return this.settingsService.getIntegrations();
  }

  @Put('integrations/:name')
  updateIntegration(@Param('name') name: string, @Body() body: any) {
    return this.settingsService.updateIntegration(name, body);
  }
}
