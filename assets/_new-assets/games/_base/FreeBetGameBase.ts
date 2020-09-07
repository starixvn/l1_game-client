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
    private isFocusScoin: boolean = false;

    protected socket: SocketIOClient.Socket;

    onLoad() {
        super.onLoad();

        authManager.storeInRoomGameId(this.gameId);
        this.currentMiniPanel.currentGameRoomId = this.gameId;

        this.socket = BaseSocketIOController.getInstance().gameSockets[this.gameId];
        this.socket.on(this.gameName, (data) => {
            this.onDataGameRoom(data);
        });
        this.socket.on("disconnect", () => {
            this.closeGame();
        });
        this.focusWallet(this.isFreeBet);
    }

    start() {
        cc.RedT.send({ scene: this.gameName });
        this.socket.emit("inGame");

        this.updateWalletWidth();

        const walletLayout = this.walletNode.getComponent(cc.Layout);
        walletLayout.updateLayout();
        walletLayout.enabled = false;
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
        if (this.gameConfigs.enableFreeBet) {
            this.isFreeBet = isFreeBet == "true";

            this.focusWallet(this.isFreeBet);
        }
    }

    loadUserData(user) {
        super.loadUserData(user);

        if (void 0 !== user.scoins && this.gameConfigs && this.gameConfigs.enableFreeBet) {
            this.userSCoin.string = numberWithCommas(user.scoins);

            if (!this.isFocusScoin && user.scoins > 0) {
                this.isFocusScoin = true;
                this.isFreeBet = true;
                this.scoinNode.active = true;
                this.focusWallet(this.isFreeBet);
            }
        }
    }

    focusWallet(isFreeBet: boolean) {
        const walletSprite = this.walletNode.getComponent(cc.Sprite);
        const dollarActiveNode = this.dollarNode.getChildByName("active");

        this.scoinNode.getChildByName("active").active = isFreeBet;
        this.scoinNode.getChildByName("overlay").active = !isFreeBet;
        this.dollarNode.getChildByName("overlay").active = isFreeBet;
        dollarActiveNode.active = false;
        walletSprite.spriteFrame = this.dollarBackground;

        if (isFreeBet) {
            this.scoinNode.zIndex = 2;
            this.dollarNode.zIndex = 1;
        } else {
            walletSprite.spriteFrame = this.scoinNode.active ? this.scoinBackground : this.dollarBackground;
            dollarActiveNode.active = this.scoinNode.active ? true : false;
            this.scoinNode.zIndex = 1;
            this.dollarNode.zIndex = 2;
        }
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
                freeBet: this.isFreeBet,
            };
            this.socket && this.socket.emit("bet", betData);
        }
    }

    updateWalletWidth() {
        const activeDollarWidth = this.dollarNode.getChildByName("active").width;
        const dollarLblWidth = this.userBalance.node.width;
        const activeScoinWidth = this.scoinNode.getChildByName("active").width;
        const scoinLblWidth = this.userSCoin.node.width;

        this.dollarNode.width = dollarLblWidth > activeDollarWidth ? dollarLblWidth + 20 : activeDollarWidth;
        this.scoinNode.width = scoinLblWidth > activeScoinWidth ? scoinLblWidth + 20 : activeScoinWidth;
    }
}
