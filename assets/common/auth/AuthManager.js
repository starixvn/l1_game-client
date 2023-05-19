import axios from "axios";
import i18n from "i18n/runtime-scripts/LanguageData";

import configs from "../../configs/Configs";
import { appManager } from "../../managers/AppManager";
import { uiManager } from "../../managers/GameUIManager";
import { InternalEvents } from "../../managers/InternalEvents";
import GameUtils from "../GameUtils";
import ChipConfig from "../bet-chips/view-models/ChipConfig";
import { isSessionTimeoutError } from "../helpers/ErrorCodeHelper";
import { buildUrlWithPath } from "../helpers/UrlHelper";
import logger from "../logger";
import { userManager } from "../user/UserManager";
import NoticeUtil from "../utils/NoticeUtil";
import NotificationService from "./NotificationService";
import * as SGConnectAPI from "./SGConnectAPI";
import * as sessionManager from "./SessionManager";
import UserService from "./UserService";

const sentryLogger = logger();
const sessionExpiredTimeoutMinutes = 19.8;

export const AppTypes = {
    SabaClub: 1,
    SabaApp: 5
};

export function getChipSetting() {
    const request = {
        session: window.authData.ss,
        username: window.authData.username,
        browserUserAgent: window.navigator.userAgent
    };
    const path = configs.env === "" ? "/user" : `/${configs.env}/user`;
    const userServiceUrl = buildUrlWithPath(path);
    axios.post(`${userServiceUrl}/settings`, request).then((response) => {
        if (response.data.chips) {
            ChipConfig.getInstance().setData(response.data.chips);
        }
    });
}

export function checkSSO(onSuccessFunc) {
    const urlParams = new URLSearchParams(window.location.search);
    if (checkUMSSO(urlParams) || checkTimeOut(urlParams)) {
        return;
    }
    const session = sessionManager.getSession();
    if (checkSignOut(urlParams, session)) {
        return;
    }

    checkHasToken(urlParams, session, onSuccessFunc);
}

function checkUMSSO(urlParams) {
    if (urlParams.has("isUM") && urlParams.get("isUM") === "true") {
        window.umInfo = {
            isUM: true,
            startTime: new Date(),
            endTime: new Date()
        };
        cc.director.loadScene("um");
        return true;
    }
    return false;
}

function checkSignOut(urlParams, session) {
    const isSessionExpired = verifySession(session);
    if (isSessionExpired && !(urlParams.has("token") || urlParams.has("params"))) {
        signOut();
        return true;
    }

    return false;
}

function checkTimeOut(urlParams) {
    if (urlParams.has("isTimeout") && urlParams.get("isTimeout") === "true") {
        redirectToTimeOutPage();
        return true;
    }

    return false;
}
function getAppType(urlParams) {
    return urlParams.get("appType") == AppTypes.SabaApp ? AppTypes.SabaApp : AppTypes.SabaClub;
}

function checkHasToken(urlParams, session, onSuccessFunc, messageComp) {
    if (urlParams.has("token")) {
        window.isSSO = true;
        window.appType = getAppType(urlParams);
        UserService.getInstance()
            .auth.sso(urlParams.get("token"), getAppType(urlParams))
            .then((response) => {
                if (checkUM(response)) {
                    return;
                }

                if (response.isAuthenticated) {
                    window.authData = response;
                    getChipSetting();
                    sentryLogger.setUser(response);
                    window.authData.time = new Date();
                    window.openGameId = urlParams.get("gameId");
                    sessionManager.storeSessionData(response);
                    clearQueryStringOnUrl();
                    onSuccessFunc();
                } else {
                    uiManager.emitter.emit(InternalEvents.SSO_FAILED);
                }
            })
            .catch((error) => {
                uiManager.emitter.emit(InternalEvents.SSO_ERROR);
                sentryLogger.logError(error);
            });
    } else {
        if (session && session.isAuthenticated && session.ss) {
            if (urlParams.has("params")) {
                authorizeFromMicrosite(urlParams, session);
                clearQueryStringOnUrl();
            }
            window.authData = session;
            getChipSetting();
            sessionManager.updateLanguage(session);
            sentryLogger.setUser(session);
            onSuccessFunc();
        }
    }
}

function authorizeFromMicrosite(urlParams, session) {
    const paramsQueryString = GameUtils.base64Decode(urlParams.get("params"));
    const urlSearchParams = new URLSearchParams(paramsQueryString);
    if (urlSearchParams.has("ss") && urlSearchParams.has("time") && session.ss === urlSearchParams.get("ss")) {
        session.time = new Date(+urlSearchParams.get("time"));
        sessionManager.storeSessionData(session);
    } else {
        signOut();
    }
}

export function clearQueryStringOnUrl() {
    try {
        history.pushState(null, "", location.href.split("?")[0]);
    } catch (ex) {
        console.log(ex);
    }
}

export function signOut() {
    redirectToTimeOutPage();
    sessionManager.removeSession();
}

function redirectToTimeOutPage() {
    if (window.authData?.system == AppTypes.SabaApp) {
        SGConnectAPI.redirectToAppTimeoutPage(sessionManager.getLocale());
    } else {
        cc.director.loadScene("sessiontimeout");
    }
}

export function checkUM(response) {
    if (response && response.isUM) {
        window.umInfo = response.umInfo;
        redirectToUMPage(response);
        return true;
    }

    return false;
}

export function redirectToUMPage(response) {
    if (window.authData?.system == AppTypes.SabaApp || response?.system === AppTypes.SabaApp || window.appType === AppTypes.SabaApp) {
        const operatorId = window.umInfo?.operatorId;
        SGConnectAPI.redirectToAppUMPage(operatorId, sessionManager.getLocale());
    } else {
        cc.director.loadScene("um");
    }
}

export function verifySession(session) {
    let isSessionExpired = true;

    try {
        if (session && session.time) {
            const now = new Date();
            const lastRecheckIn = new Date(session.time);
            const differenceInMinutes = Math.abs(now - lastRecheckIn) / (1000 * 60);

            if (differenceInMinutes <= sessionExpiredTimeoutMinutes) {
                isSessionExpired = false;
            }
        }
    } catch (ex) {
        sentryLogger.logError(ex);
    }

    return isSessionExpired;
}

export function reCheckIn() {
    try {
        const session = sessionManager.getSession();
        const isSessionExpired = verifySession(session);

        if (isSessionExpired) {
            signOut();
        } else {
            UserService.getInstance()
                .auth.reCheckIn(session.ss, session.username)
                .then((response) => {
                    if (response.isSuccessful) {
                        handleResponse(session, response);
                    } else {
                        signOut();
                    }
                })
                .catch((error) => sentryLogger.logError(error));
        }
    } catch (ex) {
        console.log(JSON.stringify(ex));
    }
}

function handleResponse(session, response) {
    session.time = new Date();
    sessionManager.storeSessionData(session);

    if (response.apiError) {
        const errorCode = response.apiError.errorCode.toString();
        if (response.isDisableAccount) {
            showMessageForAccountClosed(errorCode);
        } else if (isSessionTimeoutError(errorCode)) {
            showMessageForExpiredToken(errorCode);
        } else {
            const message = NoticeUtil.getLocalizedErrorMessage(errorCode, { errorCode });
            const noticeData = { text: message };
            appManager.currentScene?.showNotice(noticeData);
        }
    } else {
        updateUserBalance(response);
    }
}

function parseBalanceToRed(data) {
    if (data.balance) {
        data.red = data.balance;
    }
    return data;
}

export function updateUserBalance(data) {
    const parsedData = parseBalanceToRed(data);
    userManager.updateUser(parsedData);
}

export function showMessageForAccountClosed(errorCode) {
    const noticeData = {
        text: i18n.t("messages.accountClosed", { errorCode: errorCode })
    };
    showMessageAndAutoSignOut(noticeData);
}

export function showMessageForExpiredToken(errorCode) {
    let text = `${i18n.t("messages.sessionTimeout")} (${errorCode})`;

    if (window.authData?.system == AppTypes.SabaApp) {
        text = `${i18n.t("messages.sessionExpired")} (${errorCode})`;
    }
    const noticeData = {
        text
    };
    showMessageAndAutoSignOut(noticeData);
}

function showMessageAndAutoSignOut(noticeData) {
    setTimeout(signOut, 10000);
    appManager.currentScene?.showNotice(noticeData, signOut, signOut);
    NotificationService.getInstance().forceKickedOut();
}
