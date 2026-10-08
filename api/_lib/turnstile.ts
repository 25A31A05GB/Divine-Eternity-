/**
 * Server-side Cloudflare Turnstile Verification Helper
 */
export async function verifyTurnstileToken(token: string | undefined | null, remoteIp?: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  // If no Turnstile secret key configured in environment, permit in development/test
  if (!secretKey || !secretKey.trim()) {
    return true;
  }

  if (!token || !token.trim()) {
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey.trim());
    formData.append('response', token.trim());
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.success);
  } catch (err) {
    console.warn('Turnstile verification network error:', err);
    return false;
  }
}
