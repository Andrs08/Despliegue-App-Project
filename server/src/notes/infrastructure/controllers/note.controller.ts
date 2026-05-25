import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Req,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Param } from '@nestjs/common/decorators';
import { CreateNoteUseCase } from '../../application/use-cases/create-note.use-case';
import { CreateNoteDto } from '../dtos/create-note.dto';
import { UpdateNoteDto } from '../dtos/update-note.dto';
import { UpdateNoteUseCase } from '../../application/use-cases/update-note.use-case';
import { GetNotesUseCase } from '../../application/use-cases/get-notes.use-case';
import { GetNoteUseCase } from 'src/notes/application/use-cases/get-note.use-case';
import { DeleteNoteUseCase } from 'src/notes/application/use-cases/delete-note.use-case';
import { JwtGuard } from 'src/auth/infrastructure/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtGuard)
@Controller('notes')
export class NoteController {
  constructor(
    private readonly createNoteUseCase: CreateNoteUseCase,
    private readonly updateNoteUseCase: UpdateNoteUseCase,
    private readonly getNotesUseCase: GetNotesUseCase,
    private readonly getNoteUseCase: GetNoteUseCase,
    private readonly deleteNoteUseCase: DeleteNoteUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createNoteDto: CreateNoteDto,
    @UploadedFile() file: any,
    @Req() req: any,
  ) {
    return await this.createNoteUseCase.execute(
      createNoteDto,
      req.user.userId,
      file,
    );
  }

  @Get()
  async findAll(@Req() req: any) {
    return await this.getNotesUseCase.execute(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.getNoteUseCase.execute(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @UploadedFile() file: any,
    @Req() req: any,
  ) {

    updateNoteDto.usuario_id = req.user.userId;
    return await this.updateNoteUseCase.execute(id, updateNoteDto, file);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.deleteNoteUseCase.execute(id);
  }
}
