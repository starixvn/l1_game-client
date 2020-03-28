const httpHelper = require('httpHelper');
const configs = require('Configs');
const logger = require('./../logger')();
const sessionIdStorageName = 'scss';
const sessionExpiredTimeoutMunutes = 4.8;

function preChecking(cb, labelMessage) {
    const settingUrl = `${configs.gameServerUrl}api/settings`;
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("isUM") && urlParams.get("isUM") == 'true') {

        cc.director.loadScene("um");
        return;
    }

    httpHelper.get(settingUrl, function (settingResponse) {
        // redirectDomain: 'http://demo.com',
        //     disabledDirectLogin: appConfigs.disabledDirectLogin,
        //     um: redT.isUM
        if (settingResponse.um) {
            cc.director.loadScene("um");

            return settingResponse;
        }

        let isSessionExpired = checkAndUpdateRecheckIn();
        if (isSessionExpired && !urlParams.has("token") && settingResponse.disabledDirectLogin) {
            //labelMessage.string = "Đăng nhập thất bại, bạn hãy làm lại thao tác đăng nhập từ đầu.";
            abelMessage.string = "Phiên làm việc của bạn đã hết hạn, chúng tôi sẽ đưa bạn trở về trang chủ sau 10s";

            setTimeout(() => {
                window.location.href = settingResponse.redirectDomain;
            }, 10 * 1000);

            return settingResponse;
        }



        cb();
    }, true);
}

function checkSSO(labelMessage, cb) {
    let isSuccess = false;
    let urlParams = new URLSearchParams(window.location.search);
    let authData = getSession();

    if (urlParams.has("token")) {
        const url = `${configs.gameServerUrl}authenticate?token=${urlParams.get("token")}`;

        try {
            httpHelper.get(url, function (response) {
                if (response.isAuthenticated) {
                    window.authData = response;
                    window.authData.time = new Date();
                    response.isSSO = true;
                    console.log(urlParams.get("gameId"));
                    window.openGameId = urlParams.get("gameId");
                    storeSessionData(response);
                    clearTokenOnUrl();
                    cb();
                }
                else {
                    labelMessage.string = "Đăng nhập thất bại, bạn hãy làm lại thao tác đăng nhập từ đầu.";
                }
                console.log(response);
            });
        }
        catch (error) {
            labelMessage.string = "Đăng nhập lỗi.";
            logger.logError(error);
        }

        isSuccess = true;
    }
    else if (authData && authData.isAuthenticated && authData.ss) {
        isSuccess = true;
        window.authData = authData;
        cb();
    }

    return isSuccess;
}

function clearTokenOnUrl() {
    try {
        history.pushState(null, "", location.href.split("?")[0]);
    }
    catch (ex) {
        console.log(ex);
    }
}

function getSessionKey() {
    if (window.location && window.location.hostname) {
        return `${window.location.hostname}.${sessionIdStorageName}`;
    }

    return sessionIdStorageName;
}

function signOut() {
    cc.sys.localStorage.removeItem(getSessionKey());
}

function getSession() {
    return JSON.parse(cc.sys.localStorage.getItem(getSessionKey()));
}

function isSSO() {
    const session = getSession();
    return session && session.isSSO;
}

function storeSessionData(data) {
    cc.sys.localStorage.setItem(getSessionKey(), JSON.stringify(data));
}

function triggerSignIn(mainGame) {
    if (!!window.authData) {
        setTimeout(() => {
            mainGame.auth({
                authentication:
                {
                    username: window.authData.username,
                    data: window.authData
                }
            });
        }, 500);
    }
}

function checkAndUpdateRecheckIn() {
    let session = getSession();
    const isSessionExpired = true;

    try {

        if (session && session.time) {
            const now = new Date();
            const lastRecheckIn = new Date(session.time);
            const differenceInMinutes = Math.abs(now - lastRecheckIn) / (1000 * 60);
            console.log(`differenceInMinutes: ${differenceInMinutes}`)

            if (differenceInMinutes > sessionExpiredTimeoutMunutes) {
                signOut();
            }
            else {
                session.time = new Date();
                isSessionExpired = false;
                storeSessionData(session);
            }
        }
    }
    catch (ex) {
        logger.logError(ex);
    }

    return isSessionExpired;
}


module.exports = {
    checkSSO,
    signOut,
    storeSessionData,
    triggerSignIn,
    checkAndUpdateRecheckIn,
    isSSO,
    preChecking
}