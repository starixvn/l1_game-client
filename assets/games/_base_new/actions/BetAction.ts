import MiniGameBase from "../view-models/MiniGameBase";
import { collectChipsLost, dealerGetChipsMiniGame } from "./../../_base/action/PayChipsAction";

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

export const updatePreviousBets = (gameBase: MiniGameBase) => (data) => {
    if (Object.keys(data).length > 0) {
        gameBase.previousOwnBets = {
            roundId: gameBase.roundId,
            ownBets: data
        };
        gameBase.updateRebetButtonStatus();
        gameBase.saveRebetStorage(gameBase.previousOwnBets);
    }
};

export const placeBetFailed = (gameBase: MiniGameBase) => () => {
    gameBase.showProcessingWarning(false);
};

export const placeBetSuccess = (gameBase: MiniGameBase) => (endBet: number) => {
    gameBase.showProcessingWarning(false);
    gameBase.showAcceptedBet(endBet);
};

export const placeOwnChip = (gameBase: MiniGameBase) => (ownBet) => {
    if (!gameBase.isPlacingFakeChip || gameBase.isDisableGame) {
        return;
    }
    gameBase.betItems.forEach((item) => {
        const choice = item.node.name;
        const betValue = ownBet[choice];
        gameBase.betChips.showChipOwnBet(item, betValue);
    });
};

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
    if (!game.isPlacingFakeChip) {
        return;
    }
    if (data.endBet) {
        const betItem = game.betItems.find((item) => item.node.name.toLowerCase() === data.betChoice.toLowerCase());
        game.betChips.placeChipToChipBox(data.endBet, betItem.chipNode, null, null);
    }
};

export const handlePayChips = (gameBase: MiniGameBase) => (finishData) => {
    if (!gameBase.isPlacingFakeChip) {
        return;
    }
    const { settlement, animated } = finishData;
    if (!animated) {
        return;
    }

    gameBase.isCollectChip
        ? dealerGetChipsMiniGame(
              gameBase,
              settlement.settlementResult,
              gameBase.gameData.settlement.status,
              gameBase.gameData.betModel.ownBets
          )
        : collectChipsLost(gameBase, settlement.settlementResult);
};
