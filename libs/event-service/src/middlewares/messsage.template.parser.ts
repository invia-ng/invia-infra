import { Event } from "@app/common/src/models/event.model";
import { Guest } from "@app/common/src/models/guest.model";
import { MessageTemplateEnum } from "@app/common/src/constants/enums";
import modelsFormatter from '@app/common/src/middlewares/models.formatter';

export function MessageTemplateParser(template: string, event: Event, guest: Guest, enums: string[]): string {
  let message = template;

  enums.forEach(variable => {
    switch (variable) {
      case MessageTemplateEnum.GUEST_NAME:
        message = message.replace(new RegExp(`{${variable}}`, 'g'), guest.name);
        break;
      case MessageTemplateEnum.EVENT_NAME:
        message = message.replace(new RegExp(`{${variable}}`, 'g'), event.name);
        break;
      case MessageTemplateEnum.EVENT_DATE:
        message = message.replace(new RegExp(`{${variable}}`, 'g'), new Date(event.date).toDateString());
        break;
      case MessageTemplateEnum.EVENT_TIME:
        message = message.replace(new RegExp(`{${variable}}`, 'g'), event.time);
        break;
      case MessageTemplateEnum.EVENT_LOCATION:
        message = message.replace(new RegExp(`{${variable}}`, 'g'), event.location);
        break;
      case MessageTemplateEnum.GUEST_PARTY:
        message = message.replace(new RegExp(`{${variable}}`, 'g'), guest.party);
        break;
    }
  });

  return message;
}