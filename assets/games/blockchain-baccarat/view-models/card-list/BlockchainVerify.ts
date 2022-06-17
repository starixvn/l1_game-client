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

    setText(text: string) {
        this.text.string = text;
    }

    enableVerifyButton(enabled: boolean) {
        this.setText(i18n.t("blockchainBaccarat.verify"));
        this.btnVerify.interactable = enabled;
        enabled
            ? (this.btnVerify.node.getChildByName("btn-active").active = true)
            : (this.btnVerify.node.getChildByName("btn-disable").active = true);
    }

    setVerifySuccess(highlight: boolean) {
        this.btnVerify.node.getChildByName("btn-active").active = false;
        if (highlight) {
            this.success.active = true;
            this.isSuccessfull = true;
            this.setText(i18n.t("blockchainBaccarat.verifySuccess"));
        } else {
            this.failed.active = true;
            this.setText(i18n.t("blockchainBaccarat.verifyFailed"));
        }
    }
}
