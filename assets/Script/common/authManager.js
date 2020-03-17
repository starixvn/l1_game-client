const httpHelper = require('../Helper/httpHelper');
const configs = require('./configs');
const sessionIdStorageName = 'scss';

function checkSSO(labelMessage, cb) {
    let isSuccess = false;
    let urlParams = new URLSearchParams(window.location.search);
    let authData = JSON.parse(cc.sys.localStorage.getItem('scss'));
    if (authData && authData.isAuthenticated) {
        isSuccess = true;
        console.log(authData);
        window.authData = authData;
        cb();
    }
    else if (urlParams.has("token")) {
        const url = `${configs.gameServerUrl}authenticate?token=${urlParams.get("token")}`;

        try {
            httpHelper.get(url, function (response) {
                if (response.isAuthenticated) {
                    window.authData = response;
                    window.authData.time = new Date();

                    storeSession(sessionIdStorageName, response);

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

    return isSuccess;
}

function signOut() {
    cc.sys.localStorage.removeItem(sessionIdStorageName);
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