import { i18n } from "../../ClientModules";

export function reloadLanguageData() {
    const data = window.i18n.languages[window.i18n.curLang] || {};

    i18n?.inst?.replace(data);
}
