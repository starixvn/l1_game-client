import * as i18n from "i18n/runtime-scripts/LanguageData";
import EffectAppearanceLabel from "../../../common/EffectAppearanceLabel";
import GameUtils from "../../../common/GameUtils";
import { FormatMD5Result } from "../../_casino/MD5Format";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HoldemPockerMD5 extends cc.Component {
    @property(cc.Label)
    md5Text: cc.Label = null;

    @property(EffectAppearanceLabel)
    md5Value: EffectAppearanceLabel = null;

    @property(cc.Button)
    copyButton: cc.Button = null;

    @property(cc.Node)
    hintCopyNode: cc.Node = null;

    private md5CopyString: string = null;
    public hintLabel: cc.Label = null;

    onLoad() {
        this.hintLabel = this.hintCopyNode.getChildByName("content").getComponent(cc.Label);
        this.hintLabel.string = i18n.t("messages.copy_success");
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
        this.setMD5String("");
    }

    setMD5String(data: string) {
        this.setCaptionAndHintForMD5(false);
        this.md5Value.string = data === "" ? "" : `<color=#ffffff>${data}</color>`;
        this.setCopyString(data);
    }

    setCopyString(text: string) {
        this.md5CopyString = text;
        this.enableCopyButton(text.length > 0);
    }

    createResultDetails(data: any) {
        const { cards, suffix, roundId } = data.formatValue;
        this.setCaptionAndHintForMD5(true);
        this.setCopyString(data.rawValue);
        this.setMD5Value(cards, suffix, roundId);
    }

    setMD5Value(cards, suffix, roundId) {
        this.md5Value.string = FormatMD5Result({
            cards,
            suffix,
            firstCharacter: "[",
            endCharacter: "]",
            suitBlack: "#000000",
            suitRed: "#E92E2E",
            roundId
        });
    }

    onClickCopyButton() {
        GameUtils.copyToClipboard(this.md5CopyString, this.hintLabel, this.showHint);
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
