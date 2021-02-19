import { appContainer } from "../../Application";
import * as configs from "../../configs/Configs";
import SocketIOController from "../../SocketIOController";
import httpHelper from "../helpers/httpHelper";
import { buildServerUrl } from "../helpers/UrlHelper";
import logger from "../logger";

const sentryLogger = logger();

const sessionIdStorageName = "scss";
const sessionExpiredTimeoutMinutes = 19.8;

export function preChecking(cb) {
    const settingUrl = buildServerUrl(configs.ssl, "http", "/api/settings");

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("isUM") && urlParams.get("isUM") === "true") {
        window.umInfo = {
            isUM: true,
            startTime: new Date(),
            endTime: new Date()
        };
        cc.director.loadScene("um");
        return;
    }

    if (urlParams.has("isTimeout") && urlParams.get("isTimeout") === "true") {
        cc.director.loadScene("sessiontimeout");
        return;
    }

    httpHelper.get(
        settingUrl,
        function (settingResponse) {
            try {
                window.siteSettings = settingResponse;
                if (settingResponse && settingResponse.umInfo && settingResponse.umInfo.isUM) {
                    window.umInfo = settingResponse.umInfo;
                    cc.director.loadScene("um");

                    return settingResponse;
                }

                const isSessionExpired = checkAndUpdateRecheckIn(urlParams.has("token"));
                if (isSessionExpired && !urlParams.has("token")) {
                    cc.director.loadScene("sessiontimeout");

                    return settingResponse;
                }
            } catch (ex) {
                sentryLogger.logError(ex);
            }

            cb();

            return void 0;
        },
        true
    );
}

export function checkSSO(labelMessage, onSuccessFunc) {
    let isSuccess = false;
    const urlParams = new URLSearchParams(window.location.search);
    const authData = getSession();

    if (urlParams.has("token")) {
        const url = buildServerUrl(configs.ssl, "http", `/authenticate?token=${urlParams.get("token")}`);

        try {
            httpHelper.get(url, function (response) {
                if (response.isAuthenticated) {
                    window.authData = response;
                    sentryLogger.setUser(response);
                    window.authData.time = new Date();
                    response.isSSO = true;
                    window.openGameId = urlParams.get("gameId");
                    storeSessionData(response);
                    clearTokenOnUrl();
                    onSuccessFunc();
                } else {
                    labelMessage.string = "Đăng nhập thất bại, bạn hãy làm lại thao tác đăng nhập từ đầu.";
                }
            });
        } catch (error) {
            labelMessage.string = "Đăng nhập lỗi.";
            sentryLogger.logError(error);
        }

        isSuccess = true;
    } else if (authData && authData.isAuthenticated && authData.ss) {
        isSuccess = true;
        window.authData = authData;
        sentryLogger.setUser(authData);
        onSuccessFunc();
    }

    return isSuccess;
}

export function clearTokenOnUrl() {
    try {
        history.pushState(null, "", location.href.split("?")[0]);
    } catch (ex) {
        console.log(ex);
    }
}

export function getSessionKey() {
    if (window.location && window.location.hostname) {
        return `${window.location.hostname}.${sessionIdStorageName}`;
    }

    return sessionIdStorageName;
}

export function signOut() {
    cc.director.loadScene("sessiontimeout");
    cc.sys.localStorage.removeItem(getSessionKey());
}

export function removeSession() {
    cc.sys.localStorage.removeItem(getSessionKey());
}

export function getSession() {
    return JSON.parse(cc.sys.localStorage.getItem(getSessionKey()));
}

export function isSSO() {
    const session = getSession();
    return session && session.isSSO;
}

export function storeSessionData(data) {
    cc.sys.localStorage.setItem(getSessionKey(), JSON.stringify(data));
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

let autoTriggerSignInTimeout = null;

export function triggerSignIn() {
    if (!!window.authData) {
        if (autoTriggerSignInTimeout) {
            clearTimeout(autoTriggerSignInTimeout);
        }

        autoTriggerSignInTimeout = setTimeout(() => {
            auth({
                authentication: {
                    username: window.authData.username,
                    data: window.authData
                }
            });
        }, 500);
    }
}

function auth(obj) {
    if (cc.RedT._socket == null || cc.RedT._socket.readyState !== 1) {
        setTimeout(function () {
            cc.RedT.send(obj);
        }, 300);
    } else {
        cc.RedT.send(obj);
    }
}

export function checkAndUpdateRecheckIn(dontClearSession) {
    const session = getSession();
    let isSessionExpired = true;
    const socketIOController = appContainer.get(SocketIOController);

    try {
        if (session && session.time) {
            const now = new Date();
            const lastRecheckIn = new Date(session.time);
            const differenceInMinutes = Math.abs(now - lastRecheckIn) / (1000 * 60);

            if (differenceInMinutes > sessionExpiredTimeoutMinutes && !dontClearSession) {
                signOut();
            } else {
                session.time = new Date();
                isSessionExpired = false;
                storeSessionData(session);
                socketIOController.recheckin();
            }
        } else {
            !dontClearSession && signOut();
        }
    } catch (ex) {
        sentryLogger.logError(ex);
    }

    return isSessionExpired;
}
