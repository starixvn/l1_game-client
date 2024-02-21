import BehaviorClickButton from "../../../../common/BehaviorClickButton";
import GameUtils from "../../../../common/GameUtils";
import CommonDialog from "../../../../common/_base/view-models/CommonDialog";

const { ccclass, property } = cc._decorator;

export interface IProvablyFairVerify {
    hash: string;
    clientSeed: number;
    serverSeed: string;
    finalResult: string;
    handIds: string;
}

export const OPEN_PROVABLY_FAIR_VERIFY = " open_provably_fair_verify";
export const PF_MAX_CHARACTER_DISPLAY = 70;

@ccclass
export default class ProvablyFairVerifyComponent extends cc.Component {
    @property(cc.Label)
    serverSeedLbl: cc.Label = null;

    @property(cc.Label)
    clientSeedLbl: cc.Label = null;

    @property(cc.Label)
    serverSeedSHA256Lbl: cc.Label = null;

    @property(cc.Label)
    finalResultLbl: cc.Label = null;

    @property(CommonDialog)
    commonDialog: CommonDialog = null;

    @property(cc.Node)
    verifySuccess: cc.Node = null;

    @property(BehaviorClickButton)
    verifyBtn: BehaviorClickButton = null;

    protected serverSeedCopyString = "";
    protected hashCopyString = "";
    protected finalResultCopyString = "";
    protected timeout: NodeJS.Timeout;
    readonly delayShowHashValue: number = 1.35;

    onLoad() {
        this.commonDialog.addOnDidHide(() => {
            this.statusNode(false);
            this.verifySuccess.active = false;
        });

        this.verifySuccess.active = false;
        this.verifyBtn.updateState(true);
    }

    onShow() {
        this.statusNode(true);
        this.commonDialog.showDialog();
        this.setStatusVerifyButton(false);
    }

    onHide() {
        this.commonDialog.closeDialogWithoutAnim();
        this.statusNode(false);
    }

    statusNode(active: boolean) {
        this.node.active = active;
    }

    onCopyServerSeed() {
        GameUtils.copyText(this.serverSeedCopyString);
    }

    onCopyHash() {
        GameUtils.copyText(this.hashCopyString);
    }

    onCopyFinalResult() {
        GameUtils.copyText(this.finalResultCopyString);
    }

    onCloseClick() {
        this.commonDialog.closeDialog();
    }

    onClickVerify() {
        this.setStatusVerifyButton(true);
    }

    truncateString(value: string) {
        return value?.substring(0, PF_MAX_CHARACTER_DISPLAY) || "";
    }

    setStatusVerifyButton(status: boolean) {
        this.verifySuccess.active = status;
        this.verifyBtn.updateState(status);
    }
}
