import { Socket } from "socket.io-client";

import { buildServerUrl } from "../.././common/helpers/UrlHelper";
import * as sessionManager from "../../common/auth/SessionManager";
import MiniPanelSocketIOInitializers from "./MiniPanelSocketIOInitializers";

export default class MiniPanelSocketIOGameInitializers extends MiniPanelSocketIOInitializers {
    public openGame(gameId) {
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
            let socket: Socket = this.socketIOController.getSocketGame(gameId);
            const multiplay = this.socketIOController.isMultiplayGame(gameId);
            if (socket && !socket.connected && multiplay) {
                socket.removeAllListeners();
                socket.connect();
            }

            if (!socket) {
                const gameServerUrl = buildServerUrl("http", "", gameId);
                socket = this.socketIOController.createSocketByUrl(gameId, gameServerUrl);
            }
            this.socketIOController.initBaseListenersForSocketUrl(socket, gameId, this.main.onConnectSocketFailed.bind(this.main));
            this.handleSocket(socket, gameId);
            this.socketIOController.assignSocket(gameId, socket);
        });
    }
}
