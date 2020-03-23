const httpHelper = require('httpHelper');
const configs = require('Configs');
const sessionIdStorageName = 'scss';

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
                    console.log(urlParams.get("gameId"));
                    window.openGameId = urlParams.get("gameId");
                    storeSession(response);
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
            console.log(error);
        }

        isSuccess = true;
    }
    else if (authData && authData.isAuthenticated && authData.ss) {
        isSuccess = true;
        console.log(authData);
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

function storeSession(data) {
    cc.sys.localStorage.setItem(getSessionKey(), JSON.stringify(data));
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

module.exports = {
    checkSSO,
    signOut,
    triggerSignIn,
    storeSession,
    storeSessionData
}