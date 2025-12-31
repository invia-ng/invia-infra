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
  WEDDING = 'WEDDING',
  PARTY = 'PARTY',
  CORPORATE = 'CORPORATE',
  OTHERS = 'OTHERS',
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
