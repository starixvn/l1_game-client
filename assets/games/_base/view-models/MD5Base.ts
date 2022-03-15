import * as i18n from "i18n/runtime-scripts/LanguageData";
import EffectAppearanceLabel from "../../../common/EffectAppearanceLabel";
import GameUtils from "../../../common/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MD5Base extends cc.Component {
    @property(cc.Label)
    md5Text: cc.Label = null;

    @property(EffectAppearanceLabel)
    md5Value: EffectAppearanceLabel = null;

    @property(cc.Button)
    copyButton: cc.Button = null;

    @property(cc.Node)
    hintCopyNode: cc.Node = null;

    private md5CopyString: string = null;

    onLoad() {
        const hintLabel = this.hintCopyNode.getChildByName("content").getComponent(cc.Label);
        hintLabel.string = i18n.t("messages.copy_success");
        this.setCaptionAndHintForMD5(false);
        this.enableCopyButton(false);
        this.showHint = this.showHint.bind(this);
    }

    enableCopyButton(enabled: boolean) {
        this.copyButton.interactable = enabled;
        const color = cc.Color.WHITE;
        this.copyButton.node.getChildByName("text").color = enabled ? color : color.fromHEX("#a8a8a8");
    }

    clearMD5() {
        this.updateMD5String("");
    }

    updateMD5String(data: any) {
        this.setCaptionAndHintForMD5(!!data.rawValue);
        this.md5Value.string = `<color=#ffffff>${data.hashValue || data.rawValue}</color>`;
        this.setCopyString(data.hashValue || data.rawValue);
    }

    setCopyString(text: string) {
        this.md5CopyString = text;
        this.enableCopyButton(text.length > 0);
    }

    onClickCopyButton() {
        GameUtils.copyToClipboard(this.md5CopyString, this.showHint);
    }

    showHint() {
        cc.tween(this.hintCopyNode).to(0.2, { opacity: 255 }).delay(1).to(0.1, { opacity: 0 }).start();
    }

    setCaptionAndHintForMD5(isMD5Key: boolean) {
        if (isMD5Key) {
            this.md5Text.string = i18n.t("ui.result");
        } else {
            this.md5Text.string = i18n.t("holdEmPoker.md5String");
        }
    }
}
