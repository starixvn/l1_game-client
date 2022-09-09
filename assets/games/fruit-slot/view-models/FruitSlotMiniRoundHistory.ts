import { FruitSlotRoundHistory } from "../event-handlers/FruitSlotRoundHistoryHandler";
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
        this.rounds.unshift(round);
        this.rounds.length > this.maxItems && this.rounds.pop();
        this.setDataContent();
    }

    openStatistic() {
        this.main.openStatistic();
    }

    private setDataContent() {
        this.rounds.forEach((round, index) => {
            this.content.children[index]?.getComponent(FruitSlotMiniRoundHistoryItem).setData(round, true);
        });
    }
}
