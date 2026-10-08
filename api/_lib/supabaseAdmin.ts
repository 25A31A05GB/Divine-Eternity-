import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseAdminConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    serviceRoleKey &&
    supabaseUrl.startsWith('https://') &&
    serviceRoleKey.length > 20
  );
};

export const supabaseAdmin = isSupabaseAdminConfigured()
  ? createClient(supabaseUrl as string, serviceRoleKey as string, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : (null as any);

export async function verifyUserToken(authHeader: string | undefined) {
  if (!authHeader || !authHeader.startsWith('Bearer ') || !supabaseAdmin) {
    return { user: null, role: 'anonymous' };
  }
  const token = authHeader.replace('Bearer ', '').trim();
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      return { user: null, role: 'anonymous' };
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    return {
      user,
      role: profile?.role || 'customer',
    };
  } catch (e) {
    return { user: null, role: 'anonymous' };
  }
}
