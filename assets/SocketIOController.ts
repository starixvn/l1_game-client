import { injectable } from "inversify";
import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client";
import * as MsgpackParser from "socket.io-msgpack-parser";

import { getSession } from "./common/auth/SessionManager";
import GameUtils from "./common/GameUtils";
import { getProxyRoute } from "./common/helpers/UrlHelper";
import { sentryLogger } from "./common/logger.js";
import { enableMsgpackParserAllGames } from "./configs/Configs.js";
import { getGameConfiguration } from "./configs/GameConfigurations";
import MiniPanel from "./mini-games-panel/view-models/MiniPanel";

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

    openSocketByUri(
        miniPanel: MiniPanel,
        gameId,
        socketUri,
        onConnectCallback = (returnedSocket) => returnedSocket.emit("signin", getSession())
    ) {
        const gameName = GameUtils.getGameNameString(gameId);
        const proxyRoute = getProxyRoute(gameId);

        const option = {
            socketUri,
            gameName,
            proxyRoute,
            onConnectCallback,
            onConnectFailed: miniPanel.onConnectSocketFailed.bind(miniPanel),
            isGameRoom: true,
            forceNew: true,
            gameContainer: null,
            enableMsgpackParser: enableMsgpackParserAllGames,
            gameId: gameId
        };
        return this.connectGameSocket(option);
    }

    isMultiplayGame(gameId: number): boolean {
        return this.multiplayGames.includes(+gameId);
    }

    connectGameSocket = (option: {
        socketUri: string;
        gameName: string;
        proxyRoute: string;
        onConnectCallback: (returnedSocket) => void;
        onConnectFailed: (gameName, gameId, isGameRoom) => void;
        isGameRoom: boolean;
        forceNew: boolean;
        gameContainer: any;
        enableMsgpackParser: boolean;
        gameId: any;
    }): Socket => {
        const {
            socketUri,
            gameName,
            proxyRoute,
            onConnectCallback,
            onConnectFailed,
            isGameRoom,
            forceNew,
            gameContainer,
            enableMsgpackParser,
            gameId
        } = option;
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

        const socket = io(socketUri, socketOptions);

        const needCallCallback = !gameContainer || gameContainer.isMain;
        let name = gameName;
        if (gameContainer && gameContainer.alternativeName) {
            name = gameContainer.alternativeName;
        }

        socket.on("connect", () => {
            onConnectCallback(socket);
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

        return socket;
    };

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
