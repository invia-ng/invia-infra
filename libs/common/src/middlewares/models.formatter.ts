import {Account, AccountInfo} from "../models/account.model";
import { Business, BusinessInfo } from "../models/business.model";
import { Notification, NotificationInfo } from "../models/notification.model";

export function FormatAccountInfo(
    account: Account,
): AccountInfo {
    return {
      id: account.id.toString(),
      name: account.name,
      firstName: account.firstName,
      lastName: account.lastName,
      phoneNumber: account.phoneNumber,
      businessName: account.businessName,
      email: account.email,
      avatar: account.avatar,
      role: account.role,
      status: account.status,
      isAccountDisabled: account.isAccountDisabled,
      businessAvatar: account.businessAvatar,
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

export default {
    FormatAccountInfo,
    FormatNotification,
    FormatBusinessInfo,
};
