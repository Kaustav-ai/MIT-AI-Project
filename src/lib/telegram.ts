export type TelegramNotifyPayload = {
  chatId: string;
  text: string;
};

// Frontend helper that posts to your backend proxy for Telegram Bot API
// Backend should call: https://api.telegram.org/bot<token>/sendMessage
export async function sendTelegramMessage(payload: TelegramNotifyPayload): Promise<{ ok: boolean }> {
  const endpoint = import.meta.env.VITE_TELEGRAM_API_URL as string | undefined;
  if (!endpoint) {
    console.warn('VITE_TELEGRAM_API_URL is not configured');
    return { ok: false };
  }
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(String(res.status));
    return { ok: true };
  } catch (e) {
    console.error('Telegram send failed:', e);
    return { ok: false };
  }
}


