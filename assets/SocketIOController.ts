import { injectable } from "inversify";
import { io, Socket, ManagerOptions, SocketOptions } from "socket.io-client";
import * as MsgpackParser from "socket.io-msgpack-parser";

import { getSession } from "./common/auth/SessionManager";
import { sentryLogger } from "./common/logger.js";
import { GameInfos } from "./configs/SabaConfigs";

@injectable()
export default class SocketIOController {
    private gameSockets = {};

    getSocketGame(gameId: number) {
        return this.gameSockets[gameId.toString()];
    }

    assignSocket(gameId: number, socket: Socket) {
        this.gameSockets[gameId.toString()] = socket;
    }

    connectGameSocket = (
        socketUri: string,
        gameName: string,
        proxyRoute: string,
        onConnectFailed: (gameName, isGameRoom) => void,
        isGameRoom: boolean,
        forceNew: boolean,
        gameContainer: any,
        enableMsgpackParser = false
    ): Socket => {
        const socketOptions: Partial<ManagerOptions & SocketOptions> = {
            forceNew: forceNew,
            transports: ["websocket"],
            upgrade: false,
            path: proxyRoute
        };

        if (enableMsgpackParser) {
            socketOptions.parser = MsgpackParser;
            console.log(`msgpack is enabled on ${gameName}`);
        }

        const socket = io(socketUri, socketOptions);

        const needCallCallback = !gameContainer || gameContainer.isMain;
        let name = gameName;
        if (gameContainer && gameContainer.alternativeName) {
            name = gameContainer.alternativeName;
        }

        socket.on("connect", () => {
            socket.emit("signin", getSession());
        });

        socket.on("reconnect", () => {});

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

        socket.on("disconnect", (reason) => {
            sentryLogger.log(reason);
        });

        return socket;
    };

    async closeSocket(gameId) {
        const socket: Socket = this.gameSockets[gameId];
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
