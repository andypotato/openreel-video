import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import common from "./locales/en/common.json";
import editor from "./locales/en/editor.json";
import settings from "./locales/en/settings.json";
import welcome from "./locales/en/welcome.json";
import commonZhTw from "./locales/zh-TW/common.json";
import editorZhTw from "./locales/zh-TW/editor.json";
import settingsZhTw from "./locales/zh-TW/settings.json";
import welcomeZhTw from "./locales/zh-TW/welcome.json";
import { useSettingsStore, type AppLanguage } from "./stores/settings-store";

const DEFAULT_LANGUAGE: AppLanguage = "en";
const STORAGE_KEY = "openreel-settings";

function getStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_LANGUAGE;
    }

    const parsed = JSON.parse(raw) as { state?: { language?: unknown } };
    return parsed.state?.language === "zh-TW" ? "zh-TW" : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

const resources = {
  en: {
    common,
    editor,
    settings,
    welcome,
  },
  "zh-TW": {
    common: commonZhTw,
    editor: editorZhTw,
    settings: settingsZhTw,
    welcome: welcomeZhTw,
  },
} as const;

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: getStoredLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    ns: ["common", "editor", "settings", "welcome"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
  });

  useSettingsStore.subscribe((state) => state.language, (language) => {
    if (i18n.resolvedLanguage !== language) {
      void i18n.changeLanguage(language);
    }
  });
}

export default i18n;
