import { Socket } from "socket.io-client";

import * as sessionManager from "../../common/auth/SessionManager";
import WebSocketTableGameBase from "./WebSocketTableGameBase";

const { ccclass } = cc._decorator;

@ccclass
export default class SocketIOTableGameBase extends WebSocketTableGameBase {
    protected socket: Socket;

    onLoad() {
        super.onLoad();

        sessionManager.storeInRoomGameId(this.gameId);
        this.initForSocket();
    }

    initForSocket() {
        this.socket = this.socketIOController.getSocketGame(this.gameId);
        if (!this.socket) {
            this.closeGame();
        } else {
            this.socket.on(this.gameName, (data) => {
                if (!this.isAlive()) {
                    return;
                }
                this.onDataGameRoom(data);
            });
            this.socket.on("disconnect", () => {
                if (!this.isAlive()) {
                    return;
                }
                this.closeGame();
            });
            this.socket.on("message", (data) => {
                if (!this.isAlive()) {
                    return;
                }
                this.currentMiniPanel.onGeneralData(data);
            });
        }
    }

    protected override onGameShow() {
        this.startGame();
        // dont registerViewGame here
        // this.registerViewGame();
    }

    public registerViewGame() {
        this.socket && this.socket.connected && this.socket.emit("inGame");
    }

    onDestroy() {
        super.onDestroy();
        this.socketIOController.closeSocket(this.gameId);
    }

    onDisconnected() {
        // keep in room game when main socket was disconnected
    }

    onData(data) {
        if (!this.isAlive()) {
            return;
        }
        this.currentMiniPanel.onGeneralData(data);
        this.onDataGameRoomGeneral(data);
    }

    onDataGameRoom(data) {
        if (data.history && this.historyComponent && this.historyComponent.node) {
            this.historyComponent.onData(data.history);
        }
        this.onDataGameRoomGeneral(data);
        super.onDataGameRoom(data);
        !data.notice && this.currentMiniPanel.onGeneralData(data);
    }

    onBetItemClick(event) {
        if (!this.isReadyBet()) {
            return;
        }

        if (this.waitingProcessing) {
            this.showProcessingWarning(true);
        } else {
            this.lockBet();
            const betData = this.createCommonBetData();
            betData["betChoice"] = event.target.name;
            this.socket && this.socket.connected && this.socket.emit("bet", betData);
        }
    }

    createCommonBetData() {
        return {
            amount: this.currentBet,
            username: cc.RedT.user.name
        };
    }

    onCloseGameClick() {
        super.onCloseGameClick();
        sessionManager.removeInRoomGameId();
    }

    sendRetryMessage(): void {
        if (this.socket) {
            this.socket.emit("retry");
        }
    }

    outRoomGame(): Promise<void> {
        this.socketIOController.closeSocket(this.gameId);
        return super.outRoomGame();
    }
}
