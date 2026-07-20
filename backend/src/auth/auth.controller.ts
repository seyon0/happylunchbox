import { Controller, Post, Body, UnauthorizedException, Get, UseGuards, Request, Res, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post('login')
  async login(@Body() body: any, @Request() req: any) {
    let user;
    if (body.method === 'phoneOTP') {
      user = await this.usersService.findOneByPhone(body.phone);
      if (!user) throw new UnauthorizedException('Phone number not registered');
      // For MVP: assume OTP is verified in a previous step or mock here
      // Ideally we would verify OTP here, but if body.otpCode exists, verify it:
      if (body.otpCode !== '000000' && user.otpCode !== body.otpCode) {
        throw new UnauthorizedException('Invalid OTP');
      }
    } else {
      user = await this.authService.validateUser(body.email, body.password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      if (user.twoFactorEnabled) {
        return this.authService.triggerOTP(user.id);
      }
    }
    return this.authService.login(user, req.ip, req.headers['user-agent']);
  }

  @Post('request-phone-otp')
  async requestPhoneOtp(@Body() body: { phone: string }) {
    const user = await this.usersService.findOneByPhone(body.phone);
    if (!user) {
      return { message: 'If the phone exists, an OTP has been sent.' };
    }
    // Read Twilio/SNS key from config
    // const config = await this.prisma.systemConfig.findUnique({ where: { key: 'OTP_API_KEY' } });
    
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    
    // In production, send via Twilio using the API key
    // await this.smsService.send(user.phone, otpCode, config?.value);
    
    await this.usersService.update(user.id, { otpCode, otpExpiry });
    return { message: 'OTP sent successfully (mocked: check DB or use 000000)' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    await this.authService.logout(req.user.sessionId);
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('force-logout')
  async forceLogout(@Body() body: { targetUserId: string }) {
    await this.authService.forceLogout(body.targetUserId);
    return { message: 'Forced logout successful' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('sessions')
  async getSessions(@Request() req: any) {
    return this.authService.getSessions(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('sessions/:sessionId')
  async revokeSession(@Request() req: any, @Param('sessionId') sessionId: string) {
    return this.authService.revokeSession(req.user.userId, sessionId);
  }

  @Post('request-password-reset')
  async requestPasswordReset(@Body() body: { email: string }) {
    return this.authService.requestPasswordReset(body.email);
  }

  @Post('register')
  async register(@Body() body: any) {
    const user = await this.usersService.create(body);
    // Send OTP instead of direct login
    return this.authService.triggerOTP(user.id);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: any, @Request() req: any) {
    const user = await this.authService.verifyOTP(body.userId, body.otpCode);
    if (!user) throw new UnauthorizedException('Invalid or expired OTP');
    return this.authService.login(user, req.ip, req.headers['user-agent']);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return this.usersService.findOneById(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateProfile(@Request() req: any, @Body() body: any) {
    // Only allow updating safe fields
    const safeData: any = {
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
      savedBoxes: body.savedBoxes,
    };
    // Remove undefined fields
    Object.keys(safeData).forEach(key => safeData[key] === undefined && delete safeData[key]);
    
    return this.usersService.update(req.user.userId, safeData);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('2fa')
  async toggle2FA(@Request() req: any, @Body() body: { enabled: boolean }) {
    return this.usersService.update(req.user.userId, { twoFactorEnabled: body.enabled });
  }

  // Google OAuth
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() req: any, @Res() res: any) {
    const jwt = await this.authService.login(req.user);
    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/auth/callback?token=${jwt.access_token}`);
  }

  // Facebook OAuth
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Request() req: any, @Res() res: any) {
    const jwt = await this.authService.login(req.user);
    res.redirect(`http://localhost:5173/auth/callback?token=${jwt.access_token}`);
  }

  // SMTP Settings
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'KITCHEN')
  @Get('smtp-config')
  async getSmtpConfig(@Request() req: any) {
    return this.authService.getSmtpConfig(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'KITCHEN')
  @Post('smtp-config')
  async updateSmtpConfig(@Request() req: any, @Body() body: any) {
    return this.authService.updateSmtpConfig(req.user.userId, body);
  }
}
