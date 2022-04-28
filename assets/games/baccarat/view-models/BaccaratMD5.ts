import GameUtils from "../../../common/GameUtils";
import MD5Tooltip from "../../../common/md5-tooltip/MD5Tooltip";
import MD5Component, { MD5Type } from "../../_base/view-models/MD5Component";
const { ccclass } = cc._decorator;

@ccclass
export default class BaccaratMD5 extends MD5Component {
    readonly START_COLOR_CARD_RED = "<color=#ff2626>";
    readonly START_COLOR_CARD_BLACK = "<color=#050f04>";
    readonly END_COLOR_CARD = "</color>";
    readonly suffixRedSuit = ["♥", "♦"];
    protected lengthOfMd5String = 24;

    initMD5Tooltip() {
        const mini = GameUtils.createNodeFromPrefab(this.md5TooltipPrefab);
        mini.setContentSize(cc.size(this.md5TooltipContainer.getContentSize()));
        this.md5Tooltip = mini.getComponent(MD5Tooltip);
        mini.children[0].x = 30;
        this.md5TooltipContainer.addChild(mini);
    }

    generateMD5Result(data: MD5Type) {
        let result = "";
        if (!!data.extraInfos) {
            const suffix = data.rawValue.split("_");
            const cardResult = this.generateCards(suffix[0]);
            const suffixFormatLength = suffix[1].slice(0, this.lengthOfMd5 - suffix[0].length - 1) + "...";
            result = `{${cardResult}}_${suffixFormatLength}`;
        }
        if (!!data.hashValue) {
            result = data.hashValue.slice(0, this.lengthOfMd5String) + "...";
        }

        this.md5Value.string = `${result}`;
    }

    generateCards(rawValue: string) {
        return rawValue
            .slice(1, rawValue.length - 1)
            .split(" ")
            .reduce((result, raw) => {
                result += this.suffixRedSuit.includes(raw[raw.length - 1])
                    ? `${this.START_COLOR_CARD_RED}${raw}${this.END_COLOR_CARD} `
                    : `${this.START_COLOR_CARD_BLACK}${raw}${this.END_COLOR_CARD} `;
                return result;
            }, "")
            .trim();
    }

    handleTooltip(data: MD5Type) {
        !!data && this.md5Tooltip.hideToolTip();
        this.md5Tooltip.setData(data.rawValue || data.hashValue);
    }
}
