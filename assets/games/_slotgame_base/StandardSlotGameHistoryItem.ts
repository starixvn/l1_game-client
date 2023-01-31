import SlotGameHistoryItem from "./SlotGameHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardSlotGameHistoryItem extends SlotGameHistoryItem {
    @property({ type: cc.Node, override: true, visible: false })
    jackpotIcon: cc.Node = null;

    setData(betLog, index) {
        super.setData(betLog, index);
        this.win.node.color = betLog.betWin > 0 ? this.textHighlightColor : this.textNormalColor;
    }
}
