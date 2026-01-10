// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async login(username: string, pass: string) {
    // We add '' as a fallback to ensure we always have a string
    const adminUser = this.configService.get<string>('ADMIN_USERNAME') || '';
    const adminHash = this.configService.get<string>('ADMIN_PASSWORD_HASH') || '';

    // Security check: If .env variables are missing, don't even try to compare
    if (!adminUser || !adminHash) {
      throw new UnauthorizedException('Server configuration error: Admin credentials missing');
    }

    const isMatch = await bcrypt.compare(pass, adminHash);

    if (username === adminUser && isMatch) {
      const payload = { username: username, sub: 'admin' };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    
    throw new UnauthorizedException('Invalid Credentials');
  }
}