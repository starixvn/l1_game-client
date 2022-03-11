import TexasHoldemPokerErrorUIEventHandler, {
    TexasHoldemAPIError
} from "../../../../assets/games/texas-holdem-poker/event-handlers/texas-holdem-poker-error-ui-event-handler";
import TexasHoldemPokerGameData from "../../../../assets/games/texas-holdem-poker/event-models/texas-holdem-poker-game-data";
import TexasHoldemPokerStateModel from "./../../../../assets/games/texas-holdem-poker/event-models/texas-holdem-poker-state-model";

jest.mock("../../../../assets/games/texas-holdem-poker/event-models/texas-holdem-poker-game-data", () => ({
    default: jest.fn().mockImplementation(() => {
        return {
            constructor: jest.fn()
        };
    })
}));

jest.mock("./../../../../assets/games/texas-holdem-poker/event-models/texas-holdem-poker-state-model", () => ({
    default: jest.fn().mockImplementation(() => {
        return {
            receiveError: jest.fn()
        };
    })
}));

describe("TexasHoldemErrorUIEventHandler", () => {
    let errorHandler: any;
    let gameData: TexasHoldemPokerGameData<any>;
    let data: TexasHoldemAPIError;
    beforeAll(() => {
        errorHandler = new TexasHoldemPokerErrorUIEventHandler(gameData);
        errorHandler.gameData = new TexasHoldemPokerGameData();
        errorHandler.gameData.stateModel = new TexasHoldemPokerStateModel();
        data = {
            apiError: {
                errorCode: 3001,
                message: "An error has occurred, please contact CSD for details. (%{errorCode})",
                isPlaceBetFailed: true,
                gameRoundId: 1,
                gameTypeId: 1
            },
            endBet: 1,
            betChoice: "anteBet"
        };
    });

    describe("verifyEvent", () => {
        it("should return true if data has apiError", () => {
            // Arrange

            // Act
            errorHandler.verifyEvent(data);

            // Assert
            expect(errorHandler.verifyEvent(data)).toEqual(true);
        });

        it("should return false if data has not gameConfigs", () => {
            // Arrange
            data.apiError = null;

            // Act
            errorHandler.verifyEvent(data);

            // Assert
            expect(errorHandler.verifyEvent(data)).toEqual(false);
        });
    });

    describe("handle", () => {
        it("should call apiError.receiveError", () => {
            // Arrange
            const changeApiErrorSpy = jest.spyOn(errorHandler.gameData.stateModel, "receiveError");

            // Act
            errorHandler.handle(data);

            // Assert
            expect(changeApiErrorSpy).toBeCalledTimes(1);
            expect(changeApiErrorSpy).toBeCalledWith(data);
        });
    });
});
