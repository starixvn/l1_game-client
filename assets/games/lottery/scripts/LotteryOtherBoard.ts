import { LotteryChoiceItem } from "./LotteryChoiceItem";
import { LotteryChoicesBoard } from "./LotteryChoicesBoard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LotteryOtherBoard extends LotteryChoicesBoard {
    @property({ type: LotteryChoiceItem })
    items: LotteryChoiceItem[] = [];

    onLoad() {
        this.initCallbackForItems();
    }

    getChoices(): string[] {
        const result: string[] = [];
        this.items.forEach((item) => {
            if (item.isChecked()) {
                result.push(item.node.name);
            }
        });
        return result;
    }
}
