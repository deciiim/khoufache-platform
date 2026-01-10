import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Import this
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './entities/transaction.entity'; // <--- Import your entity

@Module({
  // This line is the fix: It tells the module to load the Transaction Repository
  imports: [TypeOrmModule.forFeature([Transaction])], 
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}