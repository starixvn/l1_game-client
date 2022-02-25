import { HiLoState } from "../events-models/HiLoState";
import { HiLoStateModel } from "../events-models/HiLoStateModel";
import HiLo from "../view-models/HiLo";

export const handleGameState = (mainGame: HiLo) => (stateModel: HiLoStateModel) => {
    mainGame.showProcessingWarning(false);

    switch (stateModel.state) {
        case HiLoState.BLANK_NEW:
            mainGame.resetUIBlankNewState();
            break;

        case HiLoState.IN_TURN:
            mainGame.showPlayGameButton(false);
            mainGame.betBoardComp.disableBetBoard(true);
            mainGame.isStopSchedule = false;
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
