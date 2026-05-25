import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';

@Injectable()
export class JwtGuard implements CanActivate {
  private secret = process.env.JWT_SECRET;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No se encontro el token');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No se encontro el token');
    }

    try {
      const decoded = jwt.verify(token, this.secret);

      request.user = decoded;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token invalido');
    }
  }
}
