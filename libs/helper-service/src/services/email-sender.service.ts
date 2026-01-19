import axios from 'axios';
import { Kibamail } from 'kibamail';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { AppLogger } from '@app/common/src/logger/logger.service';
import { EmailRequest } from 'libs/notification-service/src/interface';

@Injectable()
export class EmailSenderService {
  private kibamail: Kibamail;

  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    private configService: ConfigService,
  ) {
    this.kibamail = new Kibamail(
      this.configService.get<string>('KIBA_MAIL_API_KEY'),
    );
  }

  async sendEmail(config: {
    from_name?: string;
    from_email?: string;
    to_email: string;
    html: string;
    sub: string;
    attachment?: { url?: string; content: string; name: string }[];
  }): Promise<void> {
    try {
      this.logger.log('[SEND-EMAIL-VIA-BREVO-GATEWAY-PROCESSING]');

      const apiKey = process.env.BREVO_API_KEY;
      const emailRequest: EmailRequest = {
        sender: {
          name: this.configService.get<string>('MAIL_FROM_NAME') ?? 'Invia',
          email: this.configService.get<string>('MAIL_FROM_EMAIL'),
        },
        to: [
          {
            email: config.to_email,
          },
        ],
        subject: config.sub,
        htmlContent: config.html,
        attachment: config.attachment,
      };

      // console.log(
      //   'BREVO_API_KEY : ',
      //   this.configService.get<string>('BREVO_API_KEY'),
      // );

      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        emailRequest,
        {
          headers: {
            accept: 'application/json',
            'api-key': apiKey,
            'content-type': 'application/json',
          },
        },
      );

      console.log('Email sent successfully:', response.data);

      this.logger.log('[SEND-EMAIL-VIA-BREVO-GATEWAY-SUCCESS]');
    } catch (error) {
      this.logger.error(`[SEND-EMAIL-VIA-BREVO-GATEWAY-ERROR] :: ${error}`);
    }
  }

  async sendEmailViaKibaAdmin(config: {
    from_name?: string;
    from_email?: string;
    to_email: string;
    html: string;
    sub: string;
    attachment?: { url?: string; content: string; name: string }[];
  }): Promise<void> {
    try {
      this.logger.log('[SEND-EMAIL-VIA-KIBA-GATEWAY-PROCESSING]');

      const emailRequest = {
        from: config.from_email || this.configService.get<string>('MAIL_FROM_EMAIL'),
        to: config.to_email,
        subject: config.sub,
        html: config.html,
      };

      // console.log(
      //   'KIBA_MAIL_API_KEY : ',
      //   this.configService.get<string>('KIBA_MAIL_API_KEY'),
      // );

      const { data, error } = await this.kibamail.emails.send(emailRequest);

      console.log('Email response data : ', data);
      console.log('Email response error : ', error);

      if (error) {
        console.log(error.error.validationErrors);
        throw error;
      }
      this.logger.log('[SEND-EMAIL-VIA-KIBA-GATEWAY-SUCCESS]');
    } catch (error) {
      console.log(error);

      this.logger.error(`[SEND-EMAIL-VIA-KIBA-GATEWAY-ERROR] :: ${error}`);
    }
  }
}
