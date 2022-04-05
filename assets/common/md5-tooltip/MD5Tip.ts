import MiniRoundHistoryTip from "../mini-round-history/MiniRoundHistoryTip";
const { ccclass } = cc._decorator;

@ccclass
export default class MD5Tip extends MiniRoundHistoryTip {
    public setData(data = "") {
        this.result.string = `${data}`;
    }

    public show(show = false) {
        super.show(show);
    }
}
