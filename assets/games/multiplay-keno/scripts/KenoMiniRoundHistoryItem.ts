import MiniRoundHistoryItem from "../../../common/mini-round-history/MiniRoundHistoryItem";
import { ExtendedLogControlData } from "../../_base/view-models/ExtendedGameLogControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoMiniRoundHistoryItem extends MiniRoundHistoryItem {
    public setData(data: ExtendedLogControlData) {
        const { choice } = data;

        const colors = {
            big: cc.Color.BLACK,
            small: cc.Color.WHITE,
            even: cc.Color.BLUE,
            odd: cc.Color.RED
        };

        this.node.color = colors[choice];
    }
}
