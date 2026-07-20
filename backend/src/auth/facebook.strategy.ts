import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private usersService: UsersService) {
    super({
      clientID: process.env.FACEBOOK_APP_ID || 'placeholder',
      clientSecret: process.env.FACEBOOK_APP_SECRET || 'placeholder',
      callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: (err: any, user: any, info?: any) => void): Promise<any> {
    const { name, emails, id } = profile;
    const user = {
      email: emails?.[0]?.value || `${id}@facebook.com`,
      firstName: name?.givenName || 'Facebook',
      lastName: name?.familyName || 'User',
      provider: 'FACEBOOK',
      providerId: id,
    };
    
    const authenticatedUser = await this.usersService.upsertOAuthUser(user);
    done(null, authenticatedUser);
  }
}
