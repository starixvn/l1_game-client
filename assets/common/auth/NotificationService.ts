import { io, Socket } from "socket.io-client";
import { buildUrl } from "../helpers/UrlHelper";
import { sentryLogger } from "../logger";
import * as i18n from "i18n/runtime-scripts/LanguageData";

export default class NotificationService {
    public static getInstance(): NotificationService {
        if (!this.instance) {
            this.instance = new NotificationService();
        }

        return this.instance;
    }

    private static instance: NotificationService;
    private isConnected = false;
    private isForceKickedOut = false;
    private socket: Socket;
    private dataObservers = {};

    connect() {
        if (!this.isConnected && !this.isForceKickedOut) {
            const socketOptions = {
                forceNew: false,
                transports: ["websocket"],
                upgrade: false,
                path: "/notification/socket.io",
                auth: {
                    ss: window.authData.ss,
                    username: window.authData.username
                }
            };

            this.socket = io(buildUrl(), socketOptions);

            this.socket.on("connect", () => {
                this.isConnected = true;
            });

            this.socket.on("connect_failed", () => {
                this.socket.disconnect();
            });

            this.socket.on("connect_error", (error) => {
                sentryLogger.logError(error);
                this.socket.disconnect();
            });

            this.socket.on("disconnect", (reason) => {
                this.isConnected = false;
                if (cc.RedT.inGame) {
                    if (cc.RedT.IS_LOGIN) {
                        cc.RedT.inGame.onDisconnected();
                    }
                }
                this.reconnect();
            });

            this.socket.on("forceDisconnect", () => {
                this.isConnected = false;
                this.socket.disconnect();
            });

            this.socket.on("gameNotification", (data) => {
                this.onData(data, "gameNotification");
            });

            this.socket.on("marquee", (data) => {
                this.onMarqueeData(data);
            });

            this.socket.on("jackpotPools", (data) => {
                this.onData(data, "jackpotPools");
            });

            this.socket.on("getWinners", (data) => {
                this.onData(data, "getWinners");
            });

            this.socket.on("jackpotWinner", (data) => {
                this.onData(data, "jackpotWinner");
            });

            this.socket.on("jackpotWinners", (data) => {
                this.onData(data, "jackpotWinners");
            });

            this.socket.on("kickedOut", (data) => {
                this.onKickdOutData(data);
            });

            this.socket.on("reload", (data) => {
                cc.RedT.MiniPanel.onForceReload();
            });

            this.socket.on("auth", (data) => {
                this.onAuthData(data);
            });
        }
    }

    reconnect() {
        this.connect();
    }

    forceKickedOut() {
        this.isForceKickedOut = true;
        this.socket && this.socket.disconnect();
    }

    emitEvent(eventName, data) {
        try {
            this.socket.emit(eventName, data);
        } catch (err) {
            sentryLogger.logError(err);
            if (cc.RedT.inGame && cc.RedT.inGame.loading) {
                cc.RedT.inGame.loading.active = false;
                cc.RedT.inGame.showNotice({
                    text: i18n.t("messages.connectionFailed")
                });
            }
        }
    }

    onData(data, dataType: string) {
        Object.keys(this.dataObservers).forEach((type) => {
            if (type === dataType) {
                Object.keys(this.dataObservers[type]).forEach((key) => {
                    var observer = this.dataObservers[type][key];
                    observer && observer(data);
                });
            }
        });
    }

    onAuthData(data) {
        if (data.authorized) {
            cc.RedT.MiniPanel.onSignIn();
        } else {
            cc.RedT.inGame && cc.RedT.inGame.unAuthorized(data);
        }
    }

    onMarqueeData(data) {
        cc.RedT.inGame && cc.RedT.inGame.handleMarqueeMsg(data);
    }

    onKickdOutData(data) {
        cc.RedT.MiniPanel.dataHandlers.handleDataKickedOut(data);
    }

    addDataObserver(dataType: string, dataKey: string, observer) {
        if (!this.dataObservers[dataType]) {
            this.dataObservers[dataType] = {};
        }
        this.dataObservers[dataType][dataKey] = observer;
    }

    removeDataObserver(dataType: string, dataKey: string) {
        delete this.dataObservers[dataType][dataKey];
    }
}
