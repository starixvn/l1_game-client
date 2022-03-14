import * as i18n from "i18n/runtime-scripts/LanguageData";

import EffectAppearanceLabel from "../../../common/EffectAppearanceLabel";
import GameUtils from "../../../common/GameUtils";
import { convertOldRank } from "../components/cards/view-models/CardWrapper";

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

    /*createResultDetails(data: any) {
        const { cards, suffix } = data.formatValue;
        this.setCaptionAndHintForMD5(true);
        this.setCopyString(data.rawValue);

        let resultFormatting = "";
        cards.forEach((card, index) => {
            const startSquareBracket = index === 0 ? `<color=#ffffff>[</color>` : "";
            const endSquareBracket = index === cards.length - 1 ? `<color=#ffffff>]</color>` : "";
            const comma = index === cards.length - 1 ? "" : index === 1 || index === 3 ? `<color=#ffffff>, </color>` : " ";
            const cardValue =
                card.suit > 1
                    ? `<color=#000000>${convertOldRank(card.rank)}</color>`
                    : `<color=#E92E2E>${convertOldRank(card.rank)}</color>`;
            resultFormatting += `${startSquareBracket}${cardValue}${comma}${endSquareBracket}`;
        });
        const suffixFormatting = `<color=#ffffff>${suffix}</color>`;
        this.md5Value.string = `${resultFormatting}${suffixFormatting}`;
    }*/

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
