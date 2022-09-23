import GameUtils from "../../../common/GameUtils";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import NoticeUtil from "../../../common/utils/NoticeUtil";
import { Durations } from "../../_new/_base/game-data-management/models/durations";
import MiniGameBase from "../view-models/MiniGameBase";
import { showCurrentRoundId, showLastRoundId } from "./TimeAction";

export const onUM = (game: MiniGameBase) => (data) => {
    if (game.checkShowUmMessage(data)) {
        game.showUmMessage(data);
        game.disableGame();
    }
};

export const checkToOffUM = (game: MiniGameBase) => (data) => {
    if (game.checkHideUmMessage(data)) {
        game.gameData.umModel.clearUM();
        game.hideUmMessage();
        game.startGame();
    }
};

export const handleNotice = (game: MiniGameBase) => (notice) => {
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

export const handleGameConfigs = (game: MiniGameBase) => (gameConfigs) => game.setGameConfigs(gameConfigs);

export const handleFirstLoadRoundHistory = (game: MiniGameBase) => (roundHistory) => {
    if (roundHistory.length === 0) {
        return;
    }

    if (game.gameData.durations.isWaiting() || game.gameData.durations.isBeingSpecificPhase(Durations.Events.SHOW_ANIMATION)) {
        const settlement = roundHistory[0];
        if (settlement) {
            game.gameData.settlement.finishShowResult(settlement, false);
        }
    }
};
export const handleRoundHistory = (game: MiniGameBase) => (roundHistory) => {
    game.currentDataLogs = roundHistory;
    game.handleRoundHistory(roundHistory);

    if (game.gameData.durations.isWaiting()) {
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

export const changeGameRound = (game: MiniGameBase) => (roundId) => game.setGameRound(roundId);
export const updateMD5String = (game: MiniGameBase) => (data) => {
    game.md5Component && game.md5Component.handleMD5Data(data);
};

export const updateBeginPlacingBet = (game: MiniGameBase) => () => {
    game.gameData.resultHash.updateUI();
    game.setWaitingDotsVisibility(false, false);
};

export const handleShowStatus = (game: MiniGameBase) => (status) => {
    game.showStatus(status);
    game.gameData.settlement.clearStatus();
};
export const handleShowResult = (game: MiniGameBase) => (settlement) => {
    if (game.isDisableGame) {
        return;
    }
    game.showSettlementResult(settlement);
    game.gameData.roundHistory.add(settlement);
    if (game.countDownProgressBar) {
        game.animatedTime.node.active = false;
        game.setWaitingDotsVisibility(true);
        game.countDownProgressBar.setIndicatorVisibility(false);
    }
};
export const handleAfterSettlementResult =
    (game: MiniGameBase) =>
    ({ settlement, animated }) => {
        if (game.isDisableGame) {
            return;
        }
        game.handleAfterSettlementResult(settlement, animated);
    };
