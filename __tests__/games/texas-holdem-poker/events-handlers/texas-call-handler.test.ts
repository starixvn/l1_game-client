import { callData } from "./../_base/index";
import TexasCallHandler, { TexasHoldemCall } from "../../../../assets/games/texas-holdem-poker/event-handlers/texas-call-handler";
import TexasCallModel from "../../../../assets/games/texas-holdem-poker/event-models/texas-call-model";
import TexasGameDataModel from "../../../../assets/games/texas-holdem-poker/event-models/texas-game-data-model";
import TexasPlaceBetModel from "../../../../assets/games/texas-holdem-poker/event-models/texas-place-bet-model";
import { convertChoices } from "../../../../assets/games/texas-holdem-poker/texas-helper";

jest.mock("../../../../assets/games/texas-holdem-poker/event-models/texas-game-data-model", () => ({
    default: jest.fn().mockImplementation(() => {
        return {
            constructor: jest.fn()
        };
    })
}));

jest.mock("../../../../assets/games/texas-holdem-poker/event-models/texas-place-bet-model", () => ({
    default: jest.fn().mockImplementation(() => {
        return {
            updateTotalBet: jest.fn()
        };
    })
}));

describe("TexasHoldemCallEventHandler", () => {
    let callHandlerHandler: any;
    let gameData: TexasGameDataModel<any>;
    let data: TexasHoldemCall;
    beforeAll(() => {
        callHandlerHandler = new TexasCallHandler(gameData);
        callHandlerHandler.gameData = new TexasGameDataModel();
        callHandlerHandler.gameData.placeBetModel = new TexasPlaceBetModel();
        callHandlerHandler.gameData.callModel = new TexasCallModel();
        data = callData;
    });

    describe("verifyEvent", () => {
        it("should return true if data has  callHandler", () => {
            // Arrange

            // Act
            callHandlerHandler.verifyEvent(data);

            // Assert
            expect(callHandlerHandler.verifyEvent(data)).toEqual(true);
        });

        it("should return false if data has not  callHandler", () => {
            // Arrange
            const cloneData = { ...data };
            cloneData.call = null;

            // Act
            callHandlerHandler.verifyEvent(cloneData);

            // Assert
            expect(callHandlerHandler.verifyEvent(cloneData)).toEqual(false);
        });
    });

    describe("handle", () => {
        it("should call callHandler.changeDataAfterCall", () => {
            // Arrange
            const changeDataBetSpy = jest.spyOn(callHandlerHandler.gameData.callModel, "changeDataAfterCall");

            // Act
            callHandlerHandler.handle(data);

            // Assert
            expect(changeDataBetSpy).toBeCalledTimes(1);
            expect(changeDataBetSpy).toBeCalledWith(data.call.communityCards, data.call.combinationResult, data.call.totalAmount);
        });
        it("should call callHandler.updateTotalBet", () => {
            // Arrange
            const changeTotalBetSpy = jest.spyOn(callHandlerHandler.gameData.placeBetModel, "updateTotalBet");
            const source = { totalBet: data.call.totalAmount, choice: convertChoices(data.call.choices) };

            // Act
            callHandlerHandler.handle(data);

            // Assert
            expect(changeTotalBetSpy).toBeCalledTimes(1);
            expect(changeTotalBetSpy).toBeCalledWith(source);
        });
    });
});
