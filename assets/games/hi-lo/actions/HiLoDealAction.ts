import HiLo from "../view-models/HiLo";
import { HiLoStatusModel } from "../events-models/HiLoStatusModel";
import { HiLoResultModel } from "../events-models/HiLoResultModel";

export const updateStakes = (mainGame: HiLo) => (resultModel: HiLoResultModel) => {
    cc.tween(mainGame.stakesComp)
        .delay(mainGame.spinCardsEffectDuration)
        .call(() => {
            mainGame.stakesComp.updateStakes(resultModel.nextAmount);
        })
        .start();
};

export const handleSettle = (mainGame: HiLo) => (statusModel: HiLoStatusModel) => {
    if (!statusModel.win) {
        mainGame.showUserLoseMessage();
    } else {
        mainGame.showWinningBet(statusModel.bet);
        mainGame.updateUserBalance();
    }

    mainGame.enableAllBetOptions(false);
    mainGame.enableCollectButton(false);

    const delayTime = statusModel.win
        ? mainGame.winningEffectDuration
        : mainGame.loseMessageEffectDuration + mainGame.spinCardsEffectDuration;

    cc.tween(mainGame)
        .delay(delayTime)
        .call(() => {
            mainGame.gameData.stateModel.prepareNewRound();
        })
        .start();
};

export const updateCard = (mainGame: HiLo) => (resultModel: HiLoResultModel) => {
    if (resultModel.result.length > 0) {
        if (resultModel.remainingTime > mainGame.config.betTime) {
            mainGame.resultComp.spin(mainGame.spinCardsEffectDuration, true);
            mainGame.isSpin = true;
        } else {
            mainGame.resultComp.spin(mainGame.spinCardsEffectDuration, false);
        }
        mainGame.resultComp.updateResult(resultModel.result[resultModel.result.length - 1]);
    }
};

export const updateStatistic = (mainGame: HiLo) => (resultModel: HiLoResultModel) => {
    if (resultModel.result.length > 0) {
        mainGame.topAreaComp.showGuideInfo(false);
        if (mainGame.gameData.resultModel.totalTurns === 0) {
            mainGame.topAreaComp.statisticComp.clearCards();
        }

        cc.tween(mainGame.topArea)
            .delay(mainGame.getDelayTimeWhenSpinCard())
            .call(() => {
                mainGame.topAreaComp.statisticComp.updateCards(resultModel.result);
            })
            .start();
    }
};
