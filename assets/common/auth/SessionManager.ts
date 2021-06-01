export interface Session {
    username: string;
    language: string;
    ss: string;
    time: Date;
    isAuthenticated: boolean;
}

const i18n = require("LanguageData");
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

function getLanguage(data) {
    let language = "";
    const locale = data.language;
    switch (locale) {
        case "vi-VN":
            language = "vi";
            break;
        default:
            language = "en";
            break;
    }
    return language;
}

export function getLocale() {
    const data = getSession();
    return data.language;
}

function updateLanguage(data) {
    const language = getLanguage(data);
    console.log(`i18n init language ${data.language} => ${language}`);
    i18n.init(language);
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
