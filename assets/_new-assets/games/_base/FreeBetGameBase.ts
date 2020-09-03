import BaseSocketIOController from "../../BaseSocketIOController";
import * as authManager from "../../common/auth/AuthManager";
import { numberWithCommas } from "../../common/helpers/Helper";
import GameRoomBase from "./GameRoomBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FreeBetGameBase extends GameRoomBase {
    @property(cc.Label)
    userSCoin: cc.Label = null;

    @property(cc.SpriteFrame)
    dollarBackground: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    scoinBackground: cc.SpriteFrame = null;

    @property(cc.Node)
    walletNode: cc.Node = null;

    @property(cc.Node)
    dollarNode: cc.Node = null;

    @property(cc.Node)
    scoinNode: cc.Node = null;

    private isFreeBet: boolean = false;
    private scoin: number = 0;

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

    onData(data) {
        this.currentMiniPanel.onGeneralData(data);
        this.onDataGameRoomGeneral(data);
    }

    onDataGameRoom(data) {
        this.onDataGameRoomGeneral(data);
        !data.notice && cc.RedT.MiniPanel.onGeneralData(data);

        super.onDataGameRoom(data);
    }

    onChangeWalletClick(e, isFreeBet) {
        this.isFreeBet = isFreeBet == "true";

        this.focusWallet(this.isFreeBet);
    }

    loadUserData(user) {
        super.loadUserData(user);
        this.scoin = user.scoins;

        if (void 0 !== this.scoin) {
            this.userSCoin.string = numberWithCommas(user.scoins);

            if (this.scoin > 0) {
                this.isFreeBet = true;
                this.scoinNode.active = true;
                this.focusWallet(this.isFreeBet);
            }
        }
    }

    focusWallet(isFreeBet: boolean) {
        if (isFreeBet) {
            this.scoinNode.active = true;
            this.scoinNode.getChildByName("overlay").active = false;
            this.dollarNode.getChildByName("overlay").active = true;
        } else {
            this.scoinNode.getChildByName("overlay").active = true;
            this.dollarNode.getChildByName("overlay").active = false;
            if (this.scoin > 0) {
                this.dollarNode.getChildByName("active").active = true;
            }
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