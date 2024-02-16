import EffectAppearanceLabel from "../../../../common/EffectAppearanceLabel";
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

@ccclass
export default class ProvablyFairVerifyComponent extends cc.Component {
    @property(EffectAppearanceLabel)
    clientSeed: EffectAppearanceLabel = null;

    @property(EffectAppearanceLabel)
    serverSeed: EffectAppearanceLabel = null;

    @property(cc.Button)
    serverSeedCopyBtn: cc.Button = null;

    @property(EffectAppearanceLabel)
    hashLabel: cc.Label = null;

    @property(cc.Button)
    hashCopyBtn: cc.Button = null;

    @property(EffectAppearanceLabel)
    finalResultLabel: cc.Label = null;

    @property(cc.Button)
    finalResultCopyBtn: cc.Button = null;

    @property(cc.Label)
    handIdsLabel: cc.Label = null;

    @property(cc.Node)
    verifySuccess: cc.Node = null;

    @property(cc.Button)
    verifyBtn: cc.Button = null;

    @property(CommonDialog)
    commonDialog: CommonDialog = null;

    lengthOfPF = 21;

    serverSeedCopyString = "";

    hashCopyString = "";

    finalResultCopyString = "";

    readonly delayShowHashValue: number = 1.35;
    protected timeout: NodeJS.Timeout;
    maximumStringAllowed = 32;

    onLoad() {
        this.commonDialog.addOnDidHide(() => {
            this.statusNode(false);
            this.verifySuccess.active = false;
        });
    }

    onShow() {
        this.statusNode(true);
        this.commonDialog.showDialog();
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
            this.clientSeed.string = data.clientSeed.toString();

            this.serverSeed.string = this.generateShortString(data?.serverSeed, 10);
            this.serverSeedCopyString = data?.serverSeed;

            this.hashLabel.string = this.generateShortString(data?.hash);
            this.hashCopyString = data?.hash;

            this.finalResultLabel.string = this.generateShortString(data?.finalResult);
            this.finalResultCopyString = data?.finalResult;

            this.handIdsLabel.string = data?.handIds;
            this.node.emit(OPEN_PROVABLY_FAIR_VERIFY);
        }
    }

    generateShortString(value: string, length?: number) {
        return value.length > this.maximumStringAllowed ? value.slice(0, length ?? this.lengthOfPF) + "..." : value;
    }

    onCloseClick() {
        this.commonDialog.closeDialog();
    }

    onClickVerify() {
        this.verifySuccess.active = true;
    }
}
