import { setBgVisibility } from "../actions/FruitSlotWinningAction";
import FruitSlot from "./FruitSlot";
import FruitSlotBetItem from "./FruitSlotBetItem";
import FruitSlotLedLightItem from "./FruitSlotLedLightItem";
import FruitSlotSpinItem from "./FruitSlotSpinItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FruitSlotBetOptionsUI extends cc.Component {
    @property({ type: FruitSlotBetItem })
    betItems: FruitSlotBetItem[] = [];

    @property({ type: FruitSlotSpinItem })
    spinItems: FruitSlotSpinItem[] = [];

    @property(cc.Animation)
    spinAnimation: cc.Animation = null;

    @property(cc.Label)
    bigSmallResult: cc.Label = null;

    @property(cc.Node)
    bigSmallResultBackground: cc.Node = null;

    @property(cc.Node)
    bgLockSpin: cc.Node = null;

    @property(cc.Animation)
    lightAnimation: cc.Animation = null;

    @property(cc.Node)
    ledZone: cc.Node = null;

    main: FruitSlot;
    ledSpin: FruitSlotLedLightItem = null;

    initBetOptions(main: FruitSlot) {
        this.main = main;
        main.betItems = this.betItems;
        main.spinItems = this.spinItems;
    }

    onBetClick(event) {
        this.main.onBetItemClick(event);
    }

    resetUIBettingZone() {
        this.bigSmallResult.string = "";
        this.bigSmallResultBackground.opacity = 0;
        this.lightAnimation.node.active = true;
        this.betItems.forEach((item) => {
            item.node.opacity = 255;
            item.resetHighlight();
        });

        this.spinItems.forEach((item) => item.resetHighlight());
        setBgVisibility(this.bgLockSpin, true);
    }
}
