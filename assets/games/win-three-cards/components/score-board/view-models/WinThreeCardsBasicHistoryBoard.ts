import * as _ from "lodash";
import BasicHistoryBoard from "../../../../_base/view-models/BasicHistoryBoard";

const { ccclass } = cc._decorator;

export class BasicHistoryData {
    constructor(public name: string, public value: string, public playerPair?: boolean, public bankerPair?: boolean) {}
}

@ccclass
export default class WinThreeCardsBasicHistoryBoard extends BasicHistoryBoard {
    public setData(historyData: BasicHistoryData[]) {
        this.dots.forEach((dot) => {
            dot.removeFromParent();
            dot.destroy();
        });

        this.dots = [];

        this.nextMark = null;

        historyData.forEach((history) => {
            const historyItem = _.find(this.items, (item) => item.name.toLowerCase() === history.name);
            const historyDot = cc.instantiate(historyItem);
            historyDot.active = true;
            this.content.addChild(historyDot);
            this.dots.push(historyDot);
        });

        this.addNextMark();
    }
}
