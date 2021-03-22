import { LotteryChoiceItem } from "./LotteryChoiceItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LotteryNumberItem extends LotteryChoiceItem {
    @property
    paddingEnabled = true;

    onLoad() {
        super.onLoad();
        this.statsLabel.node.active = false;
    }

    setNumber(value: number) {
        this.label.string = this.paddingEnabled ? `${value}`.padStart(2, "0") : `${value}`;
        this.node.name = this.label.string;
    }

    setStats(number: number) {
        this.statsLabel.string = number.toString();
    }

    setCold(isCold = true) {
        this.statsLabel.node.color = isCold ? cc.Color.BLUE : cc.Color.RED;
    }

    clearStats() {
        this.statsLabel.node.color = cc.Color.WHITE;
    }
}
