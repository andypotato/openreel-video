import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import common from "./locales/en/common.json";
import editor from "./locales/en/editor.json";
import inspector from "./locales/en/inspector.json";
import settings from "./locales/en/settings.json";
import commonZhTw from "./locales/zh-TW/common.json";
import editorZhTw from "./locales/zh-TW/editor.json";
import inspectorZhTw from "./locales/zh-TW/inspector.json";
import settingsZhTw from "./locales/zh-TW/settings.json";

const DEFAULT_LANGUAGE = "en" as const;
const STORAGE_KEY = "openreel-settings";

function getStoredLanguage(): "en" | "zh-TW" {
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
    inspector,
    settings,
  },
  "zh-TW": {
    common: commonZhTw,
    editor: editorZhTw,
    inspector: inspectorZhTw,
    settings: settingsZhTw,
  },
} as const;

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: getStoredLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    ns: ["common", "editor", "inspector", "settings"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
  });

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEY) {
        void i18n.changeLanguage(getStoredLanguage());
      }
    });
  }
}

export default i18n;
