import { Socket } from "socket.io-client";

import { buildServerUrl, getProxyRoute } from "../.././common/helpers/UrlHelper";
import { getSession } from "../../common/auth/SessionManager";
import GameUtils from "../../common/GameUtils";
import { enableMsgpackParserAllGames } from "../../configs/Configs";
import { GameIds, GameInfos } from "../../configs/SabaConfigs";
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
        return GameInfos[id].key;
    }

    openMiniGame(gameId) {
        this.main.popupMiniGame?.hideListGame();
        const prefabPath = `games/minigame/${this.getGameName(gameId)}`;

        const gameBase = this.main.getGameMini(gameId);
        const isAlreadyOpened = gameBase !== undefined;
        const gameLoading = this.main.getGameLoadingComp(+gameId);

        if (!isAlreadyOpened) {
            gameLoading && gameLoading.setDefaultPercent();
            cc.resources.load(
                prefabPath,
                (completedCount, total, item) => {
                    if (GameUIManager.getInstance().getCurrentGameId() !== gameId) {
                        this.main.unCacheAndHideGameLoading(gameLoading, gameId);
                        return;
                    }

                    gameLoading && gameLoading.onProgress(completedCount, total, item);
                },
                (err: Error, prefab: any) => {
                    if (!this.main.isAlive()) {
                        return;
                    }

                    this.main.unCacheAndHideGameLoading(gameLoading, gameId);

                    if (err || prefab === null) {
                        this.main.onForceReload();
                        return;
                    }

                    if (GameUIManager.getInstance().getCurrentGameId() !== gameId) {
                        return;
                    }

                    const node = cc.instantiate(prefab);
                    const componentName = gameId === GameIds.KenoProViet ? "KenoProViet" : "GameBase";
                    const gameComponent = node.getComponent(componentName);
                    console.log(componentName, gameComponent);
                    gameComponent.initMiniPanel(this.main);
                    this.main.addMiniGame(gameComponent, gameId);
                    gameComponent.openGame();
                    this.main.mainGame?.loadLobby();
                }
            );
        } else {
            this.showGame(gameBase.node);
        }
    }

    openGame(id) {
        this.openMiniGame(parseInt(id));
    }

    openMiniContainerGame(id: string) {
        this.openMiniGame(parseInt(id));
    }

    openNewSocket(gameId) {
        const currentSocket: Socket = this.socketIOController.getSocketGame(gameId);

        if (currentSocket && currentSocket.connected) {
            this.openMiniGame(gameId);
        } else {
            const gameName = gameId === GameIds.MegaKeno ? GameUtils.getGameNameString(11) : GameUtils.getGameNameString(gameId);
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
            socketUri: gameServerUrl,
            gameName,
            proxyRoute,
            onConnectCallback: (returnedSocket) => returnedSocket.emit("signin", getSession()),
            onConnectFailed: (name, isGameRoom) => {
                this.main.onConnectSocketFailed(name, isGameRoom);

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
