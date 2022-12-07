import * as i18n from "i18n/runtime-scripts/LanguageData";

import { OldCardModel } from "../../common/new-card/view-models/NewCard";
import MD5Component from "../_base/view-models/MD5Component";
import { FormatMD5Result } from "./MD5Format";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CasinoMD5 extends MD5Component {
    readonly maximumStringAllowed = 352;

    initMD5Wrapper(node: cc.Node) {
        super.initMD5Wrapper(node);
        this.enableCopyButton(false);
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
        super.initMD5Tooltip();
    }

    setCopyString(text: string) {
        super.setCopyString(text);
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
            suitBlack: "#ffffff",
            suitRed: "#ffffff",
            isShowIconSuit: true,
            length: this.maximumStringAllowed,
            roundId
        });
    }

    setCaptionAndHintForMD5(isMD5Key: boolean) {
        if (isMD5Key) {
            this.md5Text.string = i18n.t("ui.result").toUpperCase();
        } else {
            this.md5Text.string = i18n.t("holdEmPoker.md5String").toUpperCase();
        }
    }
}
