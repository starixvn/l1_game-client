import { HiLoState } from "../events-models/HiLoState";
import { HiLoStateModel } from "../events-models/HiLoStateModel";
import HiLo from "../view-models/HiLo";
import { HiloChoicesConst } from "../events-models/HiLoChoices";
import { HiLoOwnBetsModel } from "../events-models/HiLoOwnBetsModel";

export const handleGameState = (mainGame: HiLo) => (stateModel: HiLoStateModel) => {
    mainGame.showProcessingWarning(false);

    switch (stateModel.state) {
        case HiLoState.BLANK_NEW:
            mainGame.resetDataAndUI();
            mainGame.showPlayGameButton(true);
            mainGame.stakesComp.resetStakes(mainGame.currentBet);
            mainGame.resultComp.faceDownCards();
            mainGame.betBoardComp.disableBetBoard(false);
            break;
        case HiLoState.START_TURN:
            handleBaseResult(mainGame, mainGame.gameData.ownBetsModel);
            break;

        case HiLoState.IN_TURN:
            handleBaseResult(mainGame, mainGame.gameData.resultModel);
            break;

        case HiLoState.SETTLED:
            mainGame.resetDataAndUI();
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
    mainGame.showPlayGameButton(false);
    mainGame.betBoardComp.disableBetBoard(true);
    mainGame.isStopSchedule = false;
    cc.tween(mainGame)
        .call(() => {
            mainGame.enableAllBetOptions(false);
            mainGame.enableCollectButton(false);
        })
        .delay(mainGame.getDelayTimeWhenSpinCard())
        .call(() => {
            mainGame.bettingAreas.forEach((area) => {
                if (
                    (currentResult.rank === highestRank && area.betChoice === HiloChoicesConst.higher) ||
                    (currentResult.rank === lowestRank && area.betChoice === HiloChoicesConst.lower)
                ) {
                    area.enableBetChoice(false);
                } else {
                    area.enableBetChoice(true);
                }
            });
            mainGame.enableCollectButton(model.totalTurns > 0);
        })
        .start();
};
