import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}


  async create(createTransactionDto: CreateTransactionDto) {

    const newTransaction = this.transactionRepository.create({
      ...createTransactionDto,

      amount: Number(createTransactionDto.amount),

      receivedAmount: createTransactionDto.receivedAmount 
        ? Number(createTransactionDto.receivedAmount) 
        : undefined,

      usedPromo: String(createTransactionDto.usedPromo) === 'true',

    });

    return await this.transactionRepository.save(newTransaction);
  }


  async findAll() {
    return await this.transactionRepository.find({
      order: { createdAt: 'DESC' },
    });
  }


  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException(`Transaction #${id} not found`);
    }
    return transaction;
  }


  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.findOne(id);
    

    Object.assign(transaction, updateTransactionDto);
    
    return await this.transactionRepository.save(transaction);
  }

  async remove(id: number) {
    const transaction = await this.findOne(id);
    return await this.transactionRepository.remove(transaction);
  }
}