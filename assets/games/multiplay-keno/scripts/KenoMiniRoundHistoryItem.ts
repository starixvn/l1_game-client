import MiniRoundHistoryItem from "../../../common/mini-round-history/MiniRoundHistoryItem";
import { ExtendedLogControlData } from "../../_base/view-models/GameLogControlBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoMiniRoundHistoryItem extends MiniRoundHistoryItem {
    @property({ type: cc.SpriteFrame })
    icons: cc.SpriteFrame[] = [];

    public setData(data: ExtendedLogControlData) {
        const { choice } = data;

        const frameList = {
            big: this.icons[0],
            small: this.icons[1],
            even: this.icons[2],
            odd: this.icons[3]
        };

        this.node.getComponent(cc.Sprite).spriteFrame = frameList[choice];
    }
}
