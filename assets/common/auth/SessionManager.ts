import * as i18n from "i18n/runtime-scripts/LanguageData";

export interface Session {
    username: string;
    language: string;
    ss: string;
    time: Date;
    isAuthenticated: boolean;
}

const sessionIdStorageName = "scss";

export function getSessionKey() {
    if (window.location && window.location.hostname) {
        return `${window.location.hostname}.${sessionIdStorageName}`;
    }

    return sessionIdStorageName;
}

export function removeSession() {
    cc.sys.localStorage.removeItem(getSessionKey());
}

export function getSession(): Session {
    return JSON.parse(cc.sys.localStorage.getItem(getSessionKey()));
}

export function storeSessionData(data) {
    updateLanguage(data);
    cc.sys.localStorage.setItem(getSessionKey(), JSON.stringify(data));
}

export function getLanguage(locale) {
    const dict = {
        "vi-VN": "vi",
        "en-US": "en",
        "en-UK": "en"
    };
    return dict[locale] || "en";
}

export function getLocale() {
    const data = getSession();
    return data.language;
}

export function updateLanguage(data) {
    const locale = data.language;
    const language = getLanguage(locale);
    console.log(`i18n init language ${data.language} => ${language}`);
    setLanguage(language);
}

export function setLanguage(language: string) {
    i18n.init(language);
    cc.sys.localStorage.setItem(`current_language`, language);
}

export function getCacheLanguage(): string {
    return cc.sys.localStorage.getItem(`current_language`) || "vi";
}

export function getInRoomGameIdKey() {
    const session = getSession();

    return session ? `${session.ss}_inroomgame` : "";
}

export function storeInRoomGameId(gameId) {
    cc.sys.localStorage.setItem(getInRoomGameIdKey(), gameId);
}

export function getInRoomGameId() {
    return cc.sys.localStorage.getItem(getInRoomGameIdKey());
}

export function removeInRoomGameId() {
    cc.sys.localStorage.removeItem(getInRoomGameIdKey());
}

declare global {
    export interface Window {
        authData: Session;
        openGameId: string;
    }
}
