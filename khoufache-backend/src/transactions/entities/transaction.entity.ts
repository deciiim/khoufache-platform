import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  platform: string; // '1xbet', 'melbet', 'linebet'

  @Column()
  operationType: string; // 'recharge' or 'sahl'

  // --- NEW: Payment Method Label ---
  @Column({ nullable: true })
  paymentMethod: string; // Stores 'CIH Bank', 'Orange Dealer', etc.

  @Column()
  playerId: string; // Betting ID

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number; // The raw amount entered by the user

  // --- NEW: Calculation & Promo Tracking ---
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  receivedAmount: number; // Final amount after 10% commission (or 0% if promo used)

  @Column({ default: false })
  usedPromo: boolean; // True if the user toggled the "Khoufache" promo code

  @Column({ nullable: true })
  proofScreenshot: string; // The Payment Receipt

  // --- NEW: Promo Proof Screenshot ---
  @Column({ nullable: true })
  promoScreenshot: string; // <--- NEW COLUMN for the "Like/Share" proof

  @Column({ default: 'PENDING' })
  status: string;

  @Column() 
  phone: string; // User's WhatsApp number

  // --- WITHDRAWAL (SAHL) FIELDS ---
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

  @CreateDateColumn()
  createdAt: Date;
}