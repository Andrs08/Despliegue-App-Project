import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IMailService } from '../../application/use-cases/send-reset-code.use-case';

@Injectable()
export class AppMailerService implements IMailService {
  constructor(private readonly mailer: MailerService) { }

  async sendResetCode(email: string, code: string): Promise<void> {
    try {
      await this.mailer.sendMail({
        to: email,
        subject: 'BanaEye — Código de recuperación de contraseña',
        html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
          <h2 style="color: #5D7B3D;">Recupera tu contraseña</h2>
          <p>Usa el siguiente código para restablecer tu contraseña. 
             Es válido por <strong>15 minutos</strong>.</p>
          <div style="
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 12px;
            color: #5D7B3D;
            background: #EAF4E7;
            padding: 18px 24px;
            border-radius: 10px;
            text-align: center;
            margin: 24px 0;
          ">${code}</div>
          <p style="color: #959595; font-size: 13px;">
            Si no solicitaste este código, puedes ignorar este mensaje.
          </p>
        </div>
      `,
      });
    } catch (error) {
      console.error('Error enviando correo de recuperación:', error);
    }
  }
}