import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  platform: string; // '1xbet', 'melbet', 'linebet'

  @Column()
  operationType: string; // 'recharge' or 'sahl'

  @Column()
  playerId: string; // Betting ID

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  proofScreenshot: string;

  @Column({ default: 'PENDING' })
  status: string;

  // --- CONTACT FIELD (Mandatory for all operations) ---
  
  @Column() // Removed nullable: true to make it required
  phone: string; // The user's WhatsApp or contact number

  // --- NEW FIELDS FOR WITHDRAWAL (SAHL) ---
  
  @Column({ nullable: true })
  withdrawMethod: string; 

  @Column({ nullable: true })
  bank: string; 

  @Column({ nullable: true })
  fullName: string; 

  @Column({ nullable: true })
  rib: string; 

  @Column({ nullable: true })
  code: string; 

  // ----------------------------------------

  @CreateDateColumn()
  createdAt: Date;
}