// ============================================================
// OpsPulse — Auth Utility
// CHANGE 2 & 3: Centralized role storage and session management
// Used by: signup page (set role), sidebar (sign out), login (read role)
// ============================================================

export type UserRole = 'business_owner' | 'operations_manager';

const ROLE_KEY = 'ops_userRole';
const BIZ_NAME_KEY = 'ops_bizName';

/**
 * CHANGE 2: Stores the user's selected role after registration.
 * @param role - Either 'business_owner' or 'operations_manager'
 */
export function setUserRole(role: UserRole): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(ROLE_KEY, role);
  }
}

/**
 * CHANGE 2: Retrieves the stored user role.
 * Returns null if no role is stored (user not authenticated).
 */
export function getUserRole(): UserRole | null {
  if (typeof window !== 'undefined') {
    const val = sessionStorage.getItem(ROLE_KEY);
    if (val === 'business_owner' || val === 'operations_manager') {
      return val;
    }
  }
  return null;
}

/**
 * Returns a human-readable label for the stored role.
 */
export function getRoleLabel(): string {
  const role = getUserRole();
  if (role === 'business_owner') return 'Business Owner';
  if (role === 'operations_manager') return 'Operations Manager';
  return 'Owner';
}

/**
 * CHANGE 3: Clears ALL session/auth state — used on sign out.
 * Removes all ops_* keys from sessionStorage so the user is
 * fully de-authenticated before redirect to /auth/login.
 */
export function signOut(): void {
  if (typeof window !== 'undefined') {
    // Remove all OpsPulse session keys
    sessionStorage.removeItem(ROLE_KEY);
    sessionStorage.removeItem(BIZ_NAME_KEY);
    // Remove any additional ops_ keys dynamically
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('ops_')) keysToRemove.push(key);
    }
    keysToRemove.forEach((k) => sessionStorage.removeItem(k));
  }
}
