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
    socket: Socket;
    isConnected = false;
    dataObservers = {};

    connect() {
        const socketOptions = {
            forceNew: true,
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
            this.isConnected = false;
            sentryLogger.logError(error);
            this.socket.disconnect();
        });

        this.socket.on("disconnect", (reason) => {
            sentryLogger.log(reason);
            this.isConnected = false;
        });

        this.socket.on("forceDisconnect", () => {
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

        this.socket.on("kickedOut", (data) => {
            // TODO:
        });

        this.socket.on("auth", (data) => {
            this.onAuthData(data);
        });
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

    onData(data, dataKey: string) {
        Object.keys(this.dataObservers).forEach((key) => {
            if (key === dataKey) {
                Object.keys(this.dataObservers[key]).forEach((keyType) => {
                    var observer = this.dataObservers[key][keyType];
                    observer && observer(data);
                });
            }
        });
    }

    onAuthData(data) {
        if (!data.authorized) {
            cc.RedT.inGame && cc.RedT.inGame.unAuthorized(data);
        }
    }

    onMarqueeData(data) {
        cc.RedT.inGame && cc.RedT.inGame.handleMarqueeMsg(data);
    }

    addDataObserver(dataKey, keyType, observer) {
        if (!this.dataObservers[dataKey]) {
            this.dataObservers[dataKey] = {};
        }
        this.dataObservers[dataKey][keyType] = observer;
    }

    removeDataObserver(dataKey, keyType) {
        delete this.dataObservers[dataKey][keyType];
    }
}
