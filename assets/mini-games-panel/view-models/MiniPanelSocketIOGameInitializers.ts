import { buildServerUrl, getProxyRoute } from "../.././common/helpers/UrlHelper";
import AudioManager from "../../common/audio/AudioManager";
import * as sessionManager from "../../common/auth/SessionManager";
import GameUtils from "../../common/GameUtils";
import { enableMsgpackParserAllGames } from "../../configs/Configs";
import MiniPanelSocketIOInitializers from "./MiniPanelSocketIOInitializers";

export default class MiniPanelSocketIOGameInitializers extends MiniPanelSocketIOInitializers {
    public openGame(gameId) {
        AudioManager.getInstance().playClick();
        this.main.popupMiniGame?.hideListGame();

        if (this.main.currentGameRoomId === gameId) {
            return;
        }

        cc.RedT.inGame.outRoomGame().then(() => {
            sessionManager.removeInRoomGameId();
            this.openNewSocket(gameId);
        });
    }

    private openNewSocket(gameId) {
        this.socketIOController.closeSocket(gameId).then(() => {
            const gameServerUrl = buildServerUrl("http", "", gameId);
            const socket = this.openSocketByUri(gameId, gameServerUrl);
            this.handleSocket(socket, gameId);
            this.socketIOController.assignSocket(gameId, socket);
        });
    }

    public openSocketByUri(gameId, socketUri) {
        const gameName = GameUtils.getGameNameString(gameId);
        const proxyRoute = getProxyRoute(gameId);

        const option = {
            socketUri,
            gameName,
            proxyRoute,
            onConnectFailed: this.main.onConnectSocketFailed.bind(this.main),
            isGameRoom: true,
            forceNew: true,
            gameContainer: null,
            enableMsgpackParser: enableMsgpackParserAllGames
        };
        return this.socketIOController.connectGameSocket(option);
    }
}
