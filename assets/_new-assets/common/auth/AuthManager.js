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
            console.log(error);
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
    const session = getSession();

    if (session && session.time) {
        const now = new Date();
        const lastRecheckIn = new Date(session.time);
        const differenceInMinutes = Math.abs(now - lastRecheckIn) / (1000 * 60);
        console.log(`differenceInMinutes: ${differenceInMinutes}`)

        if (differenceInMinutes > 4.8) {
            signOut();
        }
        else {
            session.time = new Date();
            storeSessionData(session);
        }
    }
}

module.exports = {
    checkSSO,
    signOut,
    storeSessionData,
    triggerSignIn,
    checkAndUpdateRecheckIn,
    isSSO
}