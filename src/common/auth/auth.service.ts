import { PrismaClient } from '../../generated/prisma/client';

import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { generate, generateSecret, generateURI, verify } from 'otplib';
import * as QRCode from 'qrcode';

@Injectable()
export class AuthService {
  constructor(@Inject('PrismaService') private prisma: PrismaClient) {}

  async register(phone: string) {
    const existingUser = await this.prisma.users.findUnique({
      where: { phone },
    });

    if (existingUser) {
      throw new BadRequestException(
        'Пользователь с таким номером уже существует',
      );
    }

    // Generate a secret
    const secret = generateSecret();

    const user = await this.prisma.users.create({
      data: {
        phone,
        totpSecret: secret,
        isVerified: false,
      },
    });

    // Generate a TOTP token
    const token = await generate({ secret });

    // Verify a token
    const verifyResult = await verify({ secret, token });

    if (!verifyResult.valid) {
      throw new Error('Failed to verify TOTP token');
    }

    // Generate QR code URI for authenticator apps
    const uri = generateURI({
      issuer: 'MyFairyPlace',
      label: 'user@example.com',
      secret,
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(uri);

    return {
      userId: user.id,
      phone: user.phone,
      qrCode,
      secret,
      message: 'Отсканируйте QR-код в Google Authenticator',
    };
  }

  /**
   * Верификация первого кода после регистрации
   */
  async verifyRegistration(phone: string, code: string) {
    const user = await this.prisma.users.findUnique({
      where: { phone },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    if (user.isVerified) {
      throw new BadRequestException('Пользователь уже верифицирован');
    }

    // Проверяем код
    const verifyResult = await verify({
      token: code,
      secret: user.totpSecret,
    }).catch((reason) => {
      throw new UnauthorizedException(reason);
    });

    if (!verifyResult.valid) {
      throw new UnauthorizedException('Неверный код');
    }

    // Помечаем пользователя как верифицированного
    await this.prisma.users.update({
      where: { phone },
      data: { isVerified: true },
    });

    return {
      message: 'Регистрация успешно завершена',
      userId: user.id,
    };
  }

  /**
   * Логин: проверка номера телефона и TOTP кода
   */
  async login(phone: string, code: string) {
    const user = await this.prisma.users.findUnique({
      where: { phone },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Пользователь не верифицирован. Завершите регистрацию',
      );
    }

    // Проверяем TOTP код
    const verifyResult = await verify({
      token: code,
      secret: user.totpSecret,
    });

    if (!verifyResult.valid) {
      throw new UnauthorizedException('Неверный код');
    }

    // Здесь генерируем JWT токен или создаем сессию
    const accessToken = this.generateAccessToken(user.id);

    return {
      accessToken,
      userId: user.id,
      phone: user.phone,
    };
  }

  /**
   * Генерация JWT токена (заглушка)
   */
  private generateAccessToken(userId: number): string {
    // Используйте @nestjs/jwt для реальной реализации
    return `token_${userId}_${Date.now()}`;
  }
}
