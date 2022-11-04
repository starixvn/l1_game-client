import GameUtils from "../../../common/GameUtils";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import NoticeUtil from "../../../common/utils/NoticeUtil";
import { GameState } from "../../_base/GameState";
import { Durations } from "../../_new/_base/game-data-management/models/durations";
import MiniGameBase from "../view-models/MiniGameBase";
import { showCurrentRoundId, showLastRoundId } from "./TimeAction";

export const onUM = (game: MiniGameBase) => (data) => {
    if (game.gameState === GameState.Disabled) {
        return;
    }
    const joinGameInUM = !!data.remainingTime;
    if (!joinGameInUM) {
        game.gameData.durations.resetTimeForUM();
    }

    if (joinGameInUM || game.checkShowUmMessage(data)) {
        game.showUmMessage(data);
        game.disableGame();
    }
};

export const checkToOffUM = (game: any) => (data) => {
    if (game.checkHideUmMessage(data)) {
        game.gameData.umModel.clearUM();
        game.hideUmMessage();
        game.startGame();
    }
};

export const handleNotice = (game: any) => (notice) => {
    const { errorCode, hedgeBetGroup, minBet, maxBet, gameRoundId, gameTypeId } = notice;
    const gameName = GameUtils.getGameNameString(gameTypeId);

    if (!gameRoundId || gameRoundId === game.roundId) {
        const opt = { gameName, gameRoundId, errorCode, minBet: numberWithCommas(minBet), maxBet: numberWithCommas(maxBet) };

        if (hedgeBetGroup && hedgeBetGroup.length > 0) {
            hedgeBetGroup.forEach((choice, index) => {
                opt[`betChoice${index + 1}`] = game.getBetChoiceString(choice);
            });
        }

        const text = NoticeUtil.getLocalizedErrorMessage(errorCode, opt);
        if (text) {
            game.showMiniWarning(text);
        }
    }
};

export const handleGameConfigs = (game: any) => (gameConfigs) => game.setGameConfigs(gameConfigs);

export const handleBoostedOdds = (game: MiniGameBase) => (boostedOdds) => game.applyPromotion(boostedOdds);

export const handleBoostedChoices = (game: MiniGameBase) => (boostedChoices) => game.setBoostedChoices(boostedChoices);

export const handleFirstLoadRoundHistory = (game: any) => (roundHistory) => {
    if (game.gameData.durations.isWaiting() || game.gameData.durations.isBeingSpecificPhase(Durations.Events.SHOW_ANIMATION)) {
        if (roundHistory.length > 0) {
            const settlement = roundHistory[0];
            if (settlement && !game.gameData.settlement.isWaitingSettlement) {
                game.gameData.settlement.finishShowResult(settlement, false);
            }
        }

        showLastRoundId(game)();
    }
    if (
        game.gameData.durations.isPlacingBet() ||
        game.gameData.durations.isLocking() ||
        game.gameData.durations.isBeingSpecificPhase(Durations.Events.STARTING_ROUND)
    ) {
        showCurrentRoundId(game)();
    }
};
export const handleRoundHistory = (game: any) => (roundHistory) => {
    game.currentDataLogs = roundHistory;
    game.handleRoundHistory(roundHistory);
};

export const handleWinningStreak = (game: any) => (roundHistory) => {
    game.callbackWinningStreak(game, roundHistory);
};

export const changeGameRound = (game: any) => (roundId) => {
    game.roundId = roundId;
    game.setGameRound(roundId);
    game.updateRebetButtonStatus();
};
export const updateMD5String = (game: any) => (data) => {
    game.md5Component && game.md5Component.handleMD5Data(data);
};

export const showHashAtPlacingBet = (game: any) => () => {
    game.gameData.resultHash.updateUI();
};

export const handleShowStatus = (game: any) => (status) => {
    game.callbackWinningResult(game, status);
    game.showStatus(status);
    game.gameData.settlement.clearStatus();
};

export const handleShowResult = (game: any) => (settlement) => {
    if (game.isDisableGame) {
        return;
    }
    if (game.rebetButton) {
        game.rebetButton.interactable = false;
    }
    game.showSettlementResult(settlement);
    game.gameData.roundHistory.add(settlement);
    game.gameData.roundHistory.checkWinningStreak(settlement, game.showResultDuration);
    if (game.countDownProgressBar) {
        game.animatedTime.node.active = false;
        game.setWaitingDotsVisibility(true);
        game.countDownProgressBar.setIndicatorVisibility(false);
    }
};

export const handleAfterSettlementResult =
    (game: any) =>
    ({ settlement, animated }) => {
        if (game.isDisableGame) {
            return;
        }
        game.handleAfterSettlementResult(settlement, animated);
    };
