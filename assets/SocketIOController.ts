import { injectable } from "inversify";
import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client";
import * as MsgpackParser from "socket.io-msgpack-parser";

import { getSession } from "./common/auth/SessionManager";
import GameUtils from "./common/GameUtils";
import { getProxyRoute } from "./common/helpers/UrlHelper";
import { sentryLogger } from "./common/logger.js";
import { enableMsgpackParserAllGames } from "./configs/Configs.js";
import { getGameConfiguration } from "./configs/GameConfigurations";

@injectable()
export default class SocketIOController {
    private gameSockets = {};

    protected readonly multiplayGames = [
        50,
        51,
        54,
        55, // UnbalancedBigSmall
        9,
        56,
        57,
        58, // MiniSedie
        52,
        53,
        14,
        15,
        16,
        17,
        18,
        19 //mega keno
    ];

    getSocketGame(gameId: number) {
        return this.gameSockets[gameId.toString()];
    }

    assignSocket(gameId: number, socket: Socket) {
        this.gameSockets[gameId.toString()] = socket;
    }

    createSocketByUrl(gameId, socketUri) {
        const proxyRoute = getProxyRoute(gameId);

        const option = {
            socketUri,
            proxyRoute,
            forceNew: true,
            enableMsgpackParser: enableMsgpackParserAllGames,
            gameId
        };
        return this.connectGameSocket(option);
    }

    initBaseListenersForSocketUrl(socket, gameId, onConnectFailed, onConnectCallback?) {
        const gameName = GameUtils.getGameNameString(gameId);

        const listenerOptions = {
            gameName,
            onConnectCallback,
            onConnectFailed,
            isGameRoom: true,
            gameContainer: null,
            gameId
        };
        this.initBaseListeners(socket, listenerOptions);
    }

    isMultiplayGame(gameId: number): boolean {
        return this.multiplayGames.includes(+gameId);
    }

    connectGameSocket = (option: {
        socketUri: string;
        proxyRoute: string;
        forceNew: boolean;
        enableMsgpackParser: boolean;
        gameId: any;
    }): Socket => {
        const { socketUri, proxyRoute, forceNew, enableMsgpackParser, gameId } = option;
        const multiplay = this.isMultiplayGame(gameId);
        const socketOptions: Partial<ManagerOptions & SocketOptions> = {
            forceNew: !multiplay && forceNew,
            transports: ["websocket"],
            upgrade: false,
            path: proxyRoute
        };

        if (enableMsgpackParser) {
            socketOptions.parser = MsgpackParser;
        }

        return io(socketUri, socketOptions);
    };

    initBaseListeners(
        socket,
        option: {
            gameName: string;
            onConnectCallback?: Function;
            onConnectFailed: (gameName, gameId, isGameRoom) => void;
            isGameRoom: boolean;
            gameContainer: any;
            gameId: any;
        }
    ) {
        const { gameName, onConnectFailed, isGameRoom, gameContainer, gameId, onConnectCallback } = option;

        const needCallCallback = !gameContainer || gameContainer.isMain;
        let name = gameName;
        if (gameContainer && gameContainer.alternativeName) {
            name = gameContainer.alternativeName;
        }

        socket.on("connect", () => {
            if (onConnectCallback) {
                onConnectCallback(socket);
            } else {
                socket.emit("signin", getSession());
            }
        });

        socket.on("connect_error", (error) => {
            console.log(error);
            sentryLogger.logError(error);
            socket.disconnect();
            if (needCallCallback) {
                onConnectFailed(name, gameId, isGameRoom);
            }
        });

        socket.on("disconnect", (reason, detail: { description }) => {
            sentryLogger.log(`socket disconnect - ${gameName} - ${reason}:   ${detail?.description}`);
        });
    }

    async closeSocket(gameId) {
        const socket: Socket = this.gameSockets[gameId];
        socket && socket.disconnect();
        const multiplay = this.isMultiplayGame(gameId);
        if (!multiplay) {
            this.deleteCachedSocket(gameId);
        }
    }

    deleteCachedSocket(gameId: number) {
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
            const gameConfiguration = getGameConfiguration(gameId);

            if (gameConfiguration?.mini) {
                this.closeSocket(gameId);
            }
        });
    }
}
