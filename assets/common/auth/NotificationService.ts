import { io, Socket } from "socket.io-client";
import { buildUrl } from "../helpers/UrlHelper";
import { sentryLogger } from "../logger";

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

        this.socket.on("game-notification", (data) => {
            this.onGameNotificationData(data);
        });

        this.socket.on("marquee", (data) => {
            this.onMarqueeData(data);
        });

        this.socket.on("getPools", (data) => {
            // xu ly data
        });

        this.socket.on("getWinners", (data) => {
            // xu ly data
        });
    }

    emitEvent(eventName, data) {
        try {
            this.socket.emit(eventName, data);
        } catch (err) {
            sentryLogger.logError(err);
        }
    }

    onGameNotificationData(data) {
        Object.keys(this.dataObservers).forEach((key) => {
            var observer = this.dataObservers[key];
            observer && observer(data);
        });
    }

    onMarqueeData(data) {
        cc.RedT.inGame && cc.RedT.inGame.onData(data);
    }

    addDataObserver(key, observer) {
        this.dataObservers[key] = observer;
    }

    removeDataObserver(key) {
        delete this.dataObservers[key];
    }
}
