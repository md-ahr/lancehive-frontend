import type { LoginResponse, MeResponse } from '@/features/Auth/types'
import type { UserRole } from '@/types/api'

const timestamps = {
  created_at: '2026-01-15T10:00:00+00:00',
  updated_at: '2026-01-15T10:00:00+00:00',
}

export function makeLoginResponse(role: UserRole): LoginResponse {
  return {
    token: 'test-token',
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role,
      email_verified_at: null,
      ...timestamps,
    },
  }
}

export function makeMeResponse(role: UserRole): MeResponse {
  const user = makeLoginResponse(role).user

  if (role === 'super_admin') {
    return {
      user,
      user_settings: { timezone: 'UTC', locale: 'en' },
      memberships: [],
      active_freelancer: null,
      subscription: null,
      client_memberships: [],
      active_client: null,
    }
  }

  if (role === 'client') {
    const activeClient = {
      id: 10,
      name: 'Acme Corp',
      slug: 'acme-corp',
      status: 'active',
      ...timestamps,
    }

    return {
      user,
      user_settings: { timezone: 'UTC', locale: 'en' },
      memberships: [],
      active_freelancer: null,
      subscription: null,
      client_memberships: [
        {
          id: 1,
          client_id: 10,
          user_id: user.id,
          role: 'primary',
          client: activeClient,
          created_at: timestamps.created_at,
          updated_at: timestamps.updated_at,
        },
      ],
      active_client: activeClient,
    }
  }

  return {
    user,
    user_settings: { timezone: 'UTC', locale: 'en' },
    memberships: [
      {
        id: 1,
        freelancer_id: 42,
        user_id: user.id,
        role: 'owner',
        freelancer: {
          id: 42,
          name: 'Jane Studio',
          slug: 'jane-studio',
          status: 'active',
          owner_user_id: user.id,
          ...timestamps,
        },
        created_at: timestamps.created_at,
        updated_at: timestamps.updated_at,
      },
    ],
    active_freelancer: {
      id: 42,
      name: 'Jane Studio',
      slug: 'jane-studio',
      status: 'active',
      owner_user_id: user.id,
      ...timestamps,
    },
    subscription: {
      status: 'trialing',
      plan_name: 'Starter',
      read_only: false,
      trial_ends_at: '2026-02-15T10:00:00+00:00',
    },
    client_memberships: [],
    active_client: null,
  }
}

export function makeMultiMembershipMeResponse(): MeResponse {
  const base = makeMeResponse('freelancer')

  return {
    ...base,
    memberships: [
      ...base.memberships,
      {
        id: 2,
        freelancer_id: 99,
        user_id: base.user.id,
        role: 'admin',
        freelancer: {
          id: 99,
          name: 'Second Studio',
          slug: 'second-studio',
          status: 'active',
          owner_user_id: base.user.id,
          ...timestamps,
        },
        created_at: timestamps.created_at,
        updated_at: timestamps.updated_at,
      },
    ],
  }
}

export function makeReadOnlyMeResponse(): MeResponse {
  const base = makeMeResponse('freelancer')

  return {
    ...base,
    subscription: {
      status: 'read_only',
      plan_name: 'Starter',
      read_only: true,
      trial_ends_at: null,
    },
  }
}

export function makeMultiClientMembershipMeResponse(): MeResponse {
  const base = makeMeResponse('client')
  const secondClient = {
    id: 20,
    name: 'Beta Inc',
    slug: 'beta-inc',
    status: 'active',
    ...timestamps,
  }

  return {
    ...base,
    client_memberships: [
      ...base.client_memberships,
      {
        id: 2,
        client_id: 20,
        user_id: base.user.id,
        role: 'member',
        client: secondClient,
        created_at: timestamps.created_at,
        updated_at: timestamps.updated_at,
      },
    ],
  }
}

export function makeMemberRoleMeResponse(): MeResponse {
  const base = makeMeResponse('freelancer')

  return {
    ...base,
    memberships: [
      {
        ...base.memberships[0],
        role: 'member',
      },
    ],
  }
}
