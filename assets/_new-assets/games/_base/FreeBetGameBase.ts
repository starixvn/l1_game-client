import BaseSocketIOController from "../../BaseSocketIOController";
import * as authManager from "../../common/auth/AuthManager";
import GameRoomBase from "./GameRoomBase";

export default class FreeBetGameBase extends GameRoomBase {
    private isFreeBet: boolean;

    protected socket: SocketIOClient.Socket;

    constructor() {
        super();

        this.isFreeBet = false;
    }

    onLoad() {
        super.onLoad();

        authManager.storeInRoomGameId(this.gameId);
        this.currentMiniPanel.currentGameRoomId = this.gameId;

        this.socket = BaseSocketIOController.getInstance().gameSockets[this.gameId];
        this.socket.on(this.gameName, (data) => {
            this.onDataGameRoom(data);
        });
        this.socket.on('disconnect', () => { this.closeGame(); });
    }

    start() {
        cc.RedT.send({ scene: this.gameName });
        this.socket.emit('inGame');
    }

    onDestroy() {
        super.destroy();
        BaseSocketIOController.getInstance().closeSocket(this.gameId);
    }

    onChangeWalletClick() {
        this.isFreeBet = !this.isFreeBet;
    }

    onBetItemClick(event: cc.Event) {
        if (this.isDisableGame) {
            return;
        }

        if (this.waitingProcessing) {
            this.showProcessingWarning(true);
        }
        else {
            this.waitingProcessing = true;
            const betData = {
                amount: this.currentBet,
                betChoice: event.target.name,
                freeBet: this.isFreeBet
            };
            this.socket && this.socket.emit("bet", betData);
        }
    }
}