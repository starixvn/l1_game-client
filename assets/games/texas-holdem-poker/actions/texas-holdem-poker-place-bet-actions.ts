import { numberWithCommas } from "../../../common/helpers/NumberHelper";

import BetChips from "../../../common/bet-chips/view-models/BetChips";
import {TexasHoldemPokerChoicesType} from "../type";
import { TexasHoldemPokerState } from "../type";
import { TexasHoldemPokerGameData } from "../event-models/texas-holdem-poker-game-data";
import { TexasHoldemPokerPlaceBetModel } from "../event-models/texas-holdem-poker-place-bet-model";
import { TexasHoldemPokerStateModel } from "../event-models/texas-holdem-poker-state-model";
import TexasHoldemPoker from "../view-models/texas-holdem-poker";
import TexasHoldemPokerBettingArea from "../view-models/texas-holdem-poker-betting-area";
import TexasHoldemPokerChips from "../view-models/texas-holdem-poker-chip";
import { TexasHoldemPokerChoicesConst } from "../contants";

export const showHideButtons = (main: TexasHoldemPoker) => (stateModel: TexasHoldemPokerStateModel) => {
    switch (stateModel.state) {
        case TexasHoldemPokerState.ante_bet:
            main.dealButton.active = main.cancelButton.active = main.doubleButton.active = true;
            main.reBetAndDealButton.active = main.newButton.active = false;
            break;
        case TexasHoldemPokerState.blank_new:
            main.dealButton.active = main.cancelButton.active = main.doubleButton.active = false;
            main.reBetAndDealButton.active = main.newButton.active = false;
            break;
        case TexasHoldemPokerState.prepare_new:
            main.reBetAndDealButton.active = main.newButton.active = true;
            main.callButton.active = main.foldButton.active = false;
            main.dealButton.active = main.doubleButton.active = main.cancelButton.active = false;
            break;
        case TexasHoldemPokerState.replay_new:
            main.reBetAndDealButton.active = true;
            main.callButton.active = main.foldButton.active = false;
            main.dealButton.active = main.doubleButton.active = main.cancelButton.active = main.newButton.active = false;
            break;
        case TexasHoldemPokerState.calling_deal:
            main.dealButton.active = main.doubleButton.active = main.cancelButton.active = false;
            main.reBetAndDealButton.active = main.newButton.active = false;
            break;
        case TexasHoldemPokerState.dealing:
            break;
        case TexasHoldemPokerState.dealt:
            main.callButton.active = main.foldButton.active = true;
            break;
        case TexasHoldemPokerState.calling_call:
        case TexasHoldemPokerState.calling_fold:
            main.callButton.active = main.foldButton.active = false;
            break;
        case TexasHoldemPokerState.calling_called:
            main.turnButton.active = main.checkTurnButton.active = true;
            main.callButton.active = main.foldButton.active = false;
            break;
        case TexasHoldemPokerState.calling_check_turn:
        case TexasHoldemPokerState.calling_turning:
            main.turnButton.active = main.checkTurnButton.active = false;
            break;
        case TexasHoldemPokerState.calling_turned:
            main.riverButton.active = main.checkRiverButton.active = true;
            main.turnButton.active = main.checkTurnButton.active = false;
            break;
        case TexasHoldemPokerState.calling_rivering:
        case TexasHoldemPokerState.calling_check_river:
            main.riverButton.active = main.checkRiverButton.active = false;
        case TexasHoldemPokerState.settled:
            main.riverButton.active = main.checkRiverButton.active = false;
            break;
    }
};
export const showPlaceBetChips =
    (
        bettingAreas: TexasHoldemPokerBettingArea[],
        slidingChips: BetChips,
        shadowChip: cc.SpriteFrame,
        texasHoldemPokerChips: TexasHoldemPokerChips,
        gameData: TexasHoldemPokerGameData<TexasHoldemPokerChoicesType>
    ) =>
    ({ currentChoice, currentAmount, totalAmount }) => {
        const bettingArea = bettingAreas.filter((a) => a.betChoice === currentChoice)[0];
        if (bettingArea && bettingArea.chipNode) {
            texasHoldemPokerChips.flyChipToBetPlace(slidingChips, bettingArea.chipNode, shadowChip, currentAmount, totalAmount);
        }
    };

export const clearBetChips =
    (bettingAreas: TexasHoldemPokerBettingArea[]) =>
    ({ currentChoice }) => {
        const bettingArea = bettingAreas.filter((a) => a.betChoice === currentChoice)[0];
        if (bettingArea && bettingArea.chipNode) {
            bettingArea.chipNode.removeAllChildren();
            bettingArea.handleWinningAmount(0, false);
        }
    };

export const clearAllBetChips = (bettingAreas: TexasHoldemPokerBettingArea[]) => () => {
    clearBetChips(bettingAreas)({ currentChoice: TexasHoldemPokerChoicesConst.anteBet });
    clearBetChips(bettingAreas)({ currentChoice: TexasHoldemPokerChoicesConst.callBet });
    clearBetChips(bettingAreas)({ currentChoice: TexasHoldemPokerChoicesConst.turnBet });
    clearBetChips(bettingAreas)({ currentChoice: TexasHoldemPokerChoicesConst.riverBet });
    clearUIData(bettingAreas)();
};

export const updateChips =
    (
        bettingAreas: TexasHoldemPokerBettingArea[],
        slidingChips: BetChips,
        shadowChip: cc.SpriteFrame,
        texasHoldemPokerChips: TexasHoldemPokerChips
    ) =>
    ({ choice, totalAmount }) => {
        const bettingArea = bettingAreas.filter((a) => a.betChoice === choice)[0];
        if (bettingArea && bettingArea.chipNode) {
            texasHoldemPokerChips.updateChipStack(slidingChips, bettingArea.chipNode, shadowChip, totalAmount);
        }
    };

export const updateAllChips =
    (
        bettingAreas: TexasHoldemPokerBettingArea[],
        slidingChips: BetChips,
        shadowChip: cc.SpriteFrame,
        texasHoldemPokerChips: TexasHoldemPokerChips
    ) =>
    (placeBetModel: TexasHoldemPokerPlaceBetModel) => {
        if (placeBetModel.choices[TexasHoldemPokerChoicesConst.anteBet] !== 0) {
            updateChips(
                bettingAreas,
                slidingChips,
                shadowChip,
                texasHoldemPokerChips
            )({ choice: TexasHoldemPokerChoicesConst.anteBet, totalAmount: placeBetModel.choices[TexasHoldemPokerChoicesConst.anteBet] });
        }
        if (placeBetModel.choices[TexasHoldemPokerChoicesConst.callBet] !== 0) {
            updateChips(
                bettingAreas,
                slidingChips,
                shadowChip,
                texasHoldemPokerChips
            )({ choice: TexasHoldemPokerChoicesConst.callBet, totalAmount: placeBetModel.choices[TexasHoldemPokerChoicesConst.callBet] });
        }
        if (placeBetModel.choices[TexasHoldemPokerChoicesConst.turnBet] !== 0) {
            updateChips(
                bettingAreas,
                slidingChips,
                shadowChip,
                texasHoldemPokerChips
            )({ choice: TexasHoldemPokerChoicesConst.turnBet, totalAmount: placeBetModel.choices[TexasHoldemPokerChoicesConst.turnBet] });
        }
    };

export const showHideTooltip = (bettingAreas: TexasHoldemPokerBettingArea[]) => (stateModel: TexasHoldemPokerStateModel) => {
    switch (stateModel.state) {
        case TexasHoldemPokerState.calling_deal:
        case TexasHoldemPokerState.dealt:
            bettingAreas[0].showTooltip(false);
            break;
        case TexasHoldemPokerState.ante_bet:
            bettingAreas[0].showTooltip(false);
            break;
        case TexasHoldemPokerState.blank_new:
        case TexasHoldemPokerState.replay_new:
            bettingAreas[0].showTooltip(true);
            break;
        default:
            bettingAreas[0].showTooltip(false);
            break;
    }
};

export const showOwnBet =
    (gameData: TexasHoldemPokerGameData<TexasHoldemPokerChoicesType>, bettingAreas: TexasHoldemPokerBettingArea[]) => () => {
        const renderOwnBet = (bettingAreas: TexasHoldemPokerBettingArea[], choice: string, ownBetValue) => {
            const bettingArea = bettingAreas.find((e) => e.betChoice === choice);
            bettingArea.ownBets = ownBetValue;
            bettingArea.showBetValue(true);
            bettingArea.showBetText(false);
        };
        if (gameData.placeBetModel.choices[TexasHoldemPokerChoicesConst.anteBet]) {
            renderOwnBet(
                bettingAreas,
                TexasHoldemPokerChoicesConst.anteBet,
                gameData.placeBetModel.choices[TexasHoldemPokerChoicesConst.anteBet]
            );
        }
        if (gameData.placeBetModel.choices[TexasHoldemPokerChoicesConst.callBet]) {
            renderOwnBet(
                bettingAreas,
                TexasHoldemPokerChoicesConst.callBet,
                gameData.placeBetModel.choices[TexasHoldemPokerChoicesConst.callBet]
            );
        }
        if (gameData.placeBetModel.choices[TexasHoldemPokerChoicesConst.turnBet]) {
            renderOwnBet(
                bettingAreas,
                TexasHoldemPokerChoicesConst.turnBet,
                gameData.placeBetModel.choices[TexasHoldemPokerChoicesConst.turnBet]
            );
        }
        if (gameData.placeBetModel.choices[TexasHoldemPokerChoicesConst.riverBet]) {
            renderOwnBet(
                bettingAreas,
                TexasHoldemPokerChoicesConst.riverBet,
                gameData.placeBetModel.choices[TexasHoldemPokerChoicesConst.riverBet]
            );
        }
    };

export const clearUIData = (bettingAreas: TexasHoldemPokerBettingArea[]) => () => {
    for (const [key] of Object.entries(bettingAreas)) {
        bettingAreas[key].showBetValue(false);
        bettingAreas[key].showBetText(true);
    }
};

export const updateTotalBetLabel = (totalBetLabel: cc.Label) => (placingModel: TexasHoldemPokerPlaceBetModel) => {
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

export const prepareNewRound = (placeBet: TexasHoldemPokerPlaceBetModel) => () => {
    placeBet.prepareNewRound();
};
