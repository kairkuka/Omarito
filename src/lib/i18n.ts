import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en.json'
import kk from '../locales/kk.json'
import ru from '../locales/ru.json'

export type InterfaceLocale = 'en' | 'ru' | 'kk'

const STORAGE_KEY = 'omalingo.interface-locale'
const supportedLocales: InterfaceLocale[] = ['en', 'ru', 'kk']

export const interfaceLocaleOptions: Array<{ code: InterfaceLocale; short: string; labelKey: string }> = [
  { code: 'en', short: 'EN', labelKey: 'locale.english' },
  { code: 'ru', short: 'RU', labelKey: 'locale.russian' },
  { code: 'kk', short: 'KZ', labelKey: 'locale.kazakh' },
]

export function normalizeInterfaceLocale(value?: string | null): InterfaceLocale {
  const language = value?.toLowerCase().split('-')[0]
  return supportedLocales.includes(language as InterfaceLocale) ? language as InterfaceLocale : 'en'
}

function initialLocale(): InterfaceLocale {
  if (import.meta.env.DEV) {
    const params = new URLSearchParams(window.location.search)
    if (params.has('design-review') && params.has('locale')) return normalizeInterfaceLocale(params.get('locale'))
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) return normalizeInterfaceLocale(stored)
  } catch {
    // Storage can be unavailable in private browsing. Device locale remains a safe fallback.
  }
  return normalizeInterfaceLocale(window.navigator.language)
}

export async function initializeI18n(): Promise<void> {
  if (i18n.isInitialized) return
  const locale = initialLocale()
  await i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        ru: { translation: ru },
        kk: { translation: kk },
      },
      lng: locale,
      fallbackLng: 'en',
      supportedLngs: supportedLocales,
      load: 'languageOnly',
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    })
  document.documentElement.lang = locale
}

export async function changeInterfaceLocale(locale: InterfaceLocale): Promise<void> {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // The active session still changes language even when persistence is unavailable.
  }
  document.documentElement.lang = locale
  await i18n.changeLanguage(locale)
}

export default i18n
