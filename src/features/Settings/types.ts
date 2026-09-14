export type NotificationPreferences = {
  subscription_alerts: boolean
  workspace_invites: boolean
  invoice_activity: boolean
}

export type UserSettingsResource = {
  timezone: string
  locale: string
  notification_preferences: NotificationPreferences
}

export type WorkspaceSettingsResource = {
  default_currency: string
  invoice_number_prefix: string
  default_tax_rate: string | null
  invoice_footer_notes: string | null
  business_name: string | null
  business_email: string | null
  business_address: string | null
}

export type UpdateUserSettingsRequest = Partial<{
  timezone: string
  locale: string
  notification_preferences: Partial<NotificationPreferences>
}>

export type UpdateWorkspaceSettingsRequest = Partial<{
  default_currency: string
  invoice_number_prefix: string
  default_tax_rate: string | null
  invoice_footer_notes: string | null
  business_name: string | null
  business_email: string | null
  business_address: string | null
}>
