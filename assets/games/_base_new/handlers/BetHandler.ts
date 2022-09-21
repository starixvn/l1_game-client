import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import NewGameData from "../models/NewGameData";

type Choices = any;
export type BetEventType = {
    ownBets: Choices;
    endBet: number;
    ownChip: any;
    betPercentage: any;
    betChoice: string;
    chips?: any;
    gameConfigs?: any;
};

export class BetHandler extends BaseEventHandler<BetEventType> {
    protected readonly gameData: NewGameData;
    protected verifyEvent(event: BetEventType) {
        return !!event.ownBets || !!event.ownChip || !!event.endBet || !!event.betPercentage || !!event.chips;
    }

    protected handle(event: BetEventType) {
        if (event.endBet) {
            if (event.endBet === -1) {
                this.gameData.betModel.placeBetFailed();
            } else {
                this.gameData.betModel.placeBetSuccess(event.endBet);
                this.gameData.betModel.flyOwnChip({ endBet: event.endBet, betChoice: event.betChoice });
            }
        }

        if (event.ownBets) {
            this.gameData.betModel.changeOwnBets(event.ownBets);
            const isInGame = event.gameConfigs !== undefined;
            isInGame && this.gameData.betModel.actionFlyOwnChipFake(event.ownBets);
        }

        if (event.ownChip) {
            this.gameData.betModel.changeOwnChip(event.ownChip);
        }

        if (event.betPercentage) {
            this.gameData.betModel.changeBetPercentage(event.betPercentage);
        }
        if (event.chips) {
            this.gameData.betModel.updateTotalChips(event.chips);
        }
    }
}
