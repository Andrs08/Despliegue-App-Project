import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    example: 'Lote 1',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'juan@gmail.com',
  })
  @IsNotEmpty({ message: 'Debe ingresar una contraseña' })
  password!: string;
}
