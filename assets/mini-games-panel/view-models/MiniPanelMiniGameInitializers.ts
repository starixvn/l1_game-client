import { Socket } from "socket.io-client";

import { buildServerUrl, getProxyRoute } from "../.././common/helpers/UrlHelper";
import GameUtils from "../../common/GameUtils";
import { enableMsgpackParserAllGames } from "../../configs/Configs";
import { getGameConfiguration } from "../../configs/GameConfigurations";
import GameViewBase from "../../games/_base/GameViewBase";
import GameUIManager from "../../lobby/main/view-models/GameUIManager";
import MiniPanelSocketIOInitializers from "./MiniPanelSocketIOInitializers";

export default class MiniPanelMiniGameInitializers extends MiniPanelSocketIOInitializers {
    showGame(node: cc.Node) {
        if (node) {
            node.active = true;
            this.main.miniGames && this.main.miniGames.insertChild(node, this.main.miniGames.children.length - 1);
            this.main.setLoadingVisibility(false);
        }
    }

    getGameName(id: number): string {
        const gameConfiguration = getGameConfiguration(id);

        return gameConfiguration?.key;
    }

    async openMiniGame(gameId) {
        if (GameUIManager.getInstance().getCurrentGameId() !== gameId) {
            return;
        }

        this.main.popupMiniGame?.hideListGame();

        const gameBase = this.main.getGameMini(gameId);
        const isAlreadyOpened = gameBase !== undefined;
        const gameLoading = this.main.getGameLoadingComp(+gameId);

        if (!isAlreadyOpened) {
            this.main.loading.setDefaultPercent();
            try {
                const prefab = await GameUtils.loadMiniGamePrefab(gameId, (completedCount, total, item) => {
                    if (GameUIManager.getInstance().getCurrentGameId() !== gameId) {
                        this.main.unCacheAndHideGameLoading(gameLoading, gameId);
                        return;
                    }

                    gameLoading && gameLoading.onProgress(completedCount, total, item);
                });

                if (!this.main.isAlive()) {
                    return;
                }

                this.main.unCacheAndHideGameLoading(gameLoading, gameId);

                if (GameUIManager.getInstance().getCurrentGameId() !== gameId || this.main.getGameMini(gameId) !== undefined) {
                    return;
                }

                const node = cc.instantiate(prefab);
                const gameComponent = node.getComponent(GameViewBase);
                gameComponent.initMiniPanel(this.main);
                this.main.addMiniGame(gameComponent, gameId);
                gameComponent.openGame();
                GameUIManager.getInstance().emitter.emit(GameUIManager.Events.OPEN_GAME_MINI);
            } catch (error) {
                console.error(error);
                this.main.loading.node.active = false;
                this.main.onForceReload();
            }
        } else {
            this.showGame(gameBase.node);
            this.main.unCacheAndHideGameLoading(gameLoading, gameId);
        }
    }

    openGame(id) {
        this.openMiniGame(parseInt(id));
    }

    openMiniContainerGame(id: string) {
        this.openMiniGame(parseInt(id));
    }

    async openNewSocket(gameId) {
        let socket: Socket = this.socketIOController.getSocketGame(gameId);

        if (socket && socket.connected) {
            this.openMiniGame(gameId);
        } else {
            const multiplay = this.socketIOController.isMultiplayGame(gameId);
            if (socket && multiplay) {
                socket.removeAllListeners();
                socket.connect();
            } else {
                socket = this.createMiniGameSocket(gameId, true);
            }
            const gameName = await GameUtils.getDisplayGameName(gameId);
            this.initMiniGameSocketListeners(socket, gameId, gameName, null);
            socket.on("signedIn", () => {
                if (!this.main.isAlive()) {
                    return;
                }
                this.openMiniGame(gameId);
            });
        }
    }

    createMiniGameSocket(gameId: number, forceNew: boolean): Socket {
        const proxyRoute = getProxyRoute(gameId);
        const gameServerUrl = buildServerUrl("http", "", gameId);

        const option = {
            gameId,
            socketUri: gameServerUrl,
            proxyRoute,
            forceNew,
            enableMsgpackParser: enableMsgpackParserAllGames
        };
        const socket = this.socketIOController.connectGameSocket(option);
        this.socketIOController.assignSocket(gameId, socket);
        return socket;
    }

    initMiniGameSocketListeners(socket, gameId: number, gameName: string, gameContainer: any) {
        const listenerOptions = {
            gameId,
            gameName,
            onConnectFailed: (name, isGameRoom) => {
                this.main.onConnectSocketFailed(name, gameId, isGameRoom);

                if (gameContainer && gameContainer.hideContainer) {
                    gameContainer.hideContainer();
                }
            },
            isGameRoom: false,
            gameContainer
        };
        this.socketIOController.initBaseListeners(socket, listenerOptions);

        this.handleSocket(socket, gameId);
    }
}
