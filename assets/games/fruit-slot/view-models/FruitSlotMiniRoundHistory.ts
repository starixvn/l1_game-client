import { FruitSlotRoundHistory } from "../event-models/FruitSlotRoundHistory";
import FruitSlot from "./FruitSlot";
import FruitSlotMiniRoundHistoryItem from "./FruitSlotMiniRoundHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FruitSlotMiniRoundHistory extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    private rounds: any[] = [];
    private readonly maxItems = 18;

    main: FruitSlot;

    init(main: FruitSlot) {
        this.main = main;
    }

    render(roundHistory: FruitSlotRoundHistory[]) {
        this.rounds = roundHistory.length > this.maxItems ? roundHistory.slice(0, this.maxItems) : [...roundHistory];
        while (this.rounds.length < this.maxItems) {
            this.rounds.unshift(null);
        }
        this.setDataContent();
    }

    addNewItem(round: FruitSlotRoundHistory) {
        const index = this.rounds.findIndex((round) => round !== null);
        if (index === 0) {
            this.rounds.unshift(round);
            this.rounds.length > this.maxItems && this.rounds.pop();
        } else {
            const i = index === -1 ? this.maxItems - 1 : index - 1;
            this.rounds[i] = round;
        }
        this.setDataContent();
    }

    openStatistic() {
        this.main.openStatistic();
    }

    private setDataContent() {
        const lastIndex = this.rounds.findIndex((round) => round);
        const blinkNodeIndex = lastIndex !== 0 ? lastIndex - 1 : lastIndex;
        this.rounds.forEach((round, index) => {
            this.content.children[index]?.getComponent(FruitSlotMiniRoundHistoryItem).setData(round, blinkNodeIndex === index);
        });
    }
}
