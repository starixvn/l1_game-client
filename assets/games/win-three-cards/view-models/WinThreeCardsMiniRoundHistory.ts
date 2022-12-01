import MiniRoundHistory from "../../../common/mini-round-history/MiniRoundHistory";
import WinThreeCardsMiniRoundHistoryItem from "./WinThreeCardsMiniRoundHistoryItem";

const { ccclass } = cc._decorator;
@ccclass
export default class WinThreeCardsMiniRoundHistory extends MiniRoundHistory {
    protected onUpdate(node: cc.Node) {
        const data = node.getComponent(WinThreeCardsMiniRoundHistoryItem).data;
        this.tip.node.active && this.tip.setData(data);
    }
}
