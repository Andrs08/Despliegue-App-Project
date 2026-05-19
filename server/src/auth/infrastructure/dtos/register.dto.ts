import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDTO {
  @ApiProperty({
    example: 'Juan',
  })
  @IsNotEmpty({ message: 'El nombre no debe estar vacio' })
  name!: string;

  @IsEmail()
  @ApiProperty({
    example: 'juan@gmail.com',
  })
  email!: string;

  @ApiProperty({
    example: 'password123',
  })
  @MinLength(6, { message: 'La contraseña debe tener mínimo 6 caracteres' })
  password!: string;
}
