import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateLoteUseCase } from '../../application/use-cases/create-lote.use-case';
import { GetLotesUseCase } from '../../application/use-cases/get-lots.use-case';
import { UpdateLoteUseCase } from '../../application/use-cases/update-lot.use-case';
import { GetLoteUseCase } from 'src/lots/application/use-cases/get-lot.use-case';
import { DeleteLoteUseCase } from 'src/lots/application/use-cases/delete-lot.use-case';
import { FilterLotsUseCase } from 'src/lots/application/use-cases/get-lots-by-filter.use-case';
import { CreateLoteDTO } from '../dtos/create-lote.dto';
import { UpdateLoteDTO } from '../dtos/update-lot.dto';
import { JwtGuard } from '../../../auth/infrastructure/guards/jwt.guard';
import { FilterLotsDTO } from '../dtos/filter-lot-by-status.dto';

@UseGuards(JwtGuard)
@Controller('lotes')
export class LoteController {
  constructor(
    private createLote: CreateLoteUseCase,
    private getLotes: GetLotesUseCase,
    private updateLote: UpdateLoteUseCase,
    private getLote: GetLoteUseCase,
    private deleteLote: DeleteLoteUseCase,
    private filterLots: FilterLotsUseCase,
  ) {}

  @Post()
  create(@Body() body: CreateLoteDTO, @Req() req: any) {
    const userId = req.user.userId;
    return this.createLote.execute(body, userId);
  }

  @Get()
  findAll(@Req() req: any) {
    const userId = req.user.userId;
    return this.getLotes.execute(userId);
  }

  @Get('filter')
  async findFilters(@Req() req: any, @Query() filters: FilterLotsDTO) {
    return this.filterLots.execute(req.user.userId, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getLote.execute(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateLoteDTO) {
    return this.updateLote.execute(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.deleteLote.execute(id);
  }
}
