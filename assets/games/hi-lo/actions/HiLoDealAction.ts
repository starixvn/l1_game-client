import HiLoStakes from "../view-models/HiLoStakes";
import HiLo from "../view-models/HiLo";
import { HiLoStatusModel } from "../events-models/HiLoStatusModel";
import { HiLoResultModel } from "../events-models/HiLoResultModel";
import main = require("../../../../packages/i18n/main");

export const updateStakes = (stakeComp: HiLoStakes) => (resultModel: HiLoResultModel) => {
    stakeComp.updateStakes(resultModel.nextAmount);
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

    cc.tween(mainGame)
        .delay(statusModel.win ? mainGame.winningEffectDuration : mainGame.loseMessageEffectDuration + mainGame.spinCardsEffectDuration)
        .call(() => {
            mainGame.gameData.stateModel.prepareNewRound();
        })
        .start();
};

export const updateCard = (mainGame: HiLo) => (resultModel: HiLoResultModel) => {
    if (resultModel.result.length > 0) {
        if (resultModel.remainingTime > mainGame.config.betTime) {
            mainGame.resultComp.spin(mainGame.spinCardsEffectDuration, true);
        } else {
            mainGame.resultComp.spin(mainGame.spinCardsEffectDuration, false);
        }
        mainGame.resultComp.updateResult(resultModel.result[resultModel.result.length - 1]);
    }
};

export const updateStatistic = (mainGame: HiLo) => (resultModel: HiLoResultModel) => {
    if (resultModel.result.length > 0) {
        mainGame.guideNode.active = false;
        mainGame.statisticContainer.active = true;
        if (mainGame.gameData.resultModel.totalTurns === 0) {
            mainGame.statisticComp.clearCards();
        }
        cc.tween(mainGame.statisticContainer)
            .delay(mainGame.spinCardsEffectDuration)
            .call(() => {
                mainGame.statisticComp.updateCards(resultModel.result);
            })
            .start();
    }
};
