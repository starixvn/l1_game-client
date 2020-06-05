import MiniRoundHistory from "../../../common/mini-round-history/MiniRoundHistory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SedieMiniRoundHistory extends MiniRoundHistory {

    public setData(datas: any[]) {
        this.items.forEach((item, index) => {
            if (index >= datas.length) {
                return;
            }
            let value = datas[index];
            item.setData(value);
            item.node.active = true;
        });
        this.selectedNode && this.onUpdate(this.selectedNode);
    }
}
