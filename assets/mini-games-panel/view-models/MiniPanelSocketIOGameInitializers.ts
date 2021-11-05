import { buildServerUrl, getProxyRoute } from "../.././common/helpers/UrlHelper";
import { lazyInject } from "../../Application";
import AudioManager from "../../common/audio/AudioManager";
import * as sessionManager from "../../common/auth/SessionManager";
import GameUtils from "../../common/GameUtils";
import SocketIOController from "../../SocketIOController";
import MiniPanel from "./MiniPanel";

export default class MiniPanelSocketIOGameInitializers {
    @lazyInject(SocketIOController)
    private readonly socketIOController: SocketIOController;

    constructor(private readonly main: MiniPanel) {}

    public openGame(gameId) {
        AudioManager.getInstance().playClick();
        this.main.popupMiniGame.hideListGame();

        if (this.main.currentGameRoomId === gameId) {
            return;
        }

        this.main.loading.node.active = true;
        cc.RedT.inGame.outRoomGame().then(() => {
            sessionManager.removeInRoomGameId();
            cc.resources.loadDir(`image/${window.i18n.curLang}/${gameId}`, cc.Texture2D, null, () => {
                this.openNewSocket(gameId);
            });
        });
    }

    private openNewSocket(gameId) {
        this.socketIOController.closeSocket(gameId).then(() => {
            const gameName = GameUtils.getGameNameString(gameId);
            const proxyRoute = getProxyRoute(gameId);
            const gameServerUrl = buildServerUrl("http", "", gameId);
            const socket = this.socketIOController.connectGameSocket(
                gameServerUrl,
                gameName,
                proxyRoute,
                this.main.onConnectSocketFailed.bind(this.main),
                true,
                true,
                null
            );
            socket.on("message", (data) => {
                if (data.um) {
                    this.socketIOController.closeSocket(gameId);
                    if (data.um_message) {
                        this.main.handleUmMessage(data.um_message);
                    }
                }
                if (!this.main.isAlive()) {
                    return;
                }
                this.main.loading.node.active = false;
                this.main.onGeneralData(data);
            });

            socket.on("forceDisconnect", () => {
                socket.disconnect();
            });

            this.socketIOController.assignSocket(gameId, socket);
        });
    }
}
