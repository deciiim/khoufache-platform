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

  // Save a new order to the database
  async create(createTransactionDto: CreateTransactionDto) {
    // FIX: We convert the DTO into the Entity format manually
    // This solves the "string | number" error by forcing it to be a Number
    const newTransaction = this.transactionRepository.create({
      ...createTransactionDto,
      amount: Number(createTransactionDto.amount), 
    });

    return await this.transactionRepository.save(newTransaction);
  }

  // Get all orders (Admin Dashboard uses this)
  async findAll() {
    return await this.transactionRepository.find({
      order: { createdAt: 'DESC' } // Newest orders first
    });
  }

  // Get one specific order
  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException(`Transaction #${id} not found`);
    }
    return transaction;
  }

  // Update status (e.g., from PENDING to COMPLETED)
  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.findOne(id); // Check if it exists first
    
    // Apply the updates
    Object.assign(transaction, updateTransactionDto);
    
    return await this.transactionRepository.save(transaction);
  }

  // Delete an order
  async remove(id: number) {
    const transaction = await this.findOne(id);
    return await this.transactionRepository.remove(transaction);
  }
}