import AudioManager from "../../../common/audio/AudioManager";
import { HiLoOwnBetsModel } from "../events-models/HiLoOwnBetsModel";
import { HiLoStatusModel } from "../events-models/HiLoStatusModel";
import HiLo from "../view-models/HiLo";

export const updateStakes = (mainGame: HiLo) => (model: HiLoOwnBetsModel) => {
    cc.tween(mainGame.stakesComp)
        .delay(mainGame.getDelayTimeWhenSpinCard(model))
        .call(() => {
            model.nextAmounts && mainGame.stakesComp.updateStakes(model.nextAmounts);
        })
        .start();
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

export const updateCard = (mainGame: HiLo) => (model: HiLoOwnBetsModel) => {
    mainGame.resultComp.updateResult(model.result);
    mainGame.resultComp.spin(mainGame.spinCardsEffectDuration, model.remainingTime > mainGame.config.betTime);
};

export const updateStatistic = (mainGame: HiLo) => (model: HiLoOwnBetsModel) => {
    mainGame.topAreaComp.showGuideInfo(false);
    cc.tween(mainGame.topArea)
        .delay(mainGame.getDelayTimeWhenSpinCard(model))
        .call(() => {
            mainGame.topAreaComp.statisticComp.updateCards(model.result);
        })
        .start();
};
