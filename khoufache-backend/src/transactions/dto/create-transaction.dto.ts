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

  // FormData sends numbers as strings, so we validate it accordingly
  @IsNotEmpty()
  amount: string | number;

  @IsOptional()
  @IsString()
  proofScreenshot?: string;

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

  /**
   * The user's contact number.
   * Using IsNumberString ensures only numeric characters are accepted,
   * which is ideal for Moroccan phone numbers (e.g., 06XXXXXXXX).
   */
  @IsNotEmpty({ message: 'رقم الهاتف مطلوب للتواصل معكم' })
  @IsNumberString({}, { message: 'المرجو إدخال رقم هاتف صحيح' })
  phone: string;

  @IsOptional()
  @IsString()
  code?: string;
}