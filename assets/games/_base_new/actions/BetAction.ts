import MiniGameBase from "../view-models/MiniGameBase";

export const updateTotalBets = (gameBase: MiniGameBase) => (data) => {
    if (gameBase.isDisableGame) {
        return;
    }
    gameBase.betItems.forEach((item) => item.setTotalBetsData(data));
};

export const updateOwnBets = (gameBase: MiniGameBase) => (data) => {
    if (gameBase.isDisableGame) {
        return;
    }
    gameBase.betItems.forEach((item) => item.setOwnBetsData(data));
};

export const placeBetFailed = (gameBase: MiniGameBase) => () => {
    gameBase.showProcessingWarning(false);
};

export const placeBetSuccess = (gameBase: MiniGameBase) => (endBet: number) => {
    gameBase.showProcessingWarning(false);
    gameBase.showAcceptedBet(endBet);
};

export const placeOwnChip = (gameBase: MiniGameBase) => () => {};
export const placeTotalChips = (gameBase: MiniGameBase) => () => {};
export const handlePlayerChipAction = (gameBase: MiniGameBase) => () => {};

export const changeBetPercentage = (game: MiniGameBase) => (betPercentage: any) => {
    if (game.isDisableGame) {
        return;
    }
    Object.keys(betPercentage).forEach((key) => {
        const label = game.betPercentage.find((label) => label.node.name === key);
        label && (label.string = `${betPercentage[key]}%`);
    });
};
