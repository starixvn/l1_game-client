import HiLo from "../view-models/HiLo";
import { HiLoStatusModel } from "../events-models/HiLoStatusModel";
import { HiLoOwnBetsModel } from "../events-models/HiLoOwnBetsModel";

export const updateStakes = (mainGame: HiLo) => (model: HiLoOwnBetsModel) => {
    cc.tween(mainGame.stakesComp)
        .delay(mainGame.getDelayTimeWhenSpinCard(model))
        .call(() => {
            mainGame.stakesComp.updateStakes(model.nextAmount);
        })
        .start();
};

export const handleSettle = (mainGame: HiLo) => (statusModel: HiLoStatusModel) => {
    mainGame.enableAllBetOptions(false);
    mainGame.enableCollectButton(false);

    let newRoundDelayTime;
    if (statusModel.win) {
        newRoundDelayTime = mainGame.winningEffectDuration;
        mainGame.showWinningBet(statusModel.bet);
        mainGame.updateUserBalance();
    } else {
        newRoundDelayTime = mainGame.loseMessageEffectDuration + mainGame.spinCardsEffectDuration;
        mainGame.showUserLoseMessage();
    }

    cc.tween(mainGame)
        .delay(newRoundDelayTime)
        .call(() => {
            mainGame.gameData.stateModel.prepareNewRound();
        })
        .start();
};

export const updateCard = (mainGame: HiLo) => (model: HiLoOwnBetsModel) => {
    mainGame.resultComp.updateResult(model.result[model.result.length - 1]);
    if (model.remainingTime > mainGame.config.betTime) {
        mainGame.resultComp.spin(mainGame.spinCardsEffectDuration, true);
    } else {
        mainGame.resultComp.spin(mainGame.spinCardsEffectDuration, false);
    }
};

export const updateStatistic = (mainGame: HiLo) => (model: HiLoOwnBetsModel) => {
    mainGame.topAreaComp.showGuideInfo(false);
    if (model.totalTurns === 0) {
        mainGame.topAreaComp.statisticComp.clearCards();
    }

    cc.tween(mainGame.topArea)
        .delay(mainGame.getDelayTimeWhenSpinCard(model))
        .call(() => {
            mainGame.topAreaComp.statisticComp.updateCards(model.result);
        })
        .start();
};
