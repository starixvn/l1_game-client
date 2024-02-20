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

    @property(cc.Label)
    handIdsLbl: cc.Label = null;

    @property(cc.Node)
    verifySuccess: cc.Node = null;

    @property(cc.Button)
    verifyBtn: cc.Button = null;

    @property(cc.Node)
    disableVerifyBtn: cc.Node = null;

    @property(CommonDialog)
    commonDialog: CommonDialog = null;

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
        this.disableVerifyBtn.active = false;
        this.verifySuccess.active = false;
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

    updateProvablyFairVerify(data: IProvablyFairVerify) {
        if (!this.node.activeInHierarchy && this.node?.isValid) {
            this.clientSeedLbl.string = this.formatValue(data?.clientSeed.toString());

            this.serverSeedLbl.string = data?.serverSeed.toString();
            this.serverSeedCopyString = data?.serverSeed;

            this.serverSeedSHA256Lbl.string = data?.hash.toString();
            this.hashCopyString = data?.hash;

            this.finalResultLbl.string = this.formatValue(data?.finalResult.toString());
            this.finalResultCopyString = data?.finalResult;

            this.handIdsLbl.string = data?.handIds
                ?.split(",")
                .map((val) => val.trim())
                .join(", ");
            this.node.emit(OPEN_PROVABLY_FAIR_VERIFY);
        }
    }

    onCloseClick() {
        this.commonDialog.closeDialog();
    }

    onClickVerify() {
        this.setStatusVerifyButton(true);
    }

    setStatusVerifyButton(status: boolean) {
        this.verifySuccess.active = status;
        this.disableVerifyBtn.active = status;
        this.verifyBtn.interactable = !status;
    }

    formatValue(value: string) {
        return value?.substring(0, PF_MAX_CHARACTER_DISPLAY) || "";
    }
}
