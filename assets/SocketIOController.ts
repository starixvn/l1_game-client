import { injectable } from "inversify";
import * as socketIo from "socket.io-client";

import { getSession } from "./common/auth/SessionManager";
import { sentryLogger } from "./common/logger.js";
import { GameInfos } from "./configs/SabaConfigs";

@injectable()
export default class SocketIOController {
    public gameSockets = {};

    connectGameSocket = (
        socketUri: string,
        gameName: string,
        proxyRoute: string,
        onConnectFailed: (gameName, isGameRoom) => void,
        isGameRoom = true,
        forceNew = true
    ): SocketIOClient.Socket => {
        const socket = socketIo(socketUri, {
            forceNew: forceNew,
            transports: ["websocket"],
            upgrade: false,
            path: proxyRoute
        });

        socket.on("connect", () => {
            socket.emit("signin", getSession());
        });

        socket.on("reconnect", () => {
            // sentryLogger.logError(`${gameName} socket reconnect`);
            socket.sendBuffer = [];
        });

        socket.on("connect_failed", () => {
            socket.disconnect();
            onConnectFailed(gameName, isGameRoom);
        });

        socket.on("connect_error", (error) => {
            console.log(error);
            sentryLogger.logError(error);
            socket.disconnect();
            onConnectFailed(gameName, isGameRoom);
        });

        return socket;
    };

    async closeSocket(gameId) {
        const socket: SocketIOClient.Socket = this.gameSockets[gameId];
        socket && socket.disconnect();
        delete this.gameSockets[gameId];
    }

    closeAllSocket() {
        const keys = Object.keys(this.gameSockets);

        if (keys && keys.length) {
            keys.forEach(this.closeSocket.bind(this));
        }
    }

    closeMiniGameSockets() {
        const keys = Object.keys(this.gameSockets);
        keys.forEach((gameId) => {
            const info = GameInfos[gameId];
            if (info.mini) {
                this.closeSocket(gameId);
            }
        });
    }
}
