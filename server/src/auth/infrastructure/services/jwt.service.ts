import * as jwt from 'jsonwebtoken';
import 'dotenv/config';

export class JwtService {
  private secret = process.env.JWT_SECRET;

  generateToken(payload: any) {
    return jwt.sign(payload, this.secret, { expiresIn: '7d' });
  }
}
