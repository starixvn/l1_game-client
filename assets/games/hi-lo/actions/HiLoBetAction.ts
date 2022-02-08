import { HiLoState } from "../events-models/HiLoState";
import { HiLoStateModel } from "../events-models/HiLoStateModel";
import HiLo from "../view-models/HiLo";
import { HiloChoicesConst } from "../events-models/HiLoChoices";

export const handleGameState = (mainGame: HiLo) => (stateModel: HiLoStateModel) => {
    const highestRank = "A";
    const lowestRank = "2";

    switch (stateModel.state) {
        case HiLoState.BLANK_NEW:
            mainGame.resetDataAndUI();
            mainGame.showPlayGameButton(true);
            mainGame.stakesComp.resetStakes(mainGame.currentBet);
            mainGame.resultComp.faceDownCard();
            mainGame.betBoardComp.disableBetBoard(false);
            break;
        case HiLoState.IN_TURN:
            mainGame.showPlayGameButton(false);
            mainGame.isStopSchedule = false;
            const currentResult = mainGame.gameData.resultModel.result[mainGame.gameData.resultModel.result.length - 1];
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
            mainGame.enableCollectButton(mainGame.gameData.resultModel.totalTurns > 0);
            mainGame.betBoardComp.disableBetBoard(true);
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
