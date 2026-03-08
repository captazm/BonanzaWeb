import { translations } from './data/translations.js';

const STORAGE_KEY = 'bonanza_lang';

export function getLang() {
    try {
        return localStorage.getItem(STORAGE_KEY) || 'en';
    } catch {
        return 'en';
    }
}

export function setLang(lang) {
    try {
        localStorage.setItem(STORAGE_KEY, lang);
        document.documentElement.setAttribute('lang', lang);
    } catch {
        // silently fail in SSR or restricted environments
    }
}

export function t(key) {
    const lang = getLang();
    return translations[lang]?.[key] || translations['en']?.[key] || key;
}
