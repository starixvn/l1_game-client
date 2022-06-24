import * as i18n from "i18n/runtime-scripts/LanguageData";
const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainVerify extends cc.Component {
    @property(cc.Button)
    btnVerify: cc.Button = null;

    @property(cc.Node)
    success: cc.Node = null;

    @property(cc.Node)
    failed: cc.Node = null;

    @property(cc.Label)
    text: cc.Label = null;

    isSuccessfull = false;
    btnActive: cc.Node;
    btnDisable: cc.Node;

    setText(text: string) {
        this.text.string = text;
    }

    enableVerifyButton(enabled: boolean) {
        this.setText(i18n.t("blockchainBaccarat.verify"));
        this.btnActive = this.btnVerify.node.getChildByName("btn-active");
        this.btnDisable = this.btnVerify.node.getChildByName("btn-disable");
        this.btnVerify.interactable = enabled;
        this.success.active = this.failed.active = false;
        this.btnActive.active = enabled;
        this.btnDisable.active = !enabled;
    }

    setVerifySuccess(highlight: boolean) {
        this.setText("");
        this.btnActive.active = this.btnDisable.active = false;
        if (highlight) {
            this.success.active = true;
            this.isSuccessfull = true;
        } else {
            this.failed.active = true;
        }
    }
}
