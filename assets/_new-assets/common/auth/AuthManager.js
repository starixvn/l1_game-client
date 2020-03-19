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

                    storeSession(sessionIdStorageName, response);
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
    else if (authData && authData.isAuthenticated) {
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

function signOut() {
    cc.sys.localStorage.removeItem(sessionIdStorageName);
}

function getSession() {
    return JSON.parse(cc.sys.localStorage.getItem('scss'));
}

function storeSession(name, data) {
    cc.sys.localStorage.setItem(name, JSON.stringify(data));
}

function storeSessionData(data) {
    cc.sys.localStorage.setItem(sessionIdStorageName, JSON.stringify(data));
}

function triggerSignIn(mainGame) {
    if (!!window.authData) {
        setTimeout(() => {
            mainGame.auth({
                authentication:
                {
                    username: window.authData.username,
                    isSso: true,
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