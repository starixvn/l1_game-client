import AudioManager from "../../../common/audio/AudioManager";
import { HiloChoicesConst } from "../events-models/HiLoChoices";
import { HiLoOwnBetsModel } from "../events-models/HiLoOwnBetsModel";
import { HiLoStatusModel } from "../events-models/HiLoStatusModel";
import HiLo from "../view-models/HiLo";

export const updateStakes = (mainGame: HiLo) => (model: HiLoOwnBetsModel) => {
    model.nextAmounts && mainGame.stakesComp.updateStakes(model.nextAmounts);
};

export const handleSettle = (mainGame: HiLo) => (statusModel: HiLoStatusModel) => {
    let newRoundDelayTime;
    if (statusModel.win) {
        AudioManager.getInstance().playSFX(mainGame.collectAudioClip);
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

export const updateCard = (mainGame: HiLo) => async (model: HiLoOwnBetsModel) => {
    mainGame.resultComp.updateResult(model.result);
    await mainGame.resultComp.spin(mainGame.spinCardsEffectDuration, model.remainingTime > mainGame.config.betTime);
};

export const updateStatistic = (mainGame: HiLo) => (model: HiLoOwnBetsModel) => {
    mainGame.statisticComp.updateCards(model.result);
};

export const updateButtonCollectAndBetChoices = (mainGame: HiLo, model: HiLoOwnBetsModel) => {
    const highestRank = "A";
    const lowestRank = "2";
    const currentResult = model.result[model.result.length - 1];

    mainGame.bettingAreas.forEach((area) => {
        let isSpecialCase = true;
        if (currentResult.rank === highestRank && area.betChoice === HiloChoicesConst.higher) {
            mainGame.stakesComp.setHigherAmount("");
        } else if (currentResult.rank === lowestRank && area.betChoice === HiloChoicesConst.lower) {
            mainGame.stakesComp.setLowerAmount("");
        } else {
            isSpecialCase = false;
        }
        area.enableBetChoice(!isSpecialCase);
    });
    mainGame.enableCollectButton(model.totalTurns > 0);
};
