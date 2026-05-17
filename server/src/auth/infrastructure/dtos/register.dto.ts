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
    example: '123',
  })
  @MinLength(6)
  password!: string;
}
