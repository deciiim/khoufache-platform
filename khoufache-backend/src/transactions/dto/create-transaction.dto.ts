import { IsString, IsNotEmpty, IsOptional, IsNumberString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  platform: string;

  @IsString()
  @IsNotEmpty()
  operationType: string;

  @IsString()
  @IsNotEmpty()
  playerId: string;

  // FormData sends numbers as strings, so we allow both
  @IsNotEmpty()
  amount: string | number;

  // --- NEW: Calculation Fields ---
  @IsOptional()
  receivedAmount?: string | number;

  @IsOptional()
  // Validates 'true' or 'false' strings from FormData
  usedPromo?: string | boolean; 

  // --- NEW: Payment Method Label ---
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  // --- IMAGES (FILENAMES) ---
  
  @IsOptional()
  @IsString()
  proofScreenshot?: string; // Standard Payment Receipt

  @IsOptional()
  @IsString()
  promoScreenshot?: string; // <--- NEW: Proof of Promo (Like/Share)

  @IsOptional()
  @IsString()
  status?: string;

  // --- WITHDRAWAL & CONTACT FIELDS ---

  @IsOptional()
  @IsString()
  withdrawMethod?: string;

  @IsOptional()
  @IsString()
  bank?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  rib?: string;
  
  @IsNotEmpty({ message: 'رقم الهاتف مطلوب للتواصل معكم' })
  @IsNumberString({}, { message: 'المرجو إدخال رقم هاتف صحيح' })
  phone: string;

  @IsOptional()
  @IsString()
  code?: string;
}