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

    @property(cc.Animation)
    spinAnimation: cc.Animation = null;

    main: FruitSlot;

    initBetOptions(main: FruitSlot) {
        this.main = main;
        main.betItems = this.betItems;
        main.spinItems = this.spinItems;
    }

    onBetClick(event) {
        this.main.onBetItemClick(event);
    }

    async spin(symbolPositions: number) {
        for (let i = 0; i <= symbolPositions; i++) {
            const timeGap = 0.03 * i;
            const item = this.spinItems[i];
            if (i > 0) {
                await GameUtils.delayTime(timeGap);
            }
            item.setHighlightItems(true, false);
        }
        this.spinItems[symbolPositions].setHighlightItems(true, true);
    }    
}
