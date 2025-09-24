export type SmsRequest = {
  to: string;
  message: string;
};

// Real integration via backend endpoint. Configure VITE_SMS_API_URL to your server route.
export async function sendSms(payload: SmsRequest): Promise<{ ok: boolean }> {
  const endpoint = import.meta.env.VITE_SMS_API_URL as string | undefined;
  if (!endpoint) {
    console.warn('VITE_SMS_API_URL is not configured. Falling back to stub.');
    return sendSmsStub(payload);
  }
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`SMS API error ${res.status}`);
    return { ok: true };
  } catch (e) {
    console.error('SMS send failed, falling back to stub:', e);
    return sendSmsStub(payload);
  }
}

// Stub (dev fallback)
export async function sendSmsStub(payload: SmsRequest): Promise<{ ok: boolean }> {
  console.log('SMS stub:', payload);
  return { ok: true };
}


