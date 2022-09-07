import FruitSlot from "./FruitSlot";
import FruitSlotBetItem from "./FruitSlotBetItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FruitSlotBetOptionsUI extends cc.Component {
    @property({ type: FruitSlotBetItem })
    betItems: FruitSlotBetItem[] = [];

    main: FruitSlot;

    initBetOptions(main: FruitSlot) {
        this.main = main;
        main.betItems = this.betItems;
    }

    onBetClick(event) {
        this.main.onBetItemClick(event);
    }
}
