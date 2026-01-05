import { Event, EventInfo } from "../models/event.model";
import {Account, AccountInfo} from "../models/account.model";
import { Business, BusinessInfo } from "../models/business.model";
import { Notification, NotificationInfo } from "../models/notification.model";
import { EventCategoryEnum, FollowupConditionEnum, FollowupIntervalEnum, GuestPartyEnum, MessageTemplateEnum } from "../constants/enums";
import { EventCategoryInfo, GuestPartyInfo, MessageTemplateFollowupConditionInfo, MessageTemplateFollowupIntervalInfo, MessageTemplateEnumInfo } from "@app/event-service/src/interface/schema";
import { Guest, GuestInfo } from "../models/guest.model";
import { MessageTemplate, MessageTemplateInfo } from "../models/message.template.model";


export function FormatNotification(
  notification: Notification,
): NotificationInfo {
  delete notification.account;

  return {
    id: notification.id.toString(),
    title: notification.title,
    isRead: notification.isRead,
    message: notification.message,
    createdAt: notification.createdAt,
    notificationType: notification.notificationType,
  } as unknown as NotificationInfo;
}

export function FormatAccountInfo(
    account: Account,
): AccountInfo {
    return {
      id: account.id.toString(),
      name: account.name,
      firstName: account.firstName,
      lastName: account.lastName,
      phoneNumber: account.phoneNumber,
      // businessName: account.businessName,
      email: account.email,
      avatar: account.avatar,
      role: account.role,
      status: account.status,
      isAccountDisabled: account.isAccountDisabled,
      // businessAvatar: account.businessAvatar,
      isPasswordUpdated: account.isPasswordUpdated,
      isBusinessProfileUpdated: account.isBusinessProfileUpdated,
    } as unknown as AccountInfo;
}

export function FormatBusinessInfo(
    business: Business,
): BusinessInfo {
  return {
    id: business.id.toString(),
    name: business.name,
    avatar: business.avatar,
  } as unknown as BusinessInfo;
}

export function FormatEventInfo(
    event: Event,
    totalGuests: number,
    sentInvites: number,
    totalInvites: number,
    acceptedInvites: number,
    pendingInvites: number,
    failedInvites: number,
): EventInfo {
  return {
    totalGuests,
    sentInvites,
    totalInvites,
    failedInvites,
    pendingInvites,
    acceptedInvites,
    name: event.name,
    hash: event.hash,
    date: event.date,
    time: event.time,
    id: event.id.toString(),
    category: event.category,
    location: event.location,
  } as unknown as EventInfo;
}

export function FormatGuestInfo(
    guest: Guest,
): GuestInfo {
  return {
    id: guest.id.toString(),
    name: guest.name,
    party: guest.party,
    email: guest.email,
    phone: guest.phone,
    isInviteSent: guest.isInviteSent,
    isInviteDelivered: guest.isInviteDelivered,
    isInviteRSVP: guest.isInviteRSVP,
  } as unknown as GuestInfo;
}

export function FormatGuestPartyInfo(
    guestParty: GuestPartyEnum[],
): GuestPartyInfo[] {
    return guestParty.map((category) => {
      switch(category){
        case GuestPartyEnum.GROOM:
          return {
            title: 'Groom',
            value: category,
          } 
        case GuestPartyEnum.BRIDE:
          return {
            title: 'Bride',
            value: category,
          } 
        default:
          return {
            title: category,
            value: category,
          } 
      }
    }) as unknown as GuestPartyInfo[];
}

export function FormatMessageTemplateEnumInfo(
    guestParty: MessageTemplateEnum[],
): MessageTemplateEnumInfo[] {
    return guestParty.map((category) => {
      switch(category){
        case MessageTemplateEnum.GUEST_NAME:
          return {
            title: 'Guest Name',
            value: `{${category}}`,
          } 
        case MessageTemplateEnum.EVENT_NAME:
          return {
            title: 'Event Name',
            value: `{${category}}`,
          } 
        case MessageTemplateEnum.EVENT_DATE:
          return {
            title: 'Event Date',
            value: `{${category}}`,
          } 
        case MessageTemplateEnum.EVENT_TIME:
          return {
            title: 'Event Time',
            value: `{${category}}`,
          } 
        case MessageTemplateEnum.EVENT_LOCATION:
          return {
            title: 'Event Location',
            value: `{${category}}`,
          } 
        case MessageTemplateEnum.GUEST_PARTY:
          return {
            title: 'Guest Party',
            value: `{${category}}`,
          } 
        default:
          return {
            title: category,
            value: `{${category}}`,
          } 
      }
    }) as unknown as MessageTemplateEnumInfo[];
}

export function FormatMessageFollowupConditionInfo(
    guestParty: FollowupConditionEnum[],
): MessageTemplateFollowupConditionInfo[] {
    return guestParty.map((category) => {
      switch(category){
        case FollowupConditionEnum.RSVP:
          return {
            title: 'If RSVP',
            value: category,
          } 
        case FollowupConditionEnum.NO_RSVP:
          return {
            title: 'If no RSVP',
            value: category,
          } 
        default:
          return {
            title: category,
            value: category,
          } 
      }
    }) as unknown as MessageTemplateFollowupConditionInfo[];
}

export function FormatMessageFollowupIntervalInfo(
    guestParty: FollowupIntervalEnum[],
): MessageTemplateFollowupIntervalInfo[] {
    return guestParty.map((category) => {
      switch(category){
        case FollowupIntervalEnum.ONE_DAY:
          return {
            title: '1 day',
            value: category,
          } 
        case FollowupIntervalEnum.TWO_DAYS:
          return {
            title: '2 days',
            value: category,
          } 
        case FollowupIntervalEnum.THREE_DAYS:
          return {
            title: '3 days',
            value: category,
          } 
        case FollowupIntervalEnum.FOUR_DAYS:
          return {
            title: '4 days',
            value: category,
          } 
        case FollowupIntervalEnum.FIVE_DAYS:
          return {
            title: '5 days',
            value: category,
          } 
        case FollowupIntervalEnum.SIX_DAYS:
          return {
            title: '6 days',
            value: category,
          } 
        case FollowupIntervalEnum.SEVEN_DAYS:
          return {
            title: '7 days',
            value: category,
          } 
        case FollowupIntervalEnum.EIGHT_DAYS:
          return {
            title: '8 days',
            value: category,
          } 
        case FollowupIntervalEnum.NINE_DAYS:
          return {
            title: '9 days',
            value: category,
          } 
        case FollowupIntervalEnum.TEN_DAYS:
          return {
            title: '10 days',
            value: category,
          } 
        default:
          return {
            title: category,
            value: category,
          } 
      }
    }) as unknown as MessageTemplateFollowupIntervalInfo[];
}

export function FormatMessageTemplateInfo(
  template: MessageTemplate,
): MessageTemplateInfo {
  return {
    id: template.id.toString(),
    name: template.name,
    eventType: template.eventType,
    message: template.message,
    sendFollowup: template.sendFollowup,
    followupCondition: template.followupCondition,
    followupInterval: template.followupInterval,
  } as unknown as MessageTemplateInfo;
}

export function FormatEventCategoryInfo(
    eventCategory: EventCategoryEnum[],
): EventCategoryInfo[] {
    return eventCategory.map((category) => {
      switch(category){
        case EventCategoryEnum.OTHERS:
          return {
            title: 'Others',
            value: category,
          } 
        case EventCategoryEnum.WEDDING:
          return {
            title: 'Wedding',
            value: category,
          } 
        case EventCategoryEnum.CORPORATE:
          return {
            title: 'Corporate',
            value: category,
          } 
        case EventCategoryEnum.PARTY:
          return {
            title: 'Party',
            value: category,
          } 
        default:
          return {
            title: category,
            value: category,
          } 
      }
    }) as unknown as EventCategoryInfo[];
}

export default {
  FormatGuestInfo,
  FormatEventInfo,
  FormatAccountInfo,
  FormatNotification,
  FormatBusinessInfo,
  FormatGuestPartyInfo,
  FormatEventCategoryInfo,
  FormatMessageTemplateInfo,
  FormatMessageTemplateEnumInfo,
  FormatMessageFollowupIntervalInfo,
  FormatMessageFollowupConditionInfo,
};
