import { buildServerUrl, getProxyRoute } from "../.././common/helpers/UrlHelper";
import AudioManager from "../../common/audio/AudioManager";
import * as sessionManager from "../../common/auth/SessionManager";
import GameUtils from "../../common/GameUtils";
import MiniPanelSocketIOInitializers from "./MiniPanelSocketIOInitializers";

export default class MiniPanelSocketIOGameInitializers extends MiniPanelSocketIOInitializers {
    public openGame(gameId) {
        AudioManager.getInstance().playClick();
        this.main.popupMiniGame.hideListGame();

        if (this.main.currentGameRoomId === gameId) {
            return;
        }

        this.main.loading.node.active = true;
        cc.RedT.inGame.outRoomGame().then(() => {
            sessionManager.removeInRoomGameId();
            this.openNewSocket(gameId);
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
            this.handleSocket(socket, gameId);
        });
    }
}
