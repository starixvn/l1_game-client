import FruitSlot from "./FruitSlot";
import FruitSlotBetItem from "./FruitSlotBetItem";
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

    @property(cc.Node)
    ledLightAnimation: cc.Node = null;

    @property(cc.Label)
    bigSmallResult: cc.Label = null;

    @property(cc.Node)
    bigSmallResultBackground: cc.Node = null;

    @property(cc.Node)
    bgLockSpin: cc.Node = null;

    @property(cc.Animation)
    lightAnimation: cc.Animation = null;

    main: FruitSlot;

    initBetOptions(main: FruitSlot) {
        this.main = main;
        main.betItems = this.betItems;
        main.spinItems = this.spinItems;
    }

    onBetClick(event) {
        this.main.onBetItemClick(event);
    }

    highlightBigSmall() {
        cc.tween(this.bigSmallResultBackground)
            .repeat(20, cc.tween().to(0.15, { opacity: 255 }).to(0.15, { opacity: 100 }))
            .start();
    }

    highlightWinningChoice(finish: any) {
        const choiceWining = this.getWinningOption(finish.result.symbols[0]);
        const symbolPositions = finish.result.symbolPositions[0];
        const bigSmallWining = finish.result.bigSmall.choice;

        this.spinItems[symbolPositions].setHighlightItems(true, true);
        this.highlightBigSmall();
        cc.tween(this.betItems)
            .call(() => {
                this.betItems.forEach((betItem: FruitSlotBetItem) => {
                    const nodeName = betItem.node.name;
                    if (nodeName === choiceWining || nodeName === bigSmallWining) {
                        betItem.node.opacity = 255;
                        betItem.setHighlight(true, true);
                    }
                });
            })
            .delay(2)
            .call(() => (this.spinItems[symbolPositions].highlight.opacity = 255))
            .start();
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

    randomNumberAnimation() {
        let currentIndex = 0;
        const arr = Array.from({ length: 100 }, () => Math.floor(Math.random() * 14));
        cc.tween({ itemIndex: 0 })
            .to(
                6.5,
                { itemIndex: 39 },
                {
                    easing: "sineInOut",
                    onUpdate: (target) => {
                        const node = Math.round(target.itemIndex);
                        if (currentIndex !== node) {
                            currentIndex = node;

                            const numberText = arr[currentIndex] < 10 ? "0" + arr[currentIndex].toString() : arr[currentIndex].toString();
                            this.bigSmallResult.string = numberText;
                        }
                    }
                }
            )
            .start();
    }

    spinItemAnimation(finish: any) {
        let currentIndex = 0;
        const maxItem = this.spinItems.length;
        const position = finish.result.symbolPositions[0];
        const temp = position + maxItem * 5;

        this.betItems.forEach((betItem: FruitSlotBetItem) => {
            betItem.node.opacity = 150;
        });

        cc.tween({ itemIndex: 0 })
            .to(
                6.5,
                { itemIndex: temp },
                {
                    easing: "sineInOut",
                    onUpdate: (target) => {
                        const node = Math.round(target.itemIndex);
                        if (currentIndex <= node) {
                            let index = currentIndex;

                            currentIndex = node;

                            for (; index < node; index++) {
                                const highlightPosition = index % maxItem;
                                this.spinItems[highlightPosition].setHighlightItems(true, false);
                            }
                        }
                    }
                }
            )
            .start();
    }

    resetUIBettingZone() {
        this.bigSmallResult.string = "";
        this.bigSmallResultBackground.opacity = 0;
        console.log("bigSmallResultBackground", this.bigSmallResultBackground.opacity);
        this.lightAnimation.node.active = true;
        this.betItems.forEach((item) => (item.node.opacity = 255));
        this.spinItems.forEach((item) => item.resetHighlight());
        this.main.setBgVisibility(this.bgLockSpin, true);
    }
}
