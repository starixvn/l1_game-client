import { HiLoState } from "../events-models/HiLoState";
import { HiLoStateModel } from "../events-models/HiLoStateModel";
import HiLo from "../view-models/HiLo";
import { HiloChoicesConst } from "../events-models/HiLoChoices";

export const handleGameState = (mainGame: HiLo) => (stateModel: HiLoStateModel) => {
    const highestRank = "A";
    const lowestRank = "2";
    switch (stateModel.state) {
        case HiLoState.BLANK_NEW:
            mainGame.showPlayGameButton(true);
            mainGame.enableAllBetOption(false);
            mainGame.enableCollectButton(false);
            mainGame.stakesComp.setBetWin(mainGame.betAmount);
            mainGame.stakesComp.resetHigherLowerStakes();
            mainGame.resultComp.resetNewRound();
            break;
        case HiLoState.IN_TURN:
            mainGame.showPlayGameButton(false);
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
            mainGame.enableCollectButton(true);
            break;
        case HiLoState.SETTLED:
            mainGame.showPlayGameButton(false);
            mainGame.enableAllBetOption(false);
            mainGame.enableCollectButton(false);
            break;
        default:
            break;
    }
};
