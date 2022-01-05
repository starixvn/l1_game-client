import GameUtils from "../../../common/GameUtils";
import * as i18n from "i18n/runtime-scripts/LanguageData";
import { convertOldRank } from "../components/cards/view-models/CardWrapper";
const { ccclass, property } = cc._decorator;

@ccclass
export default class HoldemPockerMD5 extends cc.Component {
    @property(cc.Label)
    md5Text: cc.Label = null;

    @property(cc.Label)
    md5Value: cc.Label = null;

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

    enableCopyButton(enabled = true) {
        this.copyButton.interactable = enabled;
        const color = cc.Color.WHITE;
        this.copyButton.node.getChildByName("text").color = enabled ? color : color.fromHEX("#a8a8a8");
        this.md5Value.node.opacity = enabled ? 255 : 150;
    }

    setIsFold(value: boolean) {
        this.isFold = value;
    }

    updateMD5String(md5: string) {
        this.md5Value.string = md5;
    }

    resetDefaultValue(data: string, isMD5Key: boolean) {
        this.updateMD5String(data);
        this.md5Key = isMD5Key;
        this.md5Text.string = isMD5Key ? "Key" : "MD5";
        this.enableCopyButton(false);
        this.md5Value.node.destroyAllChildren();
    }

    setMD5String(data: string) {
        this.updateMD5String(data);
        this.enableCopyButton();
        this.md5CopyString = data;
    }

    setMD5Key(data: any) {
        if (this.isFold) {
            this.updateMD5String(i18n.t("holdEmPoker.md5String"));
            this.enableCopyButton(false);
            return;
        }

        this.md5Value.string = i18n.t("holdEmPoker.md5Key");
        cc.tween(this.md5Value.node)
            .delay(2)
            .call(() => {
                this.createResultDetails(data.formatValue);
                this.enableCopyButton();
            })
            .start();
        this.md5CopyString = data.rawValue;
    }

    createResultDetails(data: any) {
        const { cards, suffix } = data;
        const layoutComp = this.md5Value.getComponent(cc.Layout);
        this.md5Value.string = "";
        this.md5Text.string = "Key";
        const color = cc.Color.WHITE;
        cards.forEach((card, index) => {
            const prefix = index === 0 ? "[" : "";
            const sufffix = index === cards.length - 1 ? "]" : "";
            const comma = index === cards.length - 1 ? "" : ",";
            const cardLabel = this.createResultLabel(`${prefix}${convertOldRank(card.rank)}${comma}${sufffix}`);
            cardLabel.node.color = card.suit > 1 ? cc.Color.BLACK : color.fromHEX("#E92E2E");
            this.md5Value.node.addChild(cardLabel.node);
        });
        const suffixLabel = this.createResultLabel(suffix);
        this.md5Value.node.addChild(suffixLabel.node);
        layoutComp.updateLayout();
    }

    createResultLabel(value: string): cc.Label {
        const cardLabel = new cc.Node().addComponent(cc.Label);
        cardLabel.fontSize = 17;
        cardLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
        cardLabel.string = value;
        cardLabel.font = this.md5Value.font;
        return cardLabel;
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
