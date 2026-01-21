import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseInterceptors, UploadedFiles, UseGuards 
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express'; // Changed interceptor
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * PUBLIC ROUTE
   * Customers use this to send recharge/withdraw requests.
   */
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file', maxCount: 1 },       // Standard Payment Receipt
        { name: 'promoFile', maxCount: 1 },  // New Promo Proof (Like/Share)
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            // Add a prefix so you know which file is which in the folder
            const prefix = file.fieldname === 'promoFile' ? 'promo' : 'payment';
            callback(null, `${prefix}-${uniqueSuffix}${ext}`);
          },
        }),
      },
    ),
  )
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @UploadedFiles() files: { file?: Express.Multer.File[], promoFile?: Express.Multer.File[] },
  ) {
    // 1. Handle Payment Proof (Standard)
    if (files.file && files.file.length > 0) {
      createTransactionDto.proofScreenshot = files.file[0].filename;
    }

    // 2. Handle Promo Proof (New)
    if (files.promoFile && files.promoFile.length > 0) {
      createTransactionDto.promoScreenshot = files.promoFile[0].filename;
    }

    // 3. Convert string values from FormData to proper types
    if (createTransactionDto.amount) {
      createTransactionDto.amount = Number(createTransactionDto.amount);
    }

    if (createTransactionDto.receivedAmount) {
      createTransactionDto.receivedAmount = Number(createTransactionDto.receivedAmount);
    }

    // 4. Convert 'true'/'false' string to actual Boolean
    createTransactionDto.usedPromo = String(createTransactionDto.usedPromo) === 'true';

    return this.transactionsService.create(createTransactionDto);
  }

  /**
   * PROTECTED ROUTES (Admin Only)
   */

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}