// Simple translation helper using LibreTranslate public endpoint
// You can host your own instance or swap to a paid provider later

export type LocaleCode =
  | 'en' | 'hi' | 'mr' | 'bn' | 'pa' | 'ta' | 'te' | 'gu' | 'kn' | 'ml' | 'or' | 'as'

export const LANGUAGE_LABELS: Record<LocaleCode, string> = {
  en: 'English',
  hi: 'हिंदी',
  mr: 'मराठी',
  bn: 'বাংলা',
  pa: 'ਪੰਜਾਬੀ',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  gu: 'ગુજરાતી',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
  or: 'ଓଡିଆ',
  as: 'অসমীয়া',
}

// Map UI language to Web Speech API locales where possible
export const SPEECH_LOCALES: Partial<Record<LocaleCode, string>> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  pa: 'pa-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  or: 'or-IN',
  as: 'as-IN',
}

const DEFAULT_ENDPOINT = 'https://libretranslate.com/translate'

export async function translateText(text: string, target: LocaleCode, source: LocaleCode | 'auto' = 'auto', endpoint = DEFAULT_ENDPOINT): Promise<string> {
  if (!text.trim()) return text
  if (target === source) return text
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source, target, format: 'text' })
    })
    if (!res.ok) throw new Error('Translate failed')
    const data = await res.json()
    return data?.translatedText || text
  } catch {
    return text // graceful fallback
  }
}


