import type { UserSettingsResource, WorkspaceSettingsResource } from '@/features/Settings/types'

export const defaultUserSettings: UserSettingsResource = {
  timezone: 'Asia/Dhaka',
  locale: 'en',
  notification_preferences: {
    subscription_alerts: true,
    workspace_invites: true,
    invoice_activity: true,
  },
}

export const defaultWorkspaceSettings: WorkspaceSettingsResource = {
  default_currency: 'BDT',
  invoice_number_prefix: 'INV',
  default_tax_rate: null,
  invoice_footer_notes: null,
  business_name: 'Jane Studio',
  business_email: 'billing@jane-studio.test',
  business_address: 'Dhaka, Bangladesh',
}
