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

    highlightBigSmallResult() {
        cc.tween(this.bigSmallResultBackground)
            .repeat(20, cc.tween().to(0.15, { opacity: 255 }).to(0.15, { opacity: 100 }))
            .start();
    }

    highlightBigSmallWinning(finish: any) {
        const bigSmallWining = finish.result.bigSmall.choice;
        this.highlightBigSmallResult();
        cc.tween(this.betItems)
            .call(() => {
                this.betItems.forEach((betItem: FruitSlotBetItem) => {
                    const nodeName = betItem.node.name;
                    if (nodeName === bigSmallWining) {
                        betItem.node.opacity = 255;
                        betItem.setHighlight(true, true);
                    }
                });
            })
            .start();
    }

    highlightWinningChoice(finish: any) {
        const choiceWining = this.getWinningOption(finish.result.symbols[0]);
        cc.tween(this.betItems)
            .call(() => {
                this.betItems.forEach((betItem: FruitSlotBetItem) => {
                    const nodeName = betItem.node.name;
                    if (nodeName === choiceWining) {
                        betItem.node.opacity = 255;
                        betItem.setHighlight(true, true);
                    }
                });
            })
            .start();
    }

    highlightWinningSymbol(symbols: string) {
        this.betItems.forEach((betItem: FruitSlotBetItem) => {
            const nodeName = betItem.node.name;
            if (nodeName === symbols) {
                betItem.node.opacity = 255;
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

    async playLedLightAnimation() {
        let currentIndex = 0;
        const timeDuration = 6.5;
        const numberOfSymbols = 40;
        const steps = numberOfSymbols * 5;
        cc.tween({ value: 0 })
            .to(
                timeDuration,
                { value: steps },
                {
                    easing: "sineInOut",
                    onUpdate: (target: { value: number }) => {
                        const nextIndex = Math.round(target.value);

                        if (currentIndex <= nextIndex) {
                            let index = currentIndex;

                            currentIndex = nextIndex;

                            for (; index < nextIndex; index++) {
                                const position = index % numberOfSymbols;
                                this.ledZone.children[position].getComponent(FruitSlotLedLightItem).setHighlightItems();
                            }
                        }
                    }
                }
            )
            .start();
    }

    randomNumberAnimation(timeDuration: number) {
        let currentIndex = 0;
        const arr = Array.from({ length: 100 }, () => Math.floor(Math.random() * 14));
        cc.tween({ itemIndex: 0 })
            .to(
                timeDuration,
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

    executeAnim(duration: number, from: number, to: number, numberOfSymbols: number, highlightItem: any) {
        let currentIndex: number = from;

        return new Promise((resolve) => {
            cc.tween({ value: from })
                .to(
                    duration,
                    { value: to },
                    {
                        easing: "sineInOut",
                        onUpdate: (target: { value: number }) => {
                            const nextIndex = Math.round(target.value);

                            if (currentIndex <= nextIndex) {
                                let index = currentIndex;

                                currentIndex = nextIndex;

                                for (; index < nextIndex; index++) {
                                    const highlightPosition = index % numberOfSymbols;
                                    highlightItem[highlightPosition].setHighlightItems(true, false);
                                }
                            }
                        }
                    }
                )
                .call(() => resolve(0))
                .start();
        });
    }

    async spinItemAnimation(finish: any, timeDuration: number) {
        const numberOfSymbols = this.spinItems.length;
        const symbolPositions = finish.result.symbolPositions;
        const firstPosition = symbolPositions[0];
        const steps = firstPosition + numberOfSymbols * 5;

        this.betItems.forEach((betItem: FruitSlotBetItem) => {
            betItem.node.opacity = 150;
        });

        if (!finish.result.isLucky) {
            await this.executeAnim(timeDuration, 0, steps, numberOfSymbols, this.spinItems);
            this.spinItems[firstPosition].setHighlightItems(true, true);
            this.highlightWinningChoice(finish);
        } else {
            await this.executeAnim(timeDuration, 0, steps, numberOfSymbols, this.spinItems);
            this.spinItems[firstPosition].setHighlightItems(true, true);

            for (i = 0; i < symbolPositions.length - 1; i++) {
                const totalSteps = (symbolPositions[i + 1] - symbolPositions[i] + numberOfSymbols) % numberOfSymbols;
                const nextPosition = symbolPositions[i] + totalSteps + 72;
                const winSymbol = this.getWinningOption(finish.result.symbols[i]);

                await this.executeAnim(4, symbolPositions[i], nextPosition, numberOfSymbols, this.spinItems);
                this.spinItems[symbolPositions[i + 1]].setHighlightItems(true, true);
                this.highlightWinningSymbol(winSymbol);
            }
        }
        this.main.gameData.settlement.finishShowResult(finish, true);
    }

    resetUIBettingZone() {
        this.bigSmallResult.string = "";
        this.bigSmallResultBackground.opacity = 0;
        this.lightAnimation.node.active = true;
        this.betItems.forEach((item) => (item.node.opacity = 255));
        this.spinItems.forEach((item) => item.resetHighlight());
        this.main.setBgVisibility(this.bgLockSpin, true);
    }
}
