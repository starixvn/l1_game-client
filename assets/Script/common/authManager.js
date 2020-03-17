const axios = require('../Util/axios');
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
        axios.get(`${configs.gameServerUrl}authenticate?token=${urlParams.get("token")}`)
            .then(function (response) {
                if (response.data.isAuthenticated) {
                    window.authData = response.data;
                    window.authData.time = new Date();

                    storeSession(sessionIdStorageName, response.data);

                    cb();
                }
                else {
                    labelMessage.string = "Đăng nhập thất bại, bạn hãy làm lại thao tác đăng nhập từ đầu.";
                }
                console.log(response.data);
            })
            .catch(function (error) {
                labelMessage.string = "Đăng nhập lỗi.";
                console.log(error);
            });

        isSuccess = true;
    }

    return isSuccess;
}

function signOut() {
    cc.sys.localStorage.removeItem(sessionIdStorageName);
}

function storeSession(name, data){
    cc.sys.localStorage.setItem(name, JSON.stringify(data));
}

function storeSessionData(data){
    cc.sys.localStorage.setItem(sessionIdStorageName, JSON.stringify(data));
}

function triggerSignIn(mainGame) {
    if (!!window.authData) {
        mainGame.auth({
            authentication:
            {
                username: window.authData.username,
                isSso: true,
                data: window.authData
            }
        });
    }
}

module.exports = {
    checkSSO,
    signOut,
    triggerSignIn,
    storeSession,
    storeSessionData
}