import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import NewGameData from "../models/NewGameData";

type Choices = any;
export type BetEventType = {
    ownBets: Choices;
    endBet: number;
    ownChip: any;
    betPercentage: any;
};

export class BetHandler extends BaseEventHandler<BetEventType> {
    protected readonly gameData: NewGameData;
    protected verifyEvent(event: BetEventType) {
        return !!event.ownBets || !!event.ownChip || !!event.endBet || !!event.betPercentage;
    }

    protected handle(event: BetEventType) {
        if (event.endBet) {
            if (event.endBet === -1) {
                this.gameData.betModel.placeBetFailed();
            } else {
                this.gameData.betModel.placeBetSuccess(event.endBet);
            }
        }

        if (event.ownBets) {
            this.gameData.betModel.changeOwnBets(event.ownBets);
        }

        if (event.ownChip) {
            this.gameData.betModel.changeOwnChip(event.ownChip);
        }

        if (event.betPercentage) {
            this.gameData.betModel.changeBetPercentage(event.betPercentage);
        }
    }
}
