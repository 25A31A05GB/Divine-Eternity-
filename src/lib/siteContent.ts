import { supabase, isSupabaseConfigured } from './supabase';

export async function fetchSiteContent(): Promise<Record<string, any> | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('key, value');

    if (error || !data) {
      console.warn('fetchSiteContent error:', error?.message);
      return null;
    }

    const result: Record<string, any> = {};
    for (const row of data) {
      if (row.key) {
        result[row.key] = row.value;
      }
    }
    return result;
  } catch (err: any) {
    console.warn('fetchSiteContent exception:', err?.message);
    return null;
  }
}

export async function saveSiteContent(
  key: string,
  value: any
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { ok: false, error: 'Database service is not configured' };
  }
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) {
      return { ok: false, error: 'Not signed in as admin' };
    }

    const { error } = await supabase.from('site_content').upsert({
      key,
      value,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to save site content' };
  }
}
