import i18n from "i18n/runtime-scripts/LanguageData";

import logger from "../logger";
import NoticeUtil from "../utils/NoticeUtil";
import * as sessionManager from "./SessionManager";
import UserService from "./UserService";

const sentryLogger = logger();
const sessionExpiredTimeoutMinutes = 19.8;

export function checkSSO(labelMessage, onSuccessFunc) {
    const urlParams = new URLSearchParams(window.location.search);
    checkUMSSO(urlParams);
    checkTimeOut(urlParams);
    const session = sessionManager.getSession();
    checkSignOut(urlParams, session);
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
        return;
    }
}

function checkSignOut(urlParams, session) {
    const isSessionExpired = verifySession(session);
    if (isSessionExpired && !urlParams.has("token")) {
        signOut();
        return;
    }
}

function checkTimeOut(urlParams) {
    if (urlParams.has("isTimeout") && urlParams.get("isTimeout") === "true") {
        cc.director.loadScene("sessiontimeout");
        return;
    }
}

function checkHasToken(urlParams, session, onSuccessFunc) {
    if (urlParams.has("token")) {
        window.isSSO = true;
        UserService.getInstance()
            .auth.sso(urlParams.get("token"))
            .then((response) => {
                if (checkUM(response)) {
                    return;
                }

                if (response.isAuthenticated) {
                    window.authData = response;
                    sentryLogger.setUser(response);
                    window.authData.time = new Date();
                    window.openGameId = urlParams.get("gameId");
                    sessionManager.storeSessionData(response);
                    clearTokenOnUrl();
                    onSuccessFunc();
                } else {
                    labelMessage.string = i18n.t("ui.login_failed");
                }
            })
            .catch((error) => {
                labelMessage.string = i18n.t("ui.connection_lost");
                sentryLogger.logError(error);
            });
    } else if (session && session.isAuthenticated && session.ss) {
        window.authData = session;
        sessionManager.updateLanguage(session);
        sentryLogger.setUser(session);
        onSuccessFunc();
    }
}

export function clearTokenOnUrl() {
    try {
        history.pushState(null, "", location.href.split("?")[0]);
    } catch (ex) {
        console.log(ex);
    }
}

export function signOut() {
    cc.director.loadScene("sessiontimeout");
    sessionManager.removeSession();
}

function checkUM(response) {
    if (response && response.isUM) {
        window.umInfo = response.umInfo;
        cc.director.loadScene("um");
        return true;
    }

    return false;
}

export function triggerSignIn(main) {
    if (!!window.authData) {
        UserService.getInstance()
            .auth.authorize(window.authData.ss, window.authData.username)
            .then((response) => {
                if (checkUM(response)) {
                    return;
                }
                if (response.user) {
                    main.handleUserData(response.user);
                }
                main.serviceAuthorized(response.authorized);
            })
            .catch((e) => {
                sentryLogger.logError(e);
                const session = sessionManager.getSession();
                const isSessionExpired = verifySession(session);

                if (!isSessionExpired) {
                    main.loadLobbyMenuFromStorage();
                }
            });
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
        if (response.isDisableAccount) {
            handleDisableAccount();
        } else {
            const errorCode = response.apiError.errorCode;
            const message = NoticeUtil.getLocalizedErrorMessage(errorCode, { errorCode });
            const noticeData = { text: message };
            cc.RedT.inGame && cc.RedT.inGame.showNotice(noticeData);
        }
    } else {
        updateUserBalance(response.balance);
    }
}

function updateUserBalance(balance) {
    if (cc.RedT.user) {
        cc.RedT.user.red = balance;
        cc.RedT.inGame && cc.RedT.inGame.loadUserData(cc.RedT.user);
    }
}

function handleDisableAccount() {
    setTimeout(signOut, 10000);
    const noticeData = {
        text: i18n.t("messages.accountClosed")
    };
    cc.RedT.inGame && cc.RedT.inGame.showNotice(noticeData, signOut, signOut);
}
