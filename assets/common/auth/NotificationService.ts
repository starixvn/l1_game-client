import { io, Socket } from "socket.io-client";
import { buildUrl, getEnvironment } from "../helpers/UrlHelper";
import { sentryLogger } from "../logger";
import * as i18n from "i18n/runtime-scripts/LanguageData";
import * as configs from "../../configs/Configs";

export default class NotificationService {
    public static getInstance(): NotificationService {
        if (!this.instance) {
            this.instance = new NotificationService();
        }

        return this.instance;
    }

    private static instance: NotificationService;
    private socket: Socket;
    private dataObservers = {};

    connect() {
        if (this.socket) {
            return;
        }

        const socketOptions = {
            forceNew: false,
            transports: ["websocket"],
            upgrade: false,
            path: `${getEnvironment()}/notification/socket.io`,
            auth: {
                ss: window.authData.ss,
                username: window.authData.username
            }
        };

        this.socket = io(buildUrl(), socketOptions);

        this.socket.on("connect_failed", () => {
            this.socket.disconnect();
        });

        this.socket.on("connect_error", (error) => {
            sentryLogger.logError(error);
            this.socket.disconnect();
        });

        this.socket.on("disconnect", (reason) => {
            this.reconnect();
        });

        const messageList = [
            "gameNotification",
            "marquee",
            "jackpotPools",
            "getWinners",
            "jackpotWinner",
            "jackpotWinners",
            "kickedOut",
            "reload",
            "auth"
        ];

        messageList.forEach((message) => {
            this.socket.on(message, (data) => {
                this.onData(data, message);
            });
        });
    }

    reconnect() {
        this.connect();
    }

    forceKickedOut() {
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
