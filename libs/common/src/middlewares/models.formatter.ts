import {
  AccountRole,
  AccountStatus,
  EventCategoryEnum,
  FollowupConditionEnum,
  FollowupIntervalEnum,
  GuestPartyEnum,
  GuestTimelineActionEnum,
  MessageTemplateEnum,
} from '../constants/enums';
import {
  Event,
  EventInfo,
  EventParty,
  EventPartyInfo,
} from '../models/event.model';
import {
  FollowupMessageTemplate,
  FollowupMessageTemplateInfo,
  MessageTemplate,
  MessageTemplateInfo,
} from '../models/message.template.model';
import {
  GuestPartyInfo,
  EventCategoryInfo,
  MessageTemplateEnumInfo,
  MessageTemplateFollowupIntervalInfo,
  MessageTemplateFollowupConditionInfo,
  EventGuestIdInfo,
  GuestTimelineActionEnumInfo,
} from '@app/event-service/src/interface/schema';
import {
  Guest,
  GuestInfo,
  GuestTimeline,
  GuestTimelineInfo,
} from '../models/guest.model';
import { Account, AccountInfo, BusinessMemberInfo } from '../models/account.model';
import { Business, BusinessInfo } from '../models/business.model';
import { Notification, NotificationInfo } from '../models/notification.model';
import { BusinessMemberRoleInfo } from '@app/account-service/src/interface/schema';
import {
  Subscription,
  SubscriptionInfo,
  SubscriptionPlan,
  SubscriptionPlanFeature,
  SubscriptionPlanFeatureInfo,
  SubscriptionPlanInfo,
} from '../models/subscription.model';
import { ChargeResponse, ChargeResponseData, InvitationChargeResponse } from '@app/subscription-service/src/interface/schema';
import { formatTo12HourTime, formatToCustomDate } from '../utils/date.utils';
import { Invitation } from '../models/invitation.model';
import { maskEmailAddress, maskPhoneNumber } from '../utils/string.utils';

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

export function FormatAccountInfo(account: Account, subscription?: Subscription | null): AccountInfo {
  return {
    id: account.id.toString(),
    name: account.name,
    phoneNumber: account.phoneNumber,
    // businessName: account.businessName,
    email: account.email,
    avatar: account.avatar,
    role: account.role,
    status: account.status,
    isAccountDisabled: account.isAccountDisabled,
    isPasswordUpdated: account.isPasswordUpdated,
    isBusinessProfileUpdated: account.isBusinessProfileUpdated,
    subscriptionPlan: subscription ? subscription.plan.name : 'Pay As You Go',
  } as unknown as AccountInfo;
}

export function FormatBusinessMemberInfo(account: Account): BusinessMemberInfo {
  return {
    id: account.id.toString(),
    name: account.name,
    phoneNumber: account.phoneNumber,
    // businessName: account.businessName,
    email: account.email,
    role: account.role,
    status: account.status,
    isInvitationAccepted: account.status === AccountStatus.ACTIVE ? true : false,
  } as unknown as BusinessMemberInfo;
}

export function FormatBusinessInfo(business: Business): BusinessInfo {
  return {
    id: business.id.toString(),
    name: business.name,
    email: business.email,
    phone: business.phone,
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

export function FormatGuestInfo(guest: Guest, invitation?: Invitation, maskData: boolean = false): GuestInfo {
  return {
    id: guest.id.toString(),
    name: guest.name,
    party: guest.party,
    email: maskData ? maskEmailAddress(guest.email) : guest.email,
    phone: maskData ? maskPhoneNumber(guest.phone) : guest.phone,
    isEmailInviteSent: invitation ? invitation.isEmailInviteSent : false,
    isEmailInviteDelivered: invitation ? invitation.isEmailInviteDelivered : false,
    isWhatsAppInviteSent: invitation ? invitation.isWhatsAppInviteSent : false,
    isWhatsAppInviteDelivered: invitation ? invitation.isWhatsAppInviteDelivered : false,
    isInviteRSVP: guest.isInviteRSVP,
  } as unknown as GuestInfo;
}

export function FormatGuestPartyInfo(
  guestParty: GuestPartyEnum[],
): GuestPartyInfo[] {
  return guestParty.map((category) => {
    switch (category) {
      case GuestPartyEnum.GROOM:
        return {
          title: 'Groom',
          value: category,
        };
      case GuestPartyEnum.BRIDE:
        return {
          title: 'Bride',
          value: category,
        };
      default:
        return {
          title: category,
          value: category,
        };
    }
  }) as unknown as GuestPartyInfo[];
}

export function FormatMessageTemplateEnumInfo(
  guestParty: MessageTemplateEnum[],
): MessageTemplateEnumInfo[] {
  return guestParty.map((category) => {
    switch (category) {
      case MessageTemplateEnum.GUEST_NAME:
        return {
          title: 'Guest Name',
          value: `{${category}}`,
        };
      case MessageTemplateEnum.EVENT_NAME:
        return {
          title: 'Event Name',
          value: `{${category}}`,
        };
      case MessageTemplateEnum.EVENT_DATE:
        return {
          title: 'Event Date',
          value: `{${category}}`,
        };
      case MessageTemplateEnum.EVENT_TIME:
        return {
          title: 'Event Time',
          value: `{${category}}`,
        };
      case MessageTemplateEnum.EVENT_LOCATION:
        return {
          title: 'Event Location',
          value: `{${category}}`,
        };
      case MessageTemplateEnum.GUEST_PARTY:
        return {
          title: 'Guest Party',
          value: `{${category}}`,
        };
      default:
        return {
          title: category,
          value: `{${category}}`,
        };
    }
  }) as unknown as MessageTemplateEnumInfo[];
}

export function FormatMessageFollowupConditionInfo(
  guestParty: FollowupConditionEnum[],
): MessageTemplateFollowupConditionInfo[] {
  return guestParty.map((category) => {
    switch (category) {
      case FollowupConditionEnum.RSVP:
        return {
          title: 'If RSVP',
          value: category,
        };
      case FollowupConditionEnum.NO_RSVP:
        return {
          title: 'If no RSVP',
          value: category,
        };
      default:
        return {
          title: category,
          value: category,
        };
    }
  }) as unknown as MessageTemplateFollowupConditionInfo[];
}

export function FormatMessageFollowupIntervalInfo(
  guestParty: FollowupIntervalEnum[],
): MessageTemplateFollowupIntervalInfo[] {
  return guestParty.map((category) => {
    switch (category) {
      case FollowupIntervalEnum.ONE_DAY:
        return {
          title: '1 day',
          value: category,
        };
      case FollowupIntervalEnum.TWO_DAYS:
        return {
          title: '2 days',
          value: category,
        };
      case FollowupIntervalEnum.THREE_DAYS:
        return {
          title: '3 days',
          value: category,
        };
      case FollowupIntervalEnum.FOUR_DAYS:
        return {
          title: '4 days',
          value: category,
        };
      case FollowupIntervalEnum.FIVE_DAYS:
        return {
          title: '5 days',
          value: category,
        };
      case FollowupIntervalEnum.SIX_DAYS:
        return {
          title: '6 days',
          value: category,
        };
      case FollowupIntervalEnum.SEVEN_DAYS:
        return {
          title: '7 days',
          value: category,
        };
      case FollowupIntervalEnum.EIGHT_DAYS:
        return {
          title: '8 days',
          value: category,
        };
      case FollowupIntervalEnum.NINE_DAYS:
        return {
          title: '9 days',
          value: category,
        };
      case FollowupIntervalEnum.TEN_DAYS:
        return {
          title: '10 days',
          value: category,
        };
      default:
        return {
          title: category,
          value: category,
        };
    }
  }) as unknown as MessageTemplateFollowupIntervalInfo[];
}

export function FormatMessageTemplateInfo(
  template: MessageTemplate,
  followupTemplates: FollowupMessageTemplate[],
): MessageTemplateInfo {
  return {
    id: template.id.toString(),
    name: template.name,
    eventType: template.eventType,
    message: template.message,
    sendFollowup: template.sendFollowup,
    followupCondition: template.followupCondition,
    followupInterval: template.followupInterval,
    followupTemplates: followupTemplates.map((followupTemplate) => {
      return {
        id: followupTemplate.id.toString(),
        message: followupTemplate.message,
        condition: followupTemplate.condition,
        interval: followupTemplate.interval,
      } as unknown as FollowupMessageTemplateInfo;
    }),
  } as unknown as MessageTemplateInfo;
}

export function FormatEventCategoryInfo(
  eventCategory: EventCategoryEnum[],
): EventCategoryInfo[] {
  return eventCategory.map((category) => {
    switch (category) {
      case EventCategoryEnum.OTHERS:
        return {
          title: 'Others',
          value: category,
        };
      case EventCategoryEnum.WEDDING:
        return {
          title: 'Wedding',
          value: category,
        };
      case EventCategoryEnum.CORPORATE:
        return {
          title: 'Corporate',
          value: category,
        };
      case EventCategoryEnum.PARTY:
        return {
          title: 'Party',
          value: category,
        };
      default:
        return {
          title: category,
          value: category,
        };
    }
  }) as unknown as EventCategoryInfo[];
}

export function FormatBusinessMemberRoleInfo(
  roles: AccountRole[],
): BusinessMemberRoleInfo[] {
  return roles.map((role) => {
    switch (role) {
      case AccountRole.MEMBER:
        return {
          value: role,
          title: 'Member role',
          description:
            'Can manage events, guests, and messages with limited access.',
        };
      case AccountRole.ADMIN:
        return {
          value: role,
          title: 'Admin role',
          description:
            'Full access to manage events, guests, messages, members, and account settings.',
        };
      default:
        return {
          title: role,
          value: role,
          description: role,
        };
    }
  }) as unknown as BusinessMemberRoleInfo[];
}

export function FormatEventPartyInfo(category: EventParty): EventPartyInfo {
  return {
    id: category.id.toString(),
    name: category.name,
  } as unknown as EventPartyInfo;
}

export function FormatSubscriptionPlanInfo(
  plan: SubscriptionPlan,
  features: SubscriptionPlanFeature[],
): SubscriptionPlanInfo {
  return {
    name: plan.name,
    id: plan.id,
    position: plan.position,
    priceNGN: plan.priceNGN,
    priceUSD: plan.priceUSD,
    interval: plan.interval,
    description: plan.description,
    isRecommended: plan.isRecommended,
    originalPriceNGN: plan.originalPriceNGN,
    originalPriceUSD: plan.originalPriceUSD,
    features: features.map(
      (feature) => feature.title,
    ) as unknown as SubscriptionPlanFeatureInfo[],
  } as unknown as SubscriptionPlanInfo;
}

export function FormatPaystackChargeResponse(
  response: any,
  amount: number,
): ChargeResponse {
  return {
    status: response.status,
    message: response.message,
    data: {
      reference: response.data.reference,
      status: response.data.status,
      amount: amount,
      display_text: response.data.display_text,
      account_name: response.data.account_name,
      account_number: response.data.account_number,
      bank: {
        slug: response.data.bank.slug,
        name: response.data.bank.name,
        id: response.data.bank.id,
      },
      account_expires_at: response.data.account_expires_at,
    },
  } as ChargeResponse;
}

export function FormatInvitationChargeResponse(
  response: any,
  amount: number,
  emailCharge: number,
  whatsAppCharge: number,
  discount: number,
  emailDiscount: number,
  whatsAppDiscount: number,
): InvitationChargeResponse {
  return {
    status: response.status,
    message: response.message,
    data: {
      reference: response.data.reference,
      status: response.data.status,
      amount: amount,
      display_text: response.data.display_text,
      account_name: response.data.account_name,
      account_number: response.data.account_number,
      bank: {
        slug: response.data.bank.slug,
        name: response.data.bank.name,
        id: response.data.bank.id,
      },
      account_expires_at: response.data.account_expires_at,
    } as ChargeResponseData,
    emailCharge: emailCharge,
    whatsAppCharge: whatsAppCharge,
    discount: discount,
    emailDiscount,
    whatsAppDiscount
  } as InvitationChargeResponse;
}

export function FormatSubscriptionInfo(
  subscription: Subscription,
): SubscriptionInfo {
  return {
    id: subscription.id.toString(),
    plan: subscription.plan.name,
    planId: subscription.plan.id,
    status: subscription.status,
    subscriptionDate: subscription.subscriptionDate,
    expirationDate: subscription.expirationDate,
    guestLimit: subscription.guestLimit,
    guestLimitStatus: subscription.guestLimitStatus,
    eventLimit: subscription.eventLimit,
    eventLimitStatus: subscription.eventLimitStatus,
    reusableMessageTemplates: subscription.reusableMessageTemplates,
    invitationCoverImage: subscription.invitationCoverImage,
    guestActivityTimeline: subscription.guestActivityTimeline,
    advancedGuestActivityTimeline: subscription.advancedGuestActivityTimeline,
    followupMessages: subscription.followupMessages,
    manageTeamMembers: subscription.manageTeamMembers,
    secureGuestDataAccess: subscription.secureGuestDataAccess,
    flexibleDataExport: subscription.flexibleDataExport,
    isExpired: subscription.isExpired,
  } as unknown as SubscriptionInfo;
}

export function FormatGuestTimelineInfo(
  timeline: GuestTimeline,
): GuestTimelineInfo {
  return {
    id: timeline.id.toString(),
    action: timeline.action,
    description: timeline.description,
    time: formatTo12HourTime(timeline.createdAt),
    date: formatToCustomDate(timeline.createdAt),
  } as unknown as GuestTimelineInfo;
}

export function FormatEventGuestIdInfo(guest: Guest): EventGuestIdInfo {
  return {
    guestId: Number(guest.id.toString()),
    party: guest.party,
  } as unknown as EventGuestIdInfo;
}

export function FormatGuestTimelineActionEnumInfo(
  values: GuestTimelineActionEnum[],
): GuestTimelineActionEnumInfo[] {
  return values.map((value) => {
    switch (value) {
      case GuestTimelineActionEnum.EDIT_EMAIL:
        return {
          value: value,
          title: 'Edit email',
        };
      case GuestTimelineActionEnum.EDIT_PHONE:
        return {
          value: value,
          title: 'Edit phone',
        };
      case GuestTimelineActionEnum.EDIT_NAME:
        return {
          value: value,
          title: 'Edit name',
        };
      case GuestTimelineActionEnum.SENT_FOLLOWUP_MESSAGE:
        return {
          value: value,
          title: 'Sent follow-up message',
        };
      case GuestTimelineActionEnum.GUEST_ACCEPTED_INVITE:
        return {
          value: value,
          title: 'Guest accepted invite',
        };
      case GuestTimelineActionEnum.GUEST_REJECTED_INVITE:
        return {
          value: value,
          title: 'Guest rejected invite',
        };
      case GuestTimelineActionEnum.GUEST_OPENED_MESSAGE:
        return {
          value: value,
          title: 'Guest opened message',
        };
      case GuestTimelineActionEnum.EMAIL_DELIVERY_FAILED:
        return {
          value: value,
          title: 'Email delivery failed',
        };
      case GuestTimelineActionEnum.EMAIL_DELIVERED:
        return {
          value: value,
          title: 'Email delivered',
        };
      case GuestTimelineActionEnum.WHATSAPP_DELIVERY_FAILED:
        return {
          value: value,
          title: 'WhatsApp delivery failed',
        };
      case GuestTimelineActionEnum.WHATSAPP_DELIVERED:
        return {
          value: value,
          title: 'WhatsApp delivered',
        };
      case GuestTimelineActionEnum.SENT_INVITE_MESSAGE:
        return {
          value: value,
          title: 'Sent invite message',
        };
      case GuestTimelineActionEnum.GUEST_ADDED_BY_USER:
        return {
          value: value,
          title: 'Guest added by user',
        };
      case GuestTimelineActionEnum.GUEST_ADDED_VIA_FORM:
        return {
          value: value,
          title: 'Guest added via form',
        };
    }
  });
}

export default {
  FormatGuestInfo,
  FormatEventInfo,
  FormatAccountInfo,
  FormatNotification,
  FormatBusinessInfo,
  FormatEventPartyInfo,
  FormatGuestPartyInfo,
  FormatSubscriptionInfo,
  FormatEventGuestIdInfo,
  FormatGuestTimelineInfo,
  FormatEventCategoryInfo,
  FormatBusinessMemberInfo,
  FormatMessageTemplateInfo,
  FormatSubscriptionPlanInfo,
  FormatPaystackChargeResponse,
  FormatBusinessMemberRoleInfo,
  FormatMessageTemplateEnumInfo,
  FormatInvitationChargeResponse,
  FormatGuestTimelineActionEnumInfo,
  FormatMessageFollowupIntervalInfo,
  FormatMessageFollowupConditionInfo,
};
