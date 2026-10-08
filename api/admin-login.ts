import type { Request, Response } from 'express';
import { supabaseAdmin, isSupabaseAdminConfigured } from './_lib/supabaseAdmin';

export const ADMIN_CREDENTIALS = {
  email: 'admin@divineseternity.com',
  defaultPassword: process.env.ADMIN_PASSWORD || 'admin@123',
};

export async function adminLoginLogic(payload: { email?: string; password?: string }) {
  const cleanEmail = (payload.email || '').trim().toLowerCase();
  const cleanPass = (payload.password || '').trim();

  if (!cleanEmail || !cleanPass) {
    return { success: false, status: 400, message: 'Administrator email and password are required.' };
  }

  const isMasterAdminEmail = cleanEmail === ADMIN_CREDENTIALS.email || cleanEmail.endsWith('@divineseternity.com');
  const isMasterPasswordMatch = cleanPass === ADMIN_CREDENTIALS.defaultPassword;

  // If credentials don't match default master credentials and we don't have Supabase
  if (!isMasterAdminEmail && !isSupabaseAdminConfigured()) {
    return { success: false, status: 401, message: 'Invalid email or password.' };
  }

  // If master credentials match
  if (isMasterAdminEmail && isMasterPasswordMatch) {
    let supabaseUserId: string | null = null;

    // Synchronize or create user in Supabase Auth if configured on backend
    if (isSupabaseAdminConfigured() && supabaseAdmin) {
      try {
        const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
        const existing = usersData?.users?.find(
          (u: any) => u.email?.toLowerCase() === cleanEmail
        );

        if (existing) {
          supabaseUserId = existing.id;
          // Synchronize password and ensure email is confirmed
          await supabaseAdmin.auth.admin.updateUserById(existing.id, {
            password: cleanPass,
            email_confirm: true,
            user_metadata: { full_name: 'Store Administrator', role: 'admin' },
          });
        } else {
          // Create admin user in Supabase Auth with pre-confirmed email
          const { data: created } = await supabaseAdmin.auth.admin.createUser({
            email: cleanEmail,
            password: cleanPass,
            email_confirm: true,
            user_metadata: { full_name: 'Store Administrator', role: 'admin' },
          });
          if (created?.user) {
            supabaseUserId = created.user.id;
          }
        }

        if (supabaseUserId) {
          // Ensure profiles table has admin role
          await supabaseAdmin.from('profiles').upsert({
            id: supabaseUserId,
            email: cleanEmail,
            full_name: 'Store Administrator',
            role: 'admin',
          });
        }
      } catch (err) {
        console.warn('Supabase admin sync non-fatal warning:', err);
      }
    }

    return {
      success: true,
      status: 200,
      role: 'admin',
      user: {
        id: supabaseUserId || 'admin-master',
        email: cleanEmail,
        fullName: 'Store Administrator',
        role: 'admin',
      },
      message: 'Admin authentication successful.',
    };
  }

  // If credentials didn't match master password, check via Supabase Auth admin if available
  if (isSupabaseAdminConfigured() && supabaseAdmin) {
    try {
      const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
      const existing = usersData?.users?.find(
        (u: any) => u.email?.toLowerCase() === cleanEmail
      );

      if (existing) {
        // Verify role in profiles
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('role')
          .eq('id', existing.id)
          .maybeSingle();

        if (profile?.role === 'admin' || profile?.role === 'staff') {
          // Allow login if matching master password
          if (isMasterPasswordMatch) {
            await supabaseAdmin.auth.admin.updateUserById(existing.id, {
              password: cleanPass,
              email_confirm: true,
            });
            return {
              success: true,
              status: 200,
              role: profile.role,
              user: {
                id: existing.id,
                email: cleanEmail,
                fullName: 'Store Administrator',
                role: profile.role,
              },
            };
          }
        }
      }
    } catch (err) {
      console.warn('Supabase auth check error:', err);
    }
  }

  return { success: false, status: 401, message: 'Invalid email or password.' };
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const result = await adminLoginLogic(req.body);
    return res.status(result.status).json(result);
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Authentication error' });
  }
}
