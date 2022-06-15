import { buildServerUrl } from "../.././common/helpers/UrlHelper";
import AudioManager from "../../common/audio/AudioManager";
import * as sessionManager from "../../common/auth/SessionManager";
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
            const socket = this.socketIOController.openSocketByUri(this.main, gameId, gameServerUrl);
            this.handleSocket(socket, gameId);
            this.socketIOController.assignSocket(gameId, socket);
        });
    }
}
