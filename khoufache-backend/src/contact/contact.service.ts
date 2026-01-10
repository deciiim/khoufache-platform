import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ContactService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(data: any) {
    const { name, phone, email, message } = data;

    try {
      await this.mailerService.sendMail({
        to: 'youssefabayda207@gmail.com', // Where you receive the email
        subject: `New Message from Khoufache: ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #dc2626;">New Contact Request 🦇</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
            <br/>
            <p><strong>Message:</strong></p>
            <blockquote style="background: #f9f9f9; padding: 15px; border-left: 5px solid #dc2626;">
              ${message}
            </blockquote>
          </div>
        `,
      });
      return { success: true };
    } catch (error) {
      console.error('Email error:', error);
      throw error;
    }
  }
}