import HiLo from "../view-models/HiLo";
import { HiLoStatusModel } from "../events-models/HiLoStatusModel";
import { HiLoOwnBetsModel } from "../events-models/HiLoOwnBetsModel";
import { HiLoState } from "../events-models/HiLoState";

export const updateStakes = (mainGame: HiLo) => (model: HiLoOwnBetsModel) => {
    cc.tween(mainGame.stakesComp)
        .delay(mainGame.spinCardsEffectDuration)
        .call(() => {
            mainGame.stakesComp.updateStakes(model.nextAmount);
        })
        .start();
};

export const handleSettle = (mainGame: HiLo) => (statusModel: HiLoStatusModel) => {
    mainGame.enableAllBetOptions(false);
    mainGame.enableCollectButton(false);

    let delayTime = 0;
    if (statusModel.win) {
        delayTime = mainGame.winningEffectDuration;
        mainGame.showWinningBet(statusModel.bet);
        mainGame.updateUserBalance();
    } else {
        delayTime = mainGame.loseMessageEffectDuration + mainGame.spinCardsEffectDuration;
        cc.tween(mainGame)
            .delay(mainGame.spinCardsEffectDuration)
            .call(() => {
                mainGame.showUserLoseMessage();
            })
            .start();
    }

    cc.tween(mainGame)
        .delay(delayTime)
        .call(() => {
            mainGame.gameData.stateModel.prepareNewRound();
        })
        .start();
};

export const updateCard = (mainGame: HiLo) => (model: HiLoOwnBetsModel) => {
    if (model.result.length > 0) {
        mainGame.resultComp.updateResult(model.result[model.result.length - 1]);
        if (model.remainingTime > mainGame.config.betTime) {
            mainGame.resultComp.spin(mainGame.spinCardsEffectDuration, true);
            mainGame.isSpin = true;
        } else {
            mainGame.resultComp.spin(mainGame.spinCardsEffectDuration, false);
        }
    }
};

export const updateStatistic = (mainGame: HiLo) => (model: HiLoOwnBetsModel) => {
    if (model.result.length > 0) {
        mainGame.topAreaComp.showGuideInfo(false);
        if (model.totalTurns === 0) {
            mainGame.topAreaComp.statisticComp.clearCards();
        }

        cc.tween(mainGame.topArea)
            .delay(mainGame.getDelayTimeWhenSpinCard())
            .call(() => {
                mainGame.topAreaComp.statisticComp.updateCards(model.result);
            })
            .start();
    }
};
