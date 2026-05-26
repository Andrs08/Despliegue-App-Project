import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
  Get,
} from '@nestjs/common';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterDTO } from '../dtos/register.dto';
import { LoginDTO } from '../dtos/login.dto';
import path from 'node:path';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UpdateUserUseCase } from 'src/auth/application/use-cases/update-user.use-case';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ResetPasswordDto, SendResetCodeDto, VerifyResetCodeDto } from '../dtos/password-reset.dto';
import { GetProfileUseCase } from 'src/auth/application/use-cases/get-profile.use-case';
import { ResetPasswordUseCase } from 'src/auth/application/use-cases/reset-password.use-case';
import { VerifyResetCodeUseCase } from 'src/auth/application/use-cases/verify-reset-code.use-case';
import { SendResetCodeUseCase } from 'src/auth/application/use-cases/send-reset-code.use-case';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private sendResetCodeUseCase: SendResetCodeUseCase,
    private verifyResetCodeUseCase: VerifyResetCodeUseCase,
    private resetPasswordUseCase: ResetPasswordUseCase,
    private getProfileUseCase: GetProfileUseCase,

  ) { }

  @Post('register')
  @ApiOperation({
    summary: 'Registrar usuario',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado correctamente',
  })
  register(@Body() body: RegisterDTO) {
    return this.registerUseCase.execute(body);
  }

  @ApiOperation({
    summary: 'Login de usuario',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario loggeado correctamente',
  })
  @Post('login')
  login(@Body() body: LoginDTO) {
    return this.loginUseCase.execute(body);
  }

  @Get('profile/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario' })
  getProfile(@Param('id') id: string) {
    return this.getProfileUseCase.execute(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Actualizar perfil del usuario' })
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: any,
  ) {
    return this.updateUserUseCase.execute(id, updateUserDto, file);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Enviar código de recuperación al correo' })
  @ApiResponse({ status: 201, description: 'Código enviado si el correo existe' })
  async sendResetCode(@Body() body: SendResetCodeDto) {
    await this.sendResetCodeUseCase.execute(body.email);
    return { message: 'Si el correo existe, recibirás un código de verificación.' };
  }

  @Post('verify-reset-code')
  @ApiOperation({ summary: 'Verificar código de recuperación' })
  @ApiResponse({ status: 201, description: 'Código válido' })
  async verifyResetCode(@Body() body: VerifyResetCodeDto) {
    await this.verifyResetCodeUseCase.execute(body.email, body.code);
    return { message: 'Código verificado correctamente' };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Restablecer contraseña con código verificado' })
  @ApiResponse({ status: 201, description: 'Contraseña actualizada correctamente' })
  async resetPassword(@Body() body: ResetPasswordDto) {
    await this.resetPasswordUseCase.execute(
      body.email,
      body.code,
      body.newPassword,
    );
    return { message: 'Contraseña actualizada correctamente' };
  }

}
