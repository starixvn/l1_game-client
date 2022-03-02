import { buildServerUrl, getProxyRoute } from "../.././common/helpers/UrlHelper";
import AudioManager from "../../common/audio/AudioManager";
import * as sessionManager from "../../common/auth/SessionManager";
import GameUtils from "../../common/GameUtils";
import { enableMsgpackParserOnGame } from "../../configs/Configs";
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

            const option = {
                socketUri: gameServerUrl,
                gameName,
                proxyRoute,
                onConnectFailed: this.main.onConnectSocketFailed.bind(this.main),
                isGameRoom: true,
                forceNew: true,
                gameContainer: null,
                enableMsgpackParser: enableMsgpackParserOnGame?.[gameId]
            };
            const socket = this.socketIOController.connectGameSocket(option);
            this.handleSocket(socket, gameId);
        });
    }
}
