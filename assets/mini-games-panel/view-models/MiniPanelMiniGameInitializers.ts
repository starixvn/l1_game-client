import { Socket } from "socket.io-client";

import { buildServerUrl, getProxyRoute } from "../.././common/helpers/UrlHelper";
import GameUtils from "../../common/GameUtils";
import { enableMsgpackParserOnGame } from "../../configs/Configs";
import { GameIds, GameInfos } from "../../configs/SabaConfigs";
import MiniPanelSocketIOInitializers from "./MiniPanelSocketIOInitializers";

export default class MiniPanelMiniGameInitializers extends MiniPanelSocketIOInitializers {
    showGame(node: cc.Node) {
        if (node) {
            node.active = true;
            this.main.miniGames && this.main.miniGames.insertChild(node, this.main.miniGames.children.length - 1);

            this.main.loading.node.active = false;
        }
    }

    getGameName(id: number): string {
        return GameInfos[id].key;
    }

    openMiniGame(gameId) {
        this.main.popupMiniGame.hideListGame();
        const prefabPath = `games/minigame/${this.getGameName(gameId)}`;

        const gameBase = this.main.getGameMini(gameId);
        const isAlreadyOpened = gameBase !== undefined;

        if (!isAlreadyOpened) {
            this.main.loading.setDefaultPercent();
            cc.resources.load(
                prefabPath,
                (completedCount, total, item) => {
                    this.main.loading && this.main.loading.onProgress(completedCount, total, item);
                },
                (err: Error, prefab: any) => {
                    if (!this.main.isAlive()) {
                        return;
                    }
                    if (err || prefab === null) {
                        this.main.loading.node.active = false;
                        this.main.onForceReload();
                        return;
                    }

                    const node = cc.instantiate(prefab);
                    const componentName = gameId === GameIds.KenoProViet ? "KenoProViet" : "GameBase";
                    const gameComponent = node.getComponent(componentName);
                    gameComponent.initMiniPanel(this.main);
                    this.main.addMiniGame(gameComponent, gameId);
                    gameComponent.openGame();
                    this.main.loading.node.active = false;
                    this.main.mainGame?.loadLobby();
                }
            );
        } else {
            this.showGame(gameBase.node);
        }
        console.log("Open game");
    }

    openGame(id) {
        this.main.loading.node.active = true;
        this.openMiniGame(parseInt(id));
    }

    openMiniContainerGame(id: string) {
        this.main.loading.node.active = true;
        this.openMiniGame(parseInt(id));
    }

    openNewSocket(gameId) {
        this.main.loading.node.active = true;
        const currentSocket: Socket = this.socketIOController.getSocketGame(gameId);

        if (currentSocket && currentSocket.connected) {
            this.openMiniGame(gameId);
        } else {
            const gameName = gameId === GameIds.KenoMax ? GameUtils.getGameNameString(11) : GameUtils.getGameNameString(gameId);
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
            onConnectFailed: (name, isGameRoom) => {
                this.main.onConnectSocketFailed(name, isGameRoom);

                if (gameContainer && gameContainer.hideContainer) {
                    gameContainer.hideContainer();
                }
            },
            isGameRoom: false,
            forceNew,
            gameContainer,
            enableMsgpackParser: enableMsgpackParserOnGame?.[gameId]
        };
        const socket = this.socketIOController.connectGameSocket(option);

        this.handleSocket(socket, gameId);
        return socket;
    }
}
