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

export enum PremiumSubscriptionPlanEnum {
  ONE_MONTH = 'ONE_MONTH',
  THREE_MONTHS = 'THREE_MONTHS',
  SIX_MONTHS = 'SIX_MONTHS',
  ONE_YEAR = 'ONE_YEAR',
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
