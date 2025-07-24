// Clerk Webhook Event Type Definitions

export interface ClerkWebhookEvent {
  data: ClerkUser
  event_attributes: EventAttributes
  instance_id: string
  object: "event"
  timestamp: number
  type: string
}

export interface ClerkUser {
  backup_code_enabled: boolean
  banned: boolean
  create_organization_enabled: boolean
  created_at: number
  delete_self_enabled: boolean
  email_addresses: EmailAddress[]
  enterprise_accounts: any[] // Can be typed more specifically if needed
  external_accounts: ExternalAccount[]
  external_id: string | null
  first_name: string | null
  has_image: boolean
  id: string
  image_url: string
  last_active_at: number
  last_name: string | null
  last_sign_in_at: number | null
  legal_accepted_at: number | null
  locked: boolean
  lockout_expires_in_seconds: number | null
  mfa_disabled_at: number | null
  mfa_enabled_at: number | null
  object: "user"
  passkeys: any[] // Can be typed more specifically if needed
  password_enabled: boolean
  phone_numbers: any[] // Can be typed more specifically if needed
  primary_email_address_id: string | null
  primary_phone_number_id: string | null
  primary_web3_wallet_id: string | null
  private_metadata: Record<string, any>
  profile_image_url: string
  public_metadata: Record<string, any>
  saml_accounts: any[] // Can be typed more specifically if needed
  totp_enabled: boolean
  two_factor_enabled: boolean
  unsafe_metadata: Record<string, any>
  updated_at: number
  username: string | null
  verification_attempts_remaining: number
  web3_wallets: any[] // Can be typed more specifically if needed
}

export interface EmailAddress {
  created_at: number
  email_address: string
  id: string
  linked_to: LinkedIdentification[]
  matches_sso_connection: boolean
  object: "email_address"
  reserved: boolean
  updated_at: number
  verification: EmailVerification
}

export interface LinkedIdentification {
  id: string
  type: string
}

export interface EmailVerification {
  attempts: number | null
  expire_at: number | null
  object: string
  status: "verified" | "unverified" | "pending"
  strategy: string
}

export interface ExternalAccount {
  approved_scopes: string
  avatar_url: string
  created_at: number
  email_address: string
  external_account_id: string
  family_name: string
  first_name: string
  given_name: string
  google_id?: string // Specific to Google OAuth
  id: string
  identification_id: string
  image_url: string
  label: string | null
  last_name: string
  object: string // e.g., "google_account"
  picture: string
  provider: string // e.g., "oauth_google"
  provider_user_id: string
  public_metadata: Record<string, any>
  updated_at: number
  username: string | null
  verification: OAuthVerification
}

export interface OAuthVerification {
  attempts: number | null
  expire_at: number
  object: string
  status: "verified" | "unverified" | "pending"
  strategy: string
}

export interface EventAttributes {
  http_request: HttpRequest
}

export interface HttpRequest {
  client_ip: string
  user_agent: string
}

// Type guard to check if event is user.created
export function isUserCreatedEvent( event: ClerkWebhookEvent ): event is ClerkWebhookEvent & { type: "user.created" } {
  return event.type === "user.created"
}

// Type guard to check if event is user.updated
export function isUserUpdatedEvent( event: ClerkWebhookEvent ): event is ClerkWebhookEvent & { type: "user.updated" } {
  return event.type === "user.updated"
}

// Type guard to check if event is user.deleted
export function isUserDeletedEvent( event: ClerkWebhookEvent ): event is ClerkWebhookEvent & { type: "user.deleted" } {
  return event.type === "user.deleted"
}

// Union type for common webhook event types
export type ClerkWebhookEventType =
  | "user.created"
  | "user.updated"
  | "user.deleted"
  | "session.created"
  | "session.ended"
  | "session.removed"
  | "session.revoked"
  | "email.created"
  | "sms.created"
  | "organization.created"
  | "organization.updated"
  | "organization.deleted"
  | "organizationMembership.created"
  | "organizationMembership.updated"
  | "organizationMembership.deleted"
  | "organizationInvitation.accepted"
  | "organizationInvitation.created"
  | "organizationInvitation.revoked" 