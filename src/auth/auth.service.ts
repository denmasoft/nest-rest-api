import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthResponse } from './models/interfaces/auth_response';
import { JWTConfiguration } from 'src/config/jwt.configuration';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponse } from './models/register.response';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private jwtConfiguration: JWTConfiguration,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      sub: user._id.toHexString(),
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshTokenPayload = { sub: user._id.toHexString() };
    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
      secret: this.jwtConfiguration.jwtSecret,
      expiresIn: this.jwtConfiguration.jwtExpirationTime,
    });

    return {
      token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    try {
      const verifiedRefreshPayload = this.jwtService.verify(refreshToken, {
        secret: this.jwtConfiguration.jwtSecret,
      });

      const user = await this.userService.findOneById(
        verifiedRefreshPayload.sub,
      );
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newAccessTokenPayload = {
        email: user.email,
        sub: user._id.toHexString()
      };
      const accessToken = await this.jwtService.signAsync(
        newAccessTokenPayload,
      );

      return { token: accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    try {
      const user = await this.userService.create(registerDto);
      const result: RegisterResponse = {
        _id: user._id.toHexString(),
        email: user.email,
        name: user.name,
      };
      return result;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        (error.message && error.message.includes('already exists'))
      ) {
        throw new ConflictException('Email already registered');
      }
      throw error;
    }
  }
}
