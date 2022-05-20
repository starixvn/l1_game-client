import * as i18n from "i18n/runtime-scripts/LanguageData";
import EffectAppearanceLabel from "../../common/EffectAppearanceLabel";
import { OldCardModel } from "../../common/new-card/view-models/NewCard";
import { FormatMD5Result } from "./MD5Format";
import GameUtils from "../../common/GameUtils";
import MD5Tooltip from "../../common/md5-tooltip/MD5Tooltip";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CasinoMD5 extends cc.Component {
    @property(cc.Label)
    md5Text: cc.Label = null;

    @property(EffectAppearanceLabel)
    md5Value: EffectAppearanceLabel = null;

    @property(cc.Button)
    copyButton: cc.Button = null;

    @property(cc.Node)
    hintCopyNode: cc.Node = null;

    @property(cc.Prefab)
    md5TooltipPrefab: cc.Prefab = null;

    @property(cc.Node)
    md5TooltipContainer: cc.Node = null;

    private md5CopyString: string = null;
    protected md5Tooltip: MD5Tooltip = null;
    readonly maximumStringAllowed = 352;

    onLoad() {
        this.initMD5Tooltip();
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
        this.md5Tooltip.hideToolTip();
    }

    setMD5String(data: string) {
        this.setCaptionAndHintForMD5(false);
        this.md5Value.string = data === "" ? "" : `<color=#ffffff>${data}</color>`;
        this.setCopyString(data);
        this.md5Tooltip.setData("");
    }

    initMD5Tooltip() {
        if (!this.md5TooltipPrefab || !this.md5TooltipContainer) {
            return;
        }
        const mini = GameUtils.createNodeFromPrefab(this.md5TooltipPrefab);
        this.md5Tooltip = mini.getComponent(MD5Tooltip);
        this.md5TooltipContainer.addChild(mini);
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
        this.md5Tooltip.setData(data.rawValue);
    }

    setMD5Value(cards: OldCardModel[], suffix: string, roundId: string) {
        this.md5Value.string = FormatMD5Result({
            cards,
            suffix,
            firstCharacter: "{",
            endCharacter: "}",
            suitBlack: "#050f04",
            suitRed: "#ff2626",
            isShowIconSuit: true,
            length: this.maximumStringAllowed,
            roundId
        });
    }

    onClickCopyButton() {
        GameUtils.copyToClipboard(this.md5CopyString, this.showHint);
        this.md5Tooltip.hideToolTip();
    }

    showHint() {
        cc.tween(this.hintCopyNode).to(0.2, { opacity: 255 }).delay(1).to(0.1, { opacity: 0 }).start();
    }

    setCaptionAndHintForMD5(isMD5Key: boolean) {
        if (isMD5Key) {
            this.md5Text.string = i18n.t("ui.result").toUpperCase();
        } else {
            this.md5Text.string = i18n.t("holdEmPoker.md5String").toUpperCase();
        }
    }
}
