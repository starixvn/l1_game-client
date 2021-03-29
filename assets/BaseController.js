import { buildServerUrl } from "./common/helpers/UrlHelper";
import logger from "./common/logger";
import configs from "./configs/Configs";
import LobbyMenuConfig from "./lobby/main/view-models/LobbyMenuConfig";

const sentryLogger = logger();

module.exports = {
    IS_LOGIN: false,
    IS_SOUND: true,
    isConnected: false,
    GAME_IS_SHOWED: true,
    _socket: null,
    loading: null,
    isForceKickedOut: false,
    user: {},
    prefab: {},
    setting: {},
    util: {},
    gameSockets: {},

    dataObservers: {},
    soundObservers: {},
    userStakeLevel: {},

    connect: function (ssl) {
        if (!this.isConnected && !this.isForceKickedOut) {
            this._socket = new WebSocket(buildServerUrl(ssl, "ws", "/websocket"));
            this._socket.onopen = this._onSocketConnect;
            this._socket.onclose = this._onSocketDisconnect;
            this._socket.onmessage = this._onSocketData;
            this._socket.onerror = this._onSocketError;

            if (this.loading) {
                this.loading.active = false;
            }
        }
    },
    forceKickedOut: function () {
        this.isForceKickedOut = true;
        this._socket.close();
    },
    disconnect: function () {
        this.isConnected = !1;
        this._socket.close();
    },
    send: function (message) {
        try {
            this._socket.readyState === 1 && this._socket.send(this._encodeMessage(message));
        } catch (err) {
            sentryLogger.logError(err);
            if (this.inGame && this.inGame.loading) {
                this.inGame.loading.active = false;
                this.inGame.showNotice({
                    title: "THÔNG BÁO",
                    text: "Không thể kết nối tới máy chủ."
                });
            }
        }
    },
    _decodeMessage: function (message) {
        return JSON.parse(message);
    },
    _encodeMessage: function (message) {
        return JSON.stringify(message);
    },
    _onSocketConnect: function () {
        cc.RedT.isConnected = true;
        if (cc.RedT.inGame && cc.RedT.inGame.loading) {
            cc.RedT.inGame.loading.active = true;
        }

        //authManager && authManager.triggerSignIn();

        setTimeout(function () {
            if (cc.RedT.inGame && cc.RedT.inGame.loading) {
                cc.RedT.inGame.loading.active = false;
            }
        }, 3000);
    },
    _onSocketDisconnect: function () {
        cc.RedT.isConnected = false;
        if (cc.RedT.inGame) {
            if (cc.RedT.IS_LOGIN) {
                cc.RedT.inGame.onDisconnected();
            }
            // else if (cc.RedT.inGame.dialog) {
            //     cc.RedT.inGame.dialog.onCloseDialog();
            // }
        }
        cc.RedT.reconnect();
    },
    _onSocketError: function (message) {
        cc.RedT.isConnected = false;
        cc.RedT.inGame.onSocketError && cc.RedT.inGame.onSocketError();
    },
    _onSocketData: function (message) {
        var data = message.data;
        data = cc.RedT._decodeMessage(data);
        cc.RedT.inGame && cc.RedT.inGame.onData(data);

        Object.keys(cc.RedT.dataObservers).forEach((key) => {
            var observer = cc.RedT.dataObservers[key];
            observer && observer(data);
        });

        if (data.userStakeLevel) {
            cc.RedT.userStakeLevelData(data.userStakeLevel);
        }
    },
    addDataObserver(key, observer) {
        this.dataObservers[key] = observer;
    },
    removeDataObserver(key) {
        delete this.dataObservers[key];
    },

    reconnect: function () {
        this.connect(configs.ssl);
    },
    init: function (loading) {
        this.initPrototype();
        this.loading = loading;
        this.dataObservers = {};

        const menuConfig = new LobbyMenuConfig();
        this.user.offerGames = menuConfig.list;
    },
    initPrototype: function () {
        if (!String.format) {
            String.format = function (t) {
                var i = Array.prototype.slice.call(arguments, 1);
                return t.replace(/{(\d+)}/g, function (t, e) {
                    return void 0 !== i[e] ? i[e] : t;
                });
            };
        }
    },
    // Function localStorage
    setAutoLogin: function (bool) {
        cc.sys.localStorage.setItem("AUTO_LOGIN", bool);
    },
    isAutoLogin: function () {
        var check = cc.sys.localStorage.getItem("AUTO_LOGIN");
        return check === "true";
    },
    addSoundObserver(key, observer) {
        this.soundObservers[key] = observer;
    },
    removeSoundObserver(key) {
        delete this.soundObservers[key];
    },
    setSoundGame: function (bool) {
        cc.sys.localStorage.setItem("SOUND_GAME", bool);

        Object.keys(cc.RedT.soundObservers).forEach((key) => {
            var observer = cc.RedT.soundObservers[key];
            observer && observer(bool);
        });
    },
    isSoundGame: function () {
        var check = cc.sys.localStorage.getItem("SOUND_GAME");

        if (check === null || check === undefined) {
            this.setSoundGame(true);
            return true;
        }

        return check === "true";
    },
    setSoundBackground: function (bool) {
        cc.sys.localStorage.setItem("SOUND_BACKGROUND", bool);
    },
    isSoundBackground: function () {
        var check = cc.sys.localStorage.getItem("SOUND_BACKGROUND");

        if (check === null || check === undefined) {
            this.setSoundBackground(true);
            return true;
        }

        return check === "true";
    },
    userData: function (data) {
        if (void 0 !== data.offerGames && data.offerGames.length > 0) {
            const menuConfig = new LobbyMenuConfig();
            const offerGames = data.offerGames;
            const list = [];
            menuConfig.list.forEach((id) => {
                if (offerGames.includes(id)) {
                    list.push(id);
                }
            });
            this.user.offerGames = list;
            cc.sys.localStorage.setItem("latestOfferGames", JSON.stringify(list));
        }
        if (void 0 !== data.name) {
            this.user.name = data.name;
        }
        if (void 0 !== data.avatarId) {
            this.user.avatarId = data.avatarId;
        }
        if (void 0 !== data.red) {
            this.user.red = data.red;
        }
        if (void 0 !== data.UID) {
            this.user.UID = data.UID;
        }
        if (void 0 !== data.joinedOn) {
            this.user.joinedOn = data.joinedOn;
        }
        if (void 0 !== data.security) {
            this.user.security = data.security;
        }
        if (void 0 !== data.currency) {
            this.user.currency = data.currency;
        }
        if (void 0 !== data.availSpins) {
            this.user.availSpins = data.availSpins;
        }
        if (void 0 !== data.scoins) {
            this.user.scoins = data.scoins;
        }
    },
    userStakeLevelData: function (data) {
        this.userStakeLevel.minBet = data.minBet;
        this.userStakeLevel.maxBet = data.maxBet;
    }
};
