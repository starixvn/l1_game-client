import FruitSlotTimeHandler from "../event-handlers/FruitSlotTimeHandler";
import { FruitSlotRoundHistory } from "../event-models/FruitSlotRoundHistory";
import { FruitSlotResult, FruitSlotSettlementResult } from "../FruitSlotType";
import FruitSlot from "../view-models/FruitSlot";
import FruitSlotBetItem from "../view-models/FruitSlotBetItem";
import FruitSlotBetOptionsUI from "../view-models/FruitSlotBetOptionsUI";
import FruitSlotLedLightItem from "../view-models/FruitSlotLedLightItem";

export const getWinningOption = (choice: string) => {
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
};

const executeAnim = async (duration: number, from: number, to: number, numberOfSymbols: number, highlightItem: any) => {
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
                                highlightItem?.[highlightPosition].setHighlightItems(true, false);
                            }
                        }
                    }
                }
            )
            .call(() => resolve(0))
            .start();
    });
};

export const formatBigSmallResult = (result: number) => {
    const resultText = result < 10 ? "0" + result.toString() : result.toString();
    return resultText;
};

export const randomNumberAnimation = (betOptionsUI: FruitSlotBetOptionsUI) => (timeDuration: number) => {
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
                        betOptionsUI.bigSmallResult && (betOptionsUI.bigSmallResult.string = numberText);
                    }
                }
            }
        )
        .start();
};

export const highlightBigSmallWinning = (betOptionsUI: FruitSlotBetOptionsUI) => (finish: any) => {
    const bigSmallWining = finish.result.bigSmall.choice;
    cc.tween(betOptionsUI?.betItems)
        .call(() => {
            betOptionsUI?.betItems?.forEach((betItem: FruitSlotBetItem) => {
                const nodeName = betItem.node.name;
                if (nodeName === bigSmallWining) {
                    betItem.node.opacity = 255;
                    betItem.setHighlight(true, true);
                }
            });
        })
        .start();
};

export const highlightWinningChoice = (betOptionsUI: FruitSlotBetOptionsUI) => (finish: any) => {
    const choiceWining = getWinningOption(finish.result.symbols[0]);
    cc.tween(betOptionsUI?.betItems)
        .call(() => {
            betOptionsUI?.betItems?.forEach((betItem: FruitSlotBetItem) => {
                const nodeName = betItem.node.name;
                if (nodeName === choiceWining) {
                    betItem.node.opacity = 255;
                    betItem.setHighlight(true, true);
                }
            });
        })
        .start();
};

export const highlightWinningSymbol =
    (betOptionsUI: FruitSlotBetOptionsUI) =>
    (symbols: string, isAnimated = true) => {
        betOptionsUI?.betItems?.forEach((betItem: FruitSlotBetItem) => {
            const nodeName = betItem.node.name;
            if (nodeName === symbols) {
                betItem.node.opacity = 255;
                betItem.setHighlight(true, isAnimated);
            }
        });
    };

export const playLedLightAnimation = async (betOptionsUI: FruitSlotBetOptionsUI) => {
    let currentIndex = 0;
    const timeDuration = 6.5;
    const numberOfSymbols = 40;
    const steps = numberOfSymbols * 5;
    betOptionsUI.bigSmallResultBackground.opacity = 255;
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
                            if (betOptionsUI.ledZone) {
                                betOptionsUI.ledZone.children[position].getComponent(FruitSlotLedLightItem)?.setHighlightItems();
                            }
                        }
                    }
                }
            }
        )
        .start();
};

export const spinItemAnimation = (game: FruitSlot) => async (finish: any, timeDuration: number) => {
    const numberOfSymbols = game.betOptionsUI.spinItems.length;
    const symbolPositions = finish.result.symbolPositions;
    const firstPosition = symbolPositions[0];
    const steps = firstPosition + numberOfSymbols * 5;

    game.betOptionsUI?.betItems?.forEach((betItem: FruitSlotBetItem) => {
        betItem.node.opacity = 150;
    });

    if (game.betOptionsUI?.spinItems && game.betOptionsUI?.spinItems[firstPosition]) {
        if (!finish.result.isLucky) {
            await executeAnim(timeDuration, 0, steps, numberOfSymbols, game.betOptionsUI.spinItems);
            game.betOptionsUI?.spinItems?.[firstPosition].playSpineSymbolAnimation();
            highlightWinningChoice(game.betOptionsUI)(finish);
        } else {
            await executeAnim(timeDuration, 0, steps, numberOfSymbols, game.betOptionsUI.spinItems);
            game.betOptionsUI?.spinItems?.[firstPosition].playSpineSymbolAnimation();

            for (let i = 0; i < symbolPositions.length - 1; i++) {
                const totalSteps = (symbolPositions[i + 1] - symbolPositions[i] + numberOfSymbols) % numberOfSymbols;
                const nextPosition = symbolPositions[i] + totalSteps + 72;
                const winSymbol = getWinningOption(finish.result.symbols[i]);

                await executeAnim(4, symbolPositions[i], nextPosition, numberOfSymbols, game.betOptionsUI?.spinItems);
                game.betOptionsUI?.spinItems?.[symbolPositions[i + 1]].playSpineSymbolAnimation();
                highlightWinningSymbol(game.betOptionsUI)(winSymbol);
            }
        }
    }
    game?.gameData && game.gameData.settlement.finishShowResult(finish, true);
};

export const showHighlightBet =
    (betOptionsUI: FruitSlotBetOptionsUI) =>
    (resultData: any, isAnimated = true) => {
        const listSymbolWin = resultData.symbols;
        const bigSmallWin = resultData.number > 7 ? "big" : "small";
        highlightWinningSymbol(betOptionsUI)(bigSmallWin, isAnimated);

        for (let i = 0; i <= listSymbolWin.length; i++) {
            const winSymbol = getWinningOption(listSymbolWin[i]);
            highlightWinningSymbol(betOptionsUI)(winSymbol, isAnimated);
        }
    };

export const updateWinning =
    (betOptionUI: FruitSlotBetOptionsUI, timeHandler: FruitSlotTimeHandler) => (roundHistory: FruitSlotRoundHistory[]) => {
        const lastRound = roundHistory[0];
        if (timeHandler.isInRoundTime) {
            showHighlightBet(betOptionUI)(lastRound.result, false);
        }
    };
