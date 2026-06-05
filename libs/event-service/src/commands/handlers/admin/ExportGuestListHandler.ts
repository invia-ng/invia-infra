import * as Papa from 'papaparse';
import * as PDFDocument from 'pdfkit';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExportGuestListCommand } from '../../impl';
import { Event } from '@app/common/src/models/event.model';
import { Guest } from '@app/common/src/models/guest.model';
import { Invitation } from '@app/common/src/models/invitation.model';
import { AccountRole, InvitationRSVPEnum, InvitationStatusEnum } from '@app/common/src/constants/enums';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { ExportGuestListInfo } from '@app/event-service/src/interface/schema';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
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
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    private readonly fileUploadService: FileUploadService,
  ) { }

  async execute(command: ExportGuestListCommand) {
    try {
      this.logger.log(`[EXPORT-GUEST-LIST-HANDLER-PROCESSING]`);

      const { eventId, payload, secureUser } = command;

      if (secureUser.role === AccountRole.MEMBER) {
        throw new ForbiddenException(
          'You do not have permission to export guest lists.',
        );
      }

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

      // Get all invitations for the selected guests
      const invitations = await this.invitationRepository.find({
        where: {
          guest: { id: In(payload.guestIds) },
          event: { id: eventId },
        },
      });

      const invitationMap = new Map<string, Invitation>();
      for (const invitation of invitations) {
        if (invitation.guest) {
          invitationMap.set(invitation.guest.id.toString(), invitation);
        }
      }

      const data = guests.map((guest) => {
        const row: any = {};
        if (payload.guestName) row['Guest Name'] = guest.name;
        if (payload.phoneNumber) row['Phone Number'] = guest.phone;
        if (payload.emailAddress) row['Email Address'] = guest.email;
        if (payload.party) row['Party'] = guest.party;

        const invitation = invitationMap.get(guest.id.toString());

        if (payload.isRSVP) {
          row['RSVP'] = invitation
            ? invitation.isRSVP && invitation.isInvitationAccessed
              ? InvitationRSVPEnum.CONFIRMED
              : !invitation.isInvitationAccessed
                ? InvitationRSVPEnum.AWAITING
                : InvitationRSVPEnum.REJECTED
            : '';
        }
        if (payload.inviteStatus) {
          row['Invite Status'] = invitation
            ? invitation.isInvitationSeen
              ? InvitationStatusEnum.SEEN
              : invitation.isEmailInviteDelivered ||
                invitation.isWhatsAppInviteDelivered
                ? InvitationStatusEnum.DELIVERED
                : invitation.isEmailInviteSent || invitation.isWhatsAppInviteSent
                  ? InvitationStatusEnum.SENT
                  : InvitationStatusEnum.PENDING
            : '';
        }
        return row;
      });

      let buffer: Buffer;
      let mimetype: string;
      let filename: string;

      if (payload.exportFormat === 'pdf') {
        const doc = new PDFDocument({ layout: 'landscape', margin: 30 });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));

        // -- 1. Title --
        doc.fontSize(18).text(`Guest List for Event: ${event.name || eventId}`, {
          align: 'center',
        });
        doc.moveDown();

        // -- 2. Define Table Columns --
        const tableTop = 100;
        const initialX = 30;
        const rowHeight = 20;

        // Based on possible keys in 'row' object from previous step
        // We'll map them to column configurations (header label, width, etc.)
        const allPossibleColumns = [
          { key: 'Guest Name', label: 'Guest Name', width: 150 },
          { key: 'Phone Number', label: 'Phone Number', width: 100 },
          { key: 'Email Address', label: 'Email Address', width: 180 },
          { key: 'Party', label: 'Party', width: 100 },
          { key: 'RSVP', label: 'RSVP', width: 80 },
          { key: 'Invite Status', label: 'Invite Status', width: 100 },
        ];

        // Filter columns based on what's actually present in the data (or requested payload)
        // Since 'data' allows optional fields, we check the first row or payload flags directly.
        // Using payload flags is safer as data might be empty.
        const columns = allPossibleColumns.filter((col) => {
          if (col.key === 'Guest Name' && payload.guestName) return true;
          if (col.key === 'Phone Number' && payload.phoneNumber) return true;
          if (col.key === 'Email Address' && payload.emailAddress) return true;
          if (col.key === 'Party' && payload.party) return true;
          if (col.key === 'RSVP' && payload.isRSVP) return true;
          if (col.key === 'Invite Status' && payload.inviteStatus) return true;
          return false;
        });

        let currentY = tableTop;

        // Helper to draw headers
        const drawHeaders = (y: number) => {
          let currentX = initialX;
          doc
            .font('Helvetica-Bold')
            .fontSize(10)
            .fillColor('black');

          columns.forEach((col) => {
            doc.text(col.label, currentX + 5, y + 5, {
              width: col.width,
              align: 'left',
            });
            currentX += col.width;
          });

          // Draw bottom line for header
          doc
            .moveTo(initialX, y + rowHeight)
            .lineTo(currentX, y + rowHeight)
            .stroke();
        };

        drawHeaders(currentY);
        currentY += rowHeight;

        // -- 3. Draw Rows --
        doc.font('Helvetica').fontSize(10); // Reset font for data

        data.forEach((guestRow) => {
          let currentX = initialX;

          // Check for pagination
          if (currentY + rowHeight > doc.page.height - 50) {
            doc.addPage({ layout: 'landscape', margin: 30 });
            currentY = 30; // Reset Y to top margin
            drawHeaders(currentY);
            currentY += rowHeight;
            doc.font('Helvetica').fontSize(10); // Reset font after header
          }

          // Draw alternation (optional, skipping for clean look)
          // Draw cell content
          columns.forEach((col) => {
            const cellText = guestRow[col.key] ? String(guestRow[col.key]) : '-';
            doc.text(cellText, currentX + 5, currentY + 5, {
              width: col.width - 10, // padding
              align: 'left',
              ellipsis: true, // truncate if too long
            });
            currentX += col.width;
          });

          // Draw bottom line (light) for row
          doc
            .moveTo(initialX, currentY + rowHeight)
            .lineTo(currentX, currentY + rowHeight)
            .opacity(0.3)
            .stroke()
            .opacity(1); // Reset opacity for text

          currentY += rowHeight;
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
        file,
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
