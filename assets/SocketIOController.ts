import { injectable } from "inversify";
import * as socketIo from "socket.io-client";

import { getSession } from "./common/auth/SessionManager";
import { sentryLogger } from "./common/logger.js";
import { GameInfos } from "./configs/SabaConfigs";

@injectable()
export default class SocketIOController {
    private gameSockets = {};

    getSocketGame(gameId: number) {
        return this.gameSockets[gameId.toString()];
    }

    assignSocket(gameId: number, socket: SocketIOClient.Socket) {
        this.gameSockets[gameId.toString()] = socket;
    }

    connectGameSocket = (
        socketUri: string,
        gameName: string,
        proxyRoute: string,
        onConnectFailed: (gameName, isGameRoom) => void,
        isGameRoom: boolean,
        forceNew: boolean,
        gameContainer: any
    ): SocketIOClient.Socket => {
        const socket = socketIo(socketUri, {
            forceNew: forceNew,
            transports: ["websocket"],
            upgrade: false,
            path: proxyRoute
        });

        const needCallCallback = !gameContainer || gameContainer.isMain;
        let name = gameName;
        if (gameContainer && gameContainer.alternativeName) {
            name = gameContainer.alternativeName;
        }

        socket.on("connect", () => {
            socket.emit("signin", getSession());
        });

        socket.on("reconnect", () => {
            socket.sendBuffer = [];
        });

        socket.on("connect_failed", () => {
            socket.disconnect();
            if (needCallCallback) {
                onConnectFailed(name, isGameRoom);
            }
        });

        socket.on("connect_error", (error) => {
            console.log(error);
            sentryLogger.logError(error);
            socket.disconnect();
            if (needCallCallback) {
                onConnectFailed(name, isGameRoom);
            }
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
