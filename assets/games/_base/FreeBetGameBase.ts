import { Socket } from "socket.io-client";

import { numberWithCommas } from "../../common/helpers/NumberHelper";
import MultiOrientationGame from "./MultiOrientationGame";
import SedieWallet from "../sedie/view-models/SedieWallet";
import { Orientation } from "./Orientation";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FreeBetGameBase extends MultiOrientationGame {
    @property(cc.Node)
    walletWrapper: cc.Node = null;

    @property(SedieWallet)
    dollarWallet: SedieWallet = null;

    @property(SedieWallet)
    userScoinWallet: SedieWallet = null;

    private isFreeBet = false;
    private isFocusScoin = false;
    protected socket: Socket;
    protected wrapperLayout: cc.Layout = null;

    onLoad() {
        super.onLoad();
        this.loadDollarWalletUI();
    }

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
            this.userScoinWallet.balance.string = numberWithCommas(scoins);
            if (!this.isFocusScoin && scoins > 0) {
                this.isFocusScoin = true;
                this.isFreeBet = true;

                this.walletWrapper.getComponent(cc.Sprite).enabled = false;
                this.wrapperLayout.enabled = true;
                this.wrapperLayout.updateLayout();
                this.userScoinWallet.node.active = true;

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

    loadDollarWalletUI() {
        this.wrapperLayout = this.walletWrapper.getComponent(cc.Layout);
        this.dollarWallet.node.active = true;
        this.dollarWallet.overlay.active = false;
        this.userScoinWallet.node.active = false;

        if (this.orientation === Orientation.Landscape) {
            this.walletWrapper.getComponent(cc.Sprite).enabled = true;
            this.wrapperLayout.enabled = false;
            this.walletWrapper.width = 175;
        } else {
            this.dollarWallet.showActiveBackground(false);
        }
    }

    focusWallet(isFreeBet: boolean) {
        this.wrapperLayout.enabled = isFreeBet;
        this.userScoinWallet.focus(isFreeBet);
        this.dollarWallet.focus(!isFreeBet);
    }

    createCommonBetData() {
        const betData = super.createCommonBetData();
        betData["freeBet"] = this.isFreeBet;
        return betData;
    }
}
