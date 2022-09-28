import FruitSlot from "./FruitSlot";
import FruitSlotBetItem from "./FruitSlotBetItem";
import FruitSlotSpinItem from "./FruitSlotSpinItem";
import GameUtils from "../../../common/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FruitSlotBetOptionsUI extends cc.Component {
    @property({ type: FruitSlotBetItem })
    betItems: FruitSlotBetItem[] = [];

    @property({ type: FruitSlotSpinItem })
    spinItems: FruitSlotSpinItem[] = [];

    main: FruitSlot;    

    initBetOptions(main: FruitSlot) {
        this.main = main;
        main.betItems = this.betItems;
        main.spinItems = this.spinItems;
    }

    onBetClick(event) {
        this.main.onBetItemClick(event);
    }

    async spinItem(index: number) {
        const duration = 0.1;        
        const item = this.spinItems[index];
        item.setHighlightItems(true);
        await GameUtils.delayTime(duration)
    }

    async spinItemAnim(list: number[]) {
        await Promise.all(list.map((index) => this.spinItem(index)));
    }
}
