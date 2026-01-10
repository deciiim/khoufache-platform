import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseInterceptors, UploadedFile, UseGuards 
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
// --- NEW IMPORT ---
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * PUBLIC ROUTE
   * Customers use this to send recharge/withdraw requests.
   * No Guard here.
   */
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `proof-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createTransactionDto.proofScreenshot = file.filename;
    }

    if (createTransactionDto.amount) {
      createTransactionDto.amount = Number(createTransactionDto.amount);
    }

    return this.transactionsService.create(createTransactionDto);
  }

  /**
   * PROTECTED ROUTES
   * Only the Admin with a valid JWT token can access these.
   */

  @UseGuards(JwtAuthGuard) // <--- SECURED
  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @UseGuards(JwtAuthGuard) // <--- SECURED
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard) // <--- SECURED
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @UseGuards(JwtAuthGuard) // <--- SECURED
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}