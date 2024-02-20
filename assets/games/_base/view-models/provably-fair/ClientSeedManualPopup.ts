import CommonDialog from "../../../../common/_base/view-models/CommonDialog";
import ProvablyFairComponent from "./ProvablyFairComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClientSeedManualPopup extends cc.Component {
    @property(CommonDialog)
    commonDialog: CommonDialog = null;

    @property(cc.Label)
    lblClientSeed: cc.Label = null;

    @property(cc.Label)
    lblClientSeedRange: cc.Label = null;

    @property(cc.Button)
    btnClear: cc.Button = null;

    @property(cc.Node)
    nodeClearDisabled: cc.Node = null;

    @property()
    clientSeedMax = 103;

    private readonly CLIENT_SEED_CHAR = 4;
    public provablyFairComponent: ProvablyFairComponent = null;

    callbackOpenGuide = () => {
        // handle
    };

    callbackUpdateClientSeed = (value: string) => {
        // handle
    };

    onLoad() {
        this.commonDialog.addOnDidHide(() => {
            this.node.destroy();
        });
    }

    initClientSeedManualPopup(data: { clientSeedRange: string; clientSeed: string }) {
        this.updateClientSeedRange(data?.clientSeedRange);
        this.setClientSeedValue(data?.clientSeed);
    }

    closePopup() {
        this.commonDialog.closeDialog();
    }

    setClientSeedValue(value: string) {
        this.lblClientSeed.string = value;
    }

    getClientSeed() {
        return this.lblClientSeed.string;
    }

    addValue(event, value) {
        const clientSeed = this.lblClientSeed.string;
        const clientSeedMax = parseInt(this.clientSeedMax.toString());
        const maxCharacters = this.clientSeedMax.toString().length;
        const newValue = `${clientSeed}${parseInt(value)}`;
        if (+newValue <= clientSeedMax && newValue.length <= maxCharacters) {
            this.lblClientSeed.string = newValue.toString();
        }

        this.updateStateClearButton(this.lblClientSeed.string.trim() === "");
    }

    onClickClear() {
        this.lblClientSeed.string = "";
        this.updateStateClearButton(true);
    }

    onClickRemoveLastLetter() {
        let multiplierString = this.lblClientSeed.string.slice(0, -1);
        if (!multiplierString) {
            multiplierString = "";
            this.updateStateClearButton(true);
        }

        this.lblClientSeed.string = multiplierString;
    }

    onClickSaveBtn() {
        this.callbackUpdateClientSeed && this.callbackUpdateClientSeed(this.lblClientSeed.string);
        this.closePopup();
    }

    updateClientSeedRange(value: string) {
        this.lblClientSeedRange.string = value;
    }

    onOpenGuide() {
        this.callbackOpenGuide && this.callbackOpenGuide();
    }

    updateStateClearButton(state: boolean) {
        this.btnClear.interactable = !state;
        this.nodeClearDisabled.active = state;
    }
}
