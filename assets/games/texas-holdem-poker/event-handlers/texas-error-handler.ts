import TexasEventHandler from "./texas-event-handler";

export type TexasHoldemAPIError = {
    apiError: {
        errorCode: number;
        message: string;
        isPlaceBetFailed: boolean;
        gameRoundId: number;
        gameTypeId: number;
    };
    endBet: number;
    betChoice: string;
};

export default class TexasErrorHandler<Choices> extends TexasEventHandler<TexasHoldemAPIError, Choices> {
    protected verifyEvent(event: TexasHoldemAPIError) {
        return !!event.apiError;
    }

    protected handle(event: TexasHoldemAPIError) {
        this.gameData.stateModel.receiveError(event);
    }
}
