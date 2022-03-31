import { Socket } from "socket.io-client";

import { numberWithCommas } from "../../common/helpers/NumberHelper";
import MultiOrientationGame from "./MultiOrientationGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FreeBetGameBase extends MultiOrientationGame {
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

    private isFreeBet = false;
    private isFocusScoin = false;

    protected socket: Socket;

    onChangeWalletClick(e, isFreeBet) {
        if (this.gameConfigs.enableFreeBet) {
            this.isFreeBet = isFreeBet === "true";

            this.focusWallet(this.isFreeBet);
        }
    }

    public updateDisplayForRemoteConfig(): void {
        super.updateDisplayForRemoteConfig();
        if (cc.RedT.user.scoins) {
            this.updateDisplayScoinUI(cc.RedT.user.scoins);
        }
    }

    updateDisplayScoinUI(scoins) {
        if (this.gameConfigs && this.gameConfigs.enableFreeBet) {
            this.userSCoin.string = numberWithCommas(scoins);
            if (!this.isFocusScoin && scoins > 0) {
                this.isFocusScoin = true;
                this.isFreeBet = true;
                this.scoinNode.active = true;

                this.updateWalletWidth();
                const walletLayout = this.walletNode.getComponent(cc.Layout);
                this.walletNode.getComponent(cc.Layout).enabled = true;
                walletLayout.updateLayout();
                this.focusWallet(this.isFreeBet);
            }
        }
    }

    loadUserData(user) {
        super.loadUserData(user);
        if (void 0 !== user.scoins) {
            this.updateDisplayScoinUI(user.scoins);
        }
    }

    focusWallet(isFreeBet: boolean) {
        this.walletNode.getComponent(cc.Layout).enabled = false;
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

    createCommonBetData() {
        const betData = super.createCommonBetData();
        betData["freeBet"] = this.isFreeBet;
        return betData;
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
