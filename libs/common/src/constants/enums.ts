export enum MediaUploadType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  PDF = 'PDF',
}

export enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  ABANDONED = 'ABANDONED',
}

export enum PaymentGateway {
  PAYSTACK = 'PAYSTACK',
  GOOGLEPAY = 'GOOGLEPAY',
  APPLEPAY = 'APPLEPAY',
  BUYPOWER = 'BUYPOWER',
}

export enum NotificationType {
  MESSAGE = 'MESSAGE',
  PRODUCT = 'PRODUCT',
}

export enum EventCategoryEnum {
  ALL = 'ALL',
  WEDDING = 'WEDDING',
  PARTY = 'PARTY',
  CORPORATE = 'CORPORATE',
  OTHERS = 'OTHERS',
}

export enum MessageTemplateEnum {
  GUEST_NAME = 'guest_name',
  EVENT_NAME = 'event_name',
  EVENT_DATE = 'event_date',
  EVENT_TIME = 'event_time',
  EVENT_LOCATION = 'event_location',
  GUEST_PARTY = 'guest_party',
}

export enum FollowupConditionEnum {
  NO_RSVP = 'NO_RSVP',
}

export enum FollowupIntervalEnum {
  TWO_DAYS = '2_DAYS',
  THREE_DAYS = '3_DAYS',
  FOUR_DAYS = '4_DAYS',
  FIVE_DAYS = '5_DAYS',
  ONE_WEEK = '1_WEEK',
}

export enum GuestPartyEnum {
  GROOM = 'GROOM',
  BRIDE = 'BRIDE',
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

export enum UserActivityEnum {
  LOGIN = 'LOGIN',
}

export enum AccountStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SHADOW_BANNED = 'shadow_banned',
  DISABLED = 'disabled',
}

export enum OptimizedImageType {
  thumbnail = 'thumbnail',
  logo = 'logo',
  productImage = 'product-image',
  coverImage = 'cover-image',
  medium = 'medium',
  large = 'large',
}
