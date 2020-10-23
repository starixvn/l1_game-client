import BaseSocketIOController from "../../BaseSocketIOController";
import * as authManager from "../../common/auth/AuthManager";
import GameRoomBase from "./GameRoomBase";

const { ccclass } = cc._decorator;

@ccclass
export default class NewSocketGameBase extends GameRoomBase {
    protected socket: SocketIOClient.Socket;

    onLoad() {
        super.onLoad();

        authManager.storeInRoomGameId(this.gameId);
        this.currentMiniPanel.currentGameRoomId = this.gameId;

        this.socket = BaseSocketIOController.getInstance().gameSockets[this.gameId];
        this.socket.on(this.gameName, (data) => {
            if (!this.node.isValid) {
                return;
            }
            this.onDataGameRoom(data);
        });
        this.socket.on("disconnect", () => {
            if (!this.node.isValid) {
                return;
            }
            this.closeGame();
        });
    }

    start() {
        cc.RedT.send({ scene: this.gameName });
        this.socket.emit("inGame");
    }

    onDestroy() {
        super.destroy();
        BaseSocketIOController.getInstance().closeSocket(this.gameId);
    }

    onDisconnected() {
        // keep in room game when main socket was disconnected
    }

    onData(data) {
        this.currentMiniPanel.onGeneralData(data);
        this.onDataGameRoomGeneral(data);
    }

    onDataGameRoom(data) {
        super.onDataGameRoom(data);

        this.onDataGameRoomGeneral(data);
        !data.notice && this.currentMiniPanel.onGeneralData(data);
    }

    onBetItemClick(event) {
        if (this.isDisableGame) {
            return;
        }

        if (this.waitingProcessing) {
            this.showProcessingWarning(true);
        } else {
            this.waitingProcessing = true;
            const betData = {
                amount: this.currentBet,
                betChoice: event.target.name,
            };
            this.socket && this.socket.emit("bet", betData);
        }
    }

    onCloseGameClick() {
        super.onCloseGameClick();
        authManager.removeInRoomGameId();
    }
}
