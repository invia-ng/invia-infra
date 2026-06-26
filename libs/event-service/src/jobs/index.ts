import { EventCronService } from './event.cron.service';
import { EventMessageCronService } from './event.message.cron.service';

export const EventServiceCronHandlers = [
  EventCronService,
  EventMessageCronService,
];
