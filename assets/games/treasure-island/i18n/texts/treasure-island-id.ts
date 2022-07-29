import { reloadLanguageData } from "../../../../common/i18n/CustomLanguageData";
import { phrases } from "./treasure-island-en";

if (!window.i18n) window.i18n = {};
if (!window.i18n.languages) window.i18n.languages = {};
if (!window.i18n.languages.id) window.i18n.languages.id = {};

Object.assign(window.i18n.languages.id, phrases);
reloadLanguageData();
