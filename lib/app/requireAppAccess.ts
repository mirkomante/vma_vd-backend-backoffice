import { redirect } from 'next/navigation'

import { canAccessSection } from '@/lib/auth/canAccessSection'
import { loginFailureRedirectPath } from '@/lib/auth/loginMessages'
import type { AppSection } from '@/lib/auth/roles'
import { canAccessAppArea } from '@/lib/auth/userAccess'

import type { AppSessionUser } from './getAppSessionUser'
import { getAppSessionUser } from './getAppSessionUser'

export async function requireAppAccess(): Promise<AppSessionUser> {
  const user = await getAppSessionUser()
  if (!user) {
    redirect('/app/login')
  }
  if (!canAccessAppArea(user)) {
    redirect(loginFailureRedirectPath('/app/login'))
  }
  return user
}

export function requireAppSection(user: AppSessionUser, section: AppSection): void {
  if (!canAccessSection(user, section)) {
    redirect('/app')
  }
}
