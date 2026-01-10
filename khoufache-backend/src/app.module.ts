import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config'; // <--- NEW
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { Transaction } from './transactions/entities/transaction.entity';
import { ContactModule } from './contact/contact.module';
import { AuthModule } from './auth/auth.module'; // <--- NEW

@Module({
  imports: [
    // 1. Load Environment Variables (CRITICAL)
    ConfigModule.forRoot({
      isGlobal: true, // Makes .env available everywhere
    }),

    // 2. Auth Module (Handles Login & Security)
    AuthModule,

    // 3. Static Files (Images)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    // 4. Database Connection (Now using .env)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [Transaction],
        synchronize: true, // Keep true for local dev, false for production
      }),
    }),

    // 5. Email Configuration (Securely using .env or config)
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: 'youssefabayda207@gmail.com',
            pass: configService.get<string>('EMAIL_PASS'), // Set this in .env
          },
        },
        defaults: {
          from: '"Khoufache Contact" <youssefabayda207@gmail.com>',
        },
      }),
    }),

    TransactionsModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}