import { buildServerUrl } from "../.././common/helpers/UrlHelper";
import { lazyInject } from "../../Application";
import GameUtils from "../../common/GameUtils";
import * as configs from "../../configs/Configs";
import * as SabaConfigs from "../../configs/SabaConfigs";
import SocketIOController from "../../SocketIOController";
import * as authManager from "./../../common/auth/AuthManager";
import MiniPanel from "./MiniPanel";

export default class MiniPanelSocketIOGameInitializers {
    @lazyInject(SocketIOController)
    private readonly socketIOController: SocketIOController;

    constructor(private readonly main: MiniPanel) {}

    public openGame(gameId) {
        cc.RedT.audio.playClick();
        this.main.popupMiniGame.hideListGame();

        if (this.main.currentGameRoomId === gameId) {
            return;
        }

        this.main.loading.node.active = true;
        cc.RedT.inGame.outRoomGame().then(() => {
            authManager.removeInRoomGameId();
            this.openNewSocket(gameId);
        });
    }

    private openNewSocket(gameId) {
        this.socketIOController.closeSocket(gameId).then(() => {
            const gameName = GameUtils.getGameNameString(gameId);
            const proxyRoute = configs.serverGameEndPoints[gameId].proxyRoute;
            const gameServerUrl = buildServerUrl(configs.ssl, "http", "", gameId);
            const socket = this.socketIOController.connectGameSocket(
                gameServerUrl,
                gameName,
                proxyRoute,
                this.main.onConnectSocketFailed.bind(this.main)
            );
            socket.on("message", (data) => {
                if (data.um) {
                    this.socketIOController.closeSocket(gameId);
                }
                if (!this.main.node || !this.main.node.isValid) {
                    return;
                }
                this.main.loading.node.active = false;
                this.main.onGeneralData(data);
            });

            socket.on("forceDisconnect", () => {
                socket.disconnect();
            });

            this.socketIOController.gameSockets[gameId] = socket;
        });
    }
}
