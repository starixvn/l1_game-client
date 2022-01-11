import GameUtils from "../../../common/GameUtils";
import * as i18n from "i18n/runtime-scripts/LanguageData";
import { convertOldRank } from "../components/cards/view-models/CardWrapper";
const { ccclass, property } = cc._decorator;

@ccclass
export default class HoldemPockerMD5 extends cc.Component {
    @property(cc.Label)
    md5Text: cc.Label = null;

    @property(cc.RichText)
    md5Value: cc.RichText = null;

    @property(cc.Button)
    copyButton: cc.Button = null;

    @property(cc.Node)
    hintCopyNode: cc.Node = null;

    private md5CopyString: string = null;
    private md5Key = false;
    private isFold = false;

    start() {
        this.resetDefaultValue(i18n.t("holdEmPoker.md5String"), false);
    }

    enableCopyButton(enabled: boolean) {
        this.copyButton.interactable = enabled;
        const color = cc.Color.WHITE;
        this.copyButton.node.getChildByName("text").color = enabled ? color : color.fromHEX("#a8a8a8");
        this.md5Value.node.opacity = enabled ? 255 : 150;
    }

    setIsFold(value: boolean) {
        this.isFold = value;
    }

    updateMD5String(md5: string) {
        this.md5Value.string = `<color=#ffffff>${md5}</color>`;
    }

    resetDefaultValue(data: string, isMD5Key: boolean) {
        this.updateMD5String(data);
        this.md5Key = isMD5Key;
        this.md5Text.string = isMD5Key ? "Key" : "MD5";
        this.enableCopyButton(false);
    }

    setMD5String(data: string) {
        this.updateMD5String(data);
        this.enableCopyButton(true);
        this.md5CopyString = data;
    }

    setMD5Key(data: any) {
        if (this.isFold) {
            this.updateMD5String(i18n.t("holdEmPoker.md5String"));
            this.enableCopyButton(false);
            return;
        }
        this.updateMD5String(i18n.t("holdEmPoker.md5Key"));
        cc.tween(this.md5Value.node)
            .delay(2)
            .call(() => {
                this.createResultDetails(data.formatValue);
                this.enableCopyButton(true);
            })
            .start();
        this.md5CopyString = data.rawValue;
    }

    createResultDetails(data: any) {
        const { cards, suffix } = data;
        this.md5Value.string = "";
        this.md5Text.string = "Key";
        let resultFormatting = "";
        cards.forEach((card, index) => {
            const startSquareBracket = index === 0 ? `<color=#ffffff>[</color>` : "";
            const endSquareBracket = index === cards.length - 1 ? `<color=#ffffff>]</color>` : "";
            const comma = index === cards.length - 1 ? "" : `<color=#ffffff>,</color>`;
            const cardValue =
                card.suit > 1
                    ? `<color=#000000>${convertOldRank(card.rank)}</color>`
                    : `<color=#E92E2E>${convertOldRank(card.rank)}</color>`;
            resultFormatting += `${startSquareBracket}${cardValue}${comma}${endSquareBracket}`;
        });
        const suffixFormatting = `<color=#ffffff>${suffix}</color>`;
        this.md5Value.string = `${resultFormatting}${suffixFormatting}`;
    }

    onClickCopyButton() {
        GameUtils.copyToClipboard(this.md5CopyString);
        this.updateCopyHint();
    }

    updateCopyHint() {
        this.hintCopyNode.getChildByName("content").getComponent(cc.Label).string = this.md5Key
            ? i18n.t("messages.copyKeySuccess")
            : i18n.t("messages.copyMD5Success");
        cc.tween(this.hintCopyNode).to(0.2, { opacity: 255 }).delay(1).to(0.1, { opacity: 0 }).start();
    }
}
