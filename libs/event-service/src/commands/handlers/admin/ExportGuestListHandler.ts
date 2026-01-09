import * as Papa from 'papaparse';
import * as PDFDocument from 'pdfkit';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExportGuestListCommand } from '../../impl';
import { Inject, NotFoundException } from '@nestjs/common';
import { Event } from '@app/common/src/models/event.model';
import { Guest } from '@app/common/src/models/guest.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { ExportGuestListInfo } from '@app/event-service/src/interface/schema';
import { FileUploadService } from '@app/helper-service/src/services/file-upload.service';

@CommandHandler(ExportGuestListCommand)
export class ExportGuestListHandler implements ICommandHandler<
  ExportGuestListCommand,
  ExportGuestListInfo
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async execute(command: ExportGuestListCommand) {
    try {
      this.logger.log(`[EXPORT-GUEST-LIST-HANDLER-PROCESSING]`);

      const { eventId, payload, secureUser } = command;

      const event = await this.eventRepository.findOne({
        where: {
          id: eventId,
        },
      });

      if (!event) {
        throw new NotFoundException('Event not found.');
      }

      const guests = await this.guestRepository.find({
        where: {
          id: In(payload.guestIds),
          event: { id: eventId },
        },
        order: {
          createdAt: payload.sortBy ? 'ASC' : 'DESC',
        },
      });

      const data = guests.map((guest) => {
        const row: any = {};
        if (payload.guestName) row['Guest Name'] = guest.name;
        if (payload.phoneNumber) row['Phone Number'] = guest.phone;
        if (payload.emailAddress) row['Email Address'] = guest.email;
        if (payload.party) row['Party'] = guest.party;
        if (payload.isRSVP) row['RSVP'] = guest.isInviteRSVP ? 'Yes' : 'No';
        if (payload.inviteStatus) {
          row['Invite Sent'] = guest.isInviteSent ? 'Yes' : 'No';
          row['Invite Delivered'] = guest.isInviteDelivered ? 'Yes' : 'No';
        }
        return row;
      });

      let buffer: Buffer;
      let mimetype: string;
      let filename: string;

      if (payload.exportFormat === 'pdf') {
        const doc = new PDFDocument();
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));

        doc.text(`Guest List for Event: ${event.name || eventId}`);
        doc.moveDown();

        data.forEach((guest, index) => {
          doc.text(
            `${index + 1}. ${Object.entries(guest)
              .map(([k, v]) => `${k}: ${v}`)
              .join(', ')}`,
          );
        });

        doc.end();

        await new Promise((resolve) => {
          doc.on('end', resolve);
        });

        buffer = Buffer.concat(buffers);
        mimetype = 'application/pdf';
        filename = `guest-list-${eventId}-${Date.now()}.pdf`;
      } else {
        const csv = Papa.unparse(data);
        buffer = Buffer.from(csv);
        mimetype = 'text/csv';
        filename = `guest-list-${eventId}-${Date.now()}.csv`;
      }

      const file: any = {
        buffer,
        mimetype,
        originalname: filename,
      };

      const result = await this.fileUploadService.uploadGuestListExport(
        file.buffer,
        file.originalname,
        file.mimetype,
      );

      this.logger.log(`[EXPORT-GUEST-LIST-HANDLER-SUCCESS]`);

      return {
        fileUrl: result.url,
      };
    } catch (error) {
      this.logger.log(`[EXPORT-GUEST-LIST-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
