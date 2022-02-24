import { HiloChoicesConst } from "../events-models/HiLoChoices";
import { HiLoOwnBetsModel } from "../events-models/HiLoOwnBetsModel";
import { HiLoState } from "../events-models/HiLoState";
import { HiLoStateModel } from "../events-models/HiLoStateModel";
import HiLo from "../view-models/HiLo";

export const handleGameState = (mainGame: HiLo) => (stateModel: HiLoStateModel) => {
    mainGame.showProcessingWarning(false);

    switch (stateModel.state) {
        case HiLoState.BLANK_NEW:
            mainGame.resetUIBlankNewState();
            mainGame.stakesComp.resetStakes(mainGame.currentBet);
            mainGame.betBoardComp.setCurrentBet(mainGame.currentBet.toString());
            break;
        case HiLoState.START_TURN:
            handleBaseResult(mainGame, mainGame.gameData.ownBetsModel);
            mainGame.showPlayGameButton(false);
            break;

        case HiLoState.IN_TURN:
            handleBaseResult(mainGame, mainGame.gameData.resultModel);
            break;

        case HiLoState.SETTLED:
            const disabledDelayTime = mainGame.gameData.statusModel.win ? 0 : mainGame.spinCardsEffectDuration;
            cc.tween(mainGame)
                .delay(disabledDelayTime)
                .call(() => {
                    mainGame.resetUIPrepareNewRound();
                })
                .start();

            mainGame.showPlayGameButton(false);
            mainGame.betBoardComp.disableBetBoard(true);
            break;
        default:
            break;
    }
};

export const handleBaseResult = (mainGame: HiLo, model: HiLoOwnBetsModel) => {
    const highestRank = "A";
    const lowestRank = "2";
    const currentResult = model.result[model.result.length - 1];

    mainGame.betBoardComp.disableBetBoard(true);
    mainGame.isStopSchedule = false;
    if (model.nextAmounts) {
        cc.tween(mainGame)
            .delay(mainGame.getDelayTimeWhenSpinCard(model))
            .call(() => {
                mainGame.bettingAreas.forEach((area) => {
                    let isSpecialCase = false;
                    if (
                        (currentResult.rank === highestRank && area.betChoice === HiloChoicesConst.higher) ||
                        (currentResult.rank === lowestRank && area.betChoice === HiloChoicesConst.lower)
                    ) {
                        isSpecialCase = true;
                    }
                    area.enableBetChoice(!isSpecialCase);
                });
                mainGame.enableCollectButton(model.totalTurns > 0);
            })
            .start();
    }
};
