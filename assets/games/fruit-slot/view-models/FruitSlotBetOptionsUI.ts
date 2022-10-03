import FruitSlot from "./FruitSlot";
import FruitSlotBetItem from "./FruitSlotBetItem";
import FruitSlotSpinItem from "./FruitSlotSpinItem";
import GameUtils from "../../../common/GameUtils";
import { FruitSlotSettlementResult } from "../FruitSlotType";
import { FruitSlotFinishModel } from "../actions/FruitSlotFinishActions";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FruitSlotBetOptionsUI extends cc.Component {
    @property({ type: FruitSlotBetItem })
    betItems: FruitSlotBetItem[] = [];

    @property({ type: FruitSlotSpinItem })
    spinItems: FruitSlotSpinItem[] = [];

    @property(cc.Animation)
    spinAnimation: cc.Animation = null;

    @property(cc.Node)
    ledLightAnimation: cc.Node = null;

    main: FruitSlot;

    initBetOptions(main: FruitSlot) {
        this.main = main;
        main.betItems = this.betItems;
        main.spinItems = this.spinItems;
    }

    onBetClick(event) {
        this.main.onBetItemClick(event);
    }

    async spin(finish: any) {
        const symbolPositions = finish.result.symbolPositions[0];
        const choiceWining = this.getWinningOption(finish.result.symbols[0]);
        const bigSmallWining = finish.result.bigSmall.choice;
        for (let i = 0; i <= symbolPositions; i++) {
            const timeGap = i <= 12 ? 0.02 * i : 0.01 * i;
            const item = this.spinItems[i];
            if (i > 0) {
                await GameUtils.delayTime(timeGap);
            }
            item.setHighlightItems(true, false);
        }

        cc.tween(this.spinItems)
            .call(() => {
                this.spinItems[symbolPositions].setHighlightItems(true, true);
            })
            .delay(0.5)
            .call(() => {})
            .start();

        this.betItems.forEach((betItem: FruitSlotBetItem) => {
            const nodeName = betItem.node.name;
            if (nodeName === choiceWining || nodeName === bigSmallWining) {
                betItem.setHighlight(true, true);
            }
        });
    }

    getWinningOption(choice: string) {
        const tmp = {
            bar: ["bar", "bar50", "bar25"],
            bell: ["bell", "bell3"],
            cherry: ["cherry", "cherry3"],
            lemon: ["lemon", "lemon3"],
            orange: ["orange", "orange3"],
            star: ["star", "star3"],
            tripleSeven: ["tripleSeven", "tripleSeven3"],
            watermelon: ["watermelon", "watermelon3"],
            big: ["big"],
            small: ["small"]
        };
        let result = "";
        Object.keys(tmp).forEach((key) => {
            if (tmp[key].includes(choice)) {
                result = key;
            }
        });
        return result;
    }

    playLedLightAnimation() {
        this.ledLightAnimation.active = true;
        const ledSkeleton = this.ledLightAnimation.getComponent(sp.Skeleton);
        ledSkeleton.setAnimation(0, ledSkeleton.animation, true);
    }
}
