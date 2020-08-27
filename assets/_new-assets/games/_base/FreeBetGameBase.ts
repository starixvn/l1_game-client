import BaseSocketIOController from "../../BaseSocketIOController";
import * as authManager from "../../common/auth/AuthManager";
import { numberWithCommas } from "../../common/helpers/Helper";
import GameRoomBase from "./GameRoomBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FreeBetGameBase extends GameRoomBase {
    @property(cc.Label)
    userSCoin: cc.Label = null;

    private isFreeBet: boolean = false;

    protected socket: SocketIOClient.Socket;


    onLoad() {
        super.onLoad();

        authManager.storeInRoomGameId(this.gameId);
        this.currentMiniPanel.currentGameRoomId = this.gameId;

        this.socket = BaseSocketIOController.getInstance().gameSockets[this.gameId];
        this.socket.on(this.gameName, (data) => {
            this.onDataGameRoom(data);
        });
        this.socket.on('disconnect', () => { this.closeGame(); });
        this.focusWallet(this.isFreeBet);
    }

    start() {
        cc.RedT.send({ scene: this.gameName });
        this.socket.emit('inGame');
    }

    onDestroy() {
        super.destroy();
        BaseSocketIOController.getInstance().closeSocket(this.gameId);
    }

    onDataGameRoom(data) {
        this.onDataGameRoomGeneral(data);

        super.onDataGameRoom(data);
    }

    onChangeWalletClick() {
        this.isFreeBet = !this.isFreeBet;

        this.focusWallet(this.isFreeBet);
    }

    loadUserData(user) {
        super.loadUserData(user);
        if (void 0 !== user.scoins) {
            this.isFreeBet = true;
            this.userSCoin.string = numberWithCommas(user.scoins);
            this.focusWallet(this.isFreeBet);
        }
    }

    focusWallet(isFreeBet: boolean) {
        if (isFreeBet) {
            this.userSCoin.node.parent.zIndex = 2;
            this.userSCoin.node.parent.scale = 1.25;
            this.userBalance.node.parent.zIndex = 1;
            this.userBalance.node.parent.scale = 1;
        } else {
            this.userSCoin.node.parent.zIndex = 1;
            this.userSCoin.node.parent.scale = 1;
            this.userBalance.node.parent.zIndex = 2;
            this.userBalance.node.parent.scale = 1.25;
        }
    }

    onBetItemClick(event) {
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