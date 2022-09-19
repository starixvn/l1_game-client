import { dealerGetChipsMiniGame } from "./../../_base/action/PayChipsAction";
import { getLowercaseObjectKeys } from "../../../common/helpers/ObjectHelper";
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

export const placeOwnChip = (gameBase: MiniGameBase) => (ownBet) => {
    if (gameBase.isDisableGame) {
        return;
    }
    gameBase.betItems.forEach((item) => {
        const choice = item.node.name;
        const betValue = ownBet[choice];
        gameBase.betChips.showChipOwnBet(item, betValue);
    });
};
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

export const handleFlyChips = (game: MiniGameBase) => (data) => {
    if (data.endBet) {
        const betItem = game.betItems.find((item) => item.node.name.toLowerCase() === data.betChoice.toLowerCase());
        game.betChips.placeChipToChipBox(data.endBet, betItem.chipNode, null, null);
    }
};

export const handleTotalChips = (game: MiniGameBase) => (dataChips) => {
    if (game.currentTimeRemaining < game.config.betTime) {
        if (!dataChips) {
            return;
        }

        Object.keys(dataChips).forEach((rate) => {
            const chips = dataChips[rate];
            const chipsKeys = getLowercaseObjectKeys(chips);

            game.betItems.forEach((item) => {
                const betItemData = chips[chipsKeys[item.node.name.toLowerCase()]];
                game.betChips.addChipsToChipBox(+rate, betItemData, item.chipNode);
            });
        });
    }
};

export const showChipOwnBet = (gameBase: MiniGameBase) => (ownBet) => {
    if (gameBase.isDisableGame) {
        return;
    }
    gameBase.betItems.forEach((item) => {
        const choice = item.node.name;
        const betValue = ownBet[choice];
        gameBase.betChips.showChipOwnBet(item, betValue);
    });
};

export const handlePayChips = (gameBase: MiniGameBase) => (finishData) => {
    dealerGetChipsMiniGame(gameBase, finishData.settlementResult, gameBase.gameData.settlement.status, gameBase.gameData.betModel.ownBets);
};
