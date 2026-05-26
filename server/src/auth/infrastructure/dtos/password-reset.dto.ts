import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SendResetCodeDto {
  @IsEmail({}, { message: 'Correo electrónico inválido' })
  email!: string;
}

export class VerifyResetCodeDto {
  @IsEmail({}, { message: 'Correo electrónico inválido' })
  email!: string;

  @IsString()
  @Length(6, 6, { message: 'El código debe tener 6 dígitos' })
  code!: string;
}

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Correo electrónico inválido' })
  email!: string;

  @IsString()
  @Length(6, 6, { message: 'El código debe tener 6 dígitos' })
  code!: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 40, { message: 'La contraseña debe tener mínimo 6 caracteres' })
  newPassword!: string;
}