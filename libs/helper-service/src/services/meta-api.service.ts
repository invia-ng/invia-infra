import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { AppLogger } from '@app/common/src/logger/logger.service';

@Injectable()
export class MetaApiService {
  private readonly metaAccessToken: string;

  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    private configService: ConfigService,
  ) {
    this.metaAccessToken = this.configService.get<string>(
      'INVIA_META_ACCESS_TOKEN',
    );
  }

  async sendWhatsAppMessage(params: {
    to_phone: string;
    guest_name: string;
    event_name: string;
    image_url: string;
    message?: string;
    open_link?: string;
  }): Promise<void> {
    try {
      this.logger.log('[SEND-WHATSAPP-MESSAGE-PROCESSING]');

      const response = await axios.post(
        'https://graph.facebook.com/v25.0/989580150908205/messages',
        {
          messaging_product: 'whatsapp',
          to: params.to_phone,
          type: 'template',
          template: {
            name: 'invitation',
            language: { code: 'en' },
            components: [
              {
                type: 'header',
                parameters: [
                  {
                    type: 'image',
                    image: {
                      link: params.image_url,
                    },
                  },
                ],
              },
              {
                type: 'body',
                parameters: [
                  {
                    type: 'text',
                    parameter_name: 'guest_name',
                    text: params.guest_name,
                  },
                  {
                    type: 'text',
                    parameter_name: 'event_name',
                    text: params.event_name,
                  },
                ],
              },
              {
                type: 'button',
                sub_type: 'url',
                index: '0',
                parameters: [
                  {
                    type: 'text',
                    text: params?.open_link,
                  },
                ],
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.metaAccessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(`[META-API-RESPONSE] :: `, response.data);

      this.logger.log('[SEND-WHATSAPP-MESSAGE-SUCCESS]');
    } catch (error) {
      this.logger.error(`[SEND-WHATSAPP-MESSAGE-ERROR] :: ${error}`);
    }
  }
}
