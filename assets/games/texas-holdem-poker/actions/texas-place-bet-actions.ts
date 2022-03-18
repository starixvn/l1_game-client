import { numberWithCommas } from "../../../common/helpers/NumberHelper";

import BetChips from "../../../common/bet-chips/view-models/BetChips";
import { TexasChoicesType, TexasState } from "../texas-type";
import TexasGameDataModel from "../event-models/texas-game-data-model";
import TexasPlaceBetModel from "../event-models/texas-place-bet-model";
import TexasStateModel from "../event-models/texas-state-model";
import Texas from "../view-models/texas";
import TexasBettingArea from "../view-models/texas-betting-area";
import TexasHoldemPokerChip from "../view-models/texas-chips";
import { TexasChoicesConst } from "../texas-contants";

export const showHideButtons = (main: Texas) => (stateModel: TexasStateModel) => {
    switch (stateModel.state) {
        case TexasState.ante_bet:
            main.dealButton.active = main.cancelButton.active = main.doubleButton.active = true;
            main.reBetAndDealButton.active = main.newButton.active = false;
            break;
        case TexasState.blank_new:
            main.dealButton.active = main.cancelButton.active = main.doubleButton.active = false;
            main.reBetAndDealButton.active = main.newButton.active = false;
            break;
        case TexasState.prepare_new:
            main.reBetAndDealButton.active = main.newButton.active = true;
            main.callButton.active = main.foldButton.active = false;
            main.dealButton.active = main.doubleButton.active = main.cancelButton.active = false;
            break;
        case TexasState.replay_new:
            main.reBetAndDealButton.active = true;
            main.callButton.active = main.foldButton.active = false;
            main.dealButton.active = main.doubleButton.active = main.cancelButton.active = main.newButton.active = false;
            break;
        case TexasState.calling_deal:
            main.dealButton.active = main.doubleButton.active = main.cancelButton.active = false;
            main.reBetAndDealButton.active = main.newButton.active = false;
            break;
        case TexasState.dealing:
            break;
        case TexasState.dealt:
            main.callButton.active = main.foldButton.active = true;
            // main.swapButton.active = main.holdButton.active = main.doubleButton.active = true;
            break;
        case TexasState.calling_call:
        case TexasState.calling_fold:
            main.callButton.active = main.foldButton.active = false;
            break;
        case TexasState.calling_called:
            main.turnButton.active = main.checkTurnButton.active = true;
            main.callButton.active = main.foldButton.active = false;
            break;
        case TexasState.calling_check_turn:
        case TexasState.calling_turning:
            main.turnButton.active = main.checkTurnButton.active = false;
            break;
        case TexasState.calling_turned:
            main.riverButton.active = main.checkRiverButton.active = true;
            main.turnButton.active = main.checkTurnButton.active = false;
            break;
        case TexasState.calling_rivering:
        case TexasState.calling_check_river:
            main.riverButton.active = main.checkRiverButton.active = false;
            break;
        case TexasState.settled:
            main.riverButton.active = main.checkRiverButton.active = false;
            break;
        case TexasState.swap_card:
        case TexasState.hold_card:
            main.callButton.active = main.foldButton.active = true;
            break;
    }
};
export const showPlaceBetChips =
    (bettingAreas: TexasBettingArea[], slidingChips: BetChips, shadowChip: cc.SpriteFrame, texasHoldemPokerChips: TexasHoldemPokerChip) =>
    ({ currentChoice, currentAmount, totalAmount }) => {
        const bettingArea = bettingAreas.filter((a) => a.betChoice === currentChoice)[0];
        if (bettingArea && bettingArea.chipNode) {
            texasHoldemPokerChips.flyChipToBetPlace(slidingChips, bettingArea.chipNode, shadowChip, currentAmount, totalAmount);
        }
    };

export const clearBetChips =
    (bettingAreas: TexasBettingArea[]) =>
    ({ currentChoice }) => {
        const bettingArea = bettingAreas.filter((a) => a.betChoice === currentChoice)[0];
        if (bettingArea && bettingArea.chipNode) {
            bettingArea.chipNode.removeAllChildren();
            bettingArea.handleWinningAmount(0, false);
        }
    };

export const clearAllBetChips = (bettingAreas: TexasBettingArea[]) => () => {
    clearBetChips(bettingAreas)({ currentChoice: TexasChoicesConst.anteBet });
    clearBetChips(bettingAreas)({ currentChoice: TexasChoicesConst.callBet });
    clearBetChips(bettingAreas)({ currentChoice: TexasChoicesConst.turnBet });
    clearBetChips(bettingAreas)({ currentChoice: TexasChoicesConst.riverBet });
    clearUIData(bettingAreas)();
};

export const updateChips =
    (bettingAreas: TexasBettingArea[], slidingChips: BetChips, shadowChip: cc.SpriteFrame, texasHoldemPokerChips: TexasHoldemPokerChip) =>
    ({ choice, totalAmount }) => {
        const bettingArea = bettingAreas.filter((a) => a.betChoice === choice)[0];
        if (bettingArea && bettingArea.chipNode) {
            texasHoldemPokerChips.updateChipStack(slidingChips, bettingArea.chipNode, shadowChip, totalAmount);
        }
    };

export const updateAllChips =
    (bettingAreas: TexasBettingArea[], slidingChips: BetChips, shadowChip: cc.SpriteFrame, texasHoldemPokerChips: TexasHoldemPokerChip) =>
    (placeBetModel: TexasPlaceBetModel) => {
        if (placeBetModel.choices[TexasChoicesConst.anteBet] !== 0) {
            updateChips(
                bettingAreas,
                slidingChips,
                shadowChip,
                texasHoldemPokerChips
            )({ choice: TexasChoicesConst.anteBet, totalAmount: placeBetModel.choices[TexasChoicesConst.anteBet] });
        }
        if (placeBetModel.choices[TexasChoicesConst.callBet] !== 0) {
            updateChips(
                bettingAreas,
                slidingChips,
                shadowChip,
                texasHoldemPokerChips
            )({ choice: TexasChoicesConst.callBet, totalAmount: placeBetModel.choices[TexasChoicesConst.callBet] });
        }
        if (placeBetModel.choices[TexasChoicesConst.turnBet] !== 0) {
            updateChips(
                bettingAreas,
                slidingChips,
                shadowChip,
                texasHoldemPokerChips
            )({ choice: TexasChoicesConst.turnBet, totalAmount: placeBetModel.choices[TexasChoicesConst.turnBet] });
        }
    };

export const showHideTooltip = (bettingAreas: TexasBettingArea[]) => (stateModel: TexasStateModel) => {
    switch (stateModel.state) {
        case TexasState.calling_deal:
        case TexasState.dealt:
            bettingAreas[0].showTooltip(false);
            break;
        case TexasState.ante_bet:
            bettingAreas[0].showTooltip(false);
            break;
        case TexasState.blank_new:
        case TexasState.replay_new:
            bettingAreas[0].showTooltip(true);
            break;
        default:
            bettingAreas[0].showTooltip(false);
            break;
    }
};

export const showOwnBet = (gameData: TexasGameDataModel<TexasChoicesType>, bettingAreas: TexasBettingArea[]) => () => {
    const renderOwnBet = (bettingAreas: TexasBettingArea[], choice: string, ownBetValue) => {
        const bettingArea = bettingAreas.find((e) => e.betChoice === choice);
        bettingArea.ownBets = ownBetValue;
        bettingArea.showBetValue(true);
        bettingArea.showBetText(false);
    };
    if (gameData.placeBetModel.choices[TexasChoicesConst.anteBet]) {
        renderOwnBet(bettingAreas, TexasChoicesConst.anteBet, gameData.placeBetModel.choices[TexasChoicesConst.anteBet]);
    }
    if (gameData.placeBetModel.choices[TexasChoicesConst.callBet]) {
        renderOwnBet(bettingAreas, TexasChoicesConst.callBet, gameData.placeBetModel.choices[TexasChoicesConst.callBet]);
    }
    if (gameData.placeBetModel.choices[TexasChoicesConst.turnBet]) {
        renderOwnBet(bettingAreas, TexasChoicesConst.turnBet, gameData.placeBetModel.choices[TexasChoicesConst.turnBet]);
    }
    if (gameData.placeBetModel.choices[TexasChoicesConst.riverBet]) {
        renderOwnBet(bettingAreas, TexasChoicesConst.riverBet, gameData.placeBetModel.choices[TexasChoicesConst.riverBet]);
    }
};

export const clearUIData = (bettingAreas: TexasBettingArea[]) => () => {
    for (const [key] of Object.entries(bettingAreas)) {
        bettingAreas[key].showBetValue(false);
        bettingAreas[key].showBetText(true);
    }
};

export const updateTotalBetLabel = (totalBetLabel: cc.Label) => (placingModel: TexasPlaceBetModel) => {
    let total = 0;
    if (!!placingModel.choices?.anteBet) {
        total += placingModel.choices.anteBet;
    }
    if (!!placingModel.choices?.callBet) {
        total += placingModel.choices.callBet;
    }
    if (!!placingModel.choices?.turnBet) {
        total += placingModel.choices.turnBet;
    }
    if (!!placingModel.choices?.riverBet) {
        total += placingModel.choices.riverBet;
    }
    totalBetLabel.string = numberWithCommas(total);
};

export const prepareNewRound = (placeBet: TexasPlaceBetModel) => () => {
    placeBet.prepareNewRound();
};
