import { Socket } from "socket.io-client";

import { buildServerUrl, getProxyRoute } from "../.././common/helpers/UrlHelper";
import { getSession } from "../../common/auth/SessionManager";
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
                GameUIManager.getInstance().emitter.emit(GameUIManager.Events.RELOAD_LOBBY);
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
        const currentSocket: Socket = this.socketIOController.getSocketGame(gameId);
        const multiplay = this.socketIOController.isMultiplayGame(gameId);
        if (currentSocket && currentSocket.connected && !multiplay) {
            this.openMiniGame(gameId);
        } else if (currentSocket && !currentSocket.connected && multiplay) {
            currentSocket.connect();
        } else {
            const gameName = await GameUtils.getGameNameWithBundleManager(gameId);
            const socket = this.setUpSocketForGame(gameName, gameId, true, null);
            socket.on("signedIn", () => {
                if (!this.main.isAlive()) {
                    return;
                }
                this.openMiniGame(gameId);
            });
        }
    }

    setUpSocketForGame(gameName: string, gameId: number, forceNew: boolean, gameContainer: any): Socket {
        const proxyRoute = getProxyRoute(gameId);
        const gameServerUrl = buildServerUrl("http", "", gameId);

        const option = {
            gameId,
            socketUri: gameServerUrl,
            gameName,
            proxyRoute,
            onConnectCallback: (returnedSocket) => returnedSocket.emit("signin", getSession()),
            onConnectFailed: (name, isGameRoom) => {
                this.main.onConnectSocketFailed(name, gameId, isGameRoom);

                if (gameContainer && gameContainer.hideContainer) {
                    gameContainer.hideContainer();
                }
            },
            isGameRoom: false,
            forceNew,
            gameContainer,
            enableMsgpackParser: enableMsgpackParserAllGames
        };
        const socket = this.socketIOController.connectGameSocket(option);

        this.handleSocket(socket, gameId);
        this.socketIOController.assignSocket(gameId, socket);
        return socket;
    }
}
