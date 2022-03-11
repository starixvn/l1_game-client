import TexasHoldemPokerCallEventHandler, {
    TexasHoldemCall
} from "../../../../assets/games/texas-holdem-poker/event-handlers/texas-holdem-poker-call-event-handler";
import TexasHoldemPokerCallModel from "../../../../assets/games/texas-holdem-poker/event-models/texas-holdem-poker-call-model";
import TexasHoldemPokerGameData from "../../../../assets/games/texas-holdem-poker/event-models/texas-holdem-poker-game-data";
import TexasHoldemPokerPlaceBetModel from "../../../../assets/games/texas-holdem-poker/event-models/texas-holdem-poker-place-bet-model";
import { convertChoices } from "../../../../assets/games/texas-holdem-poker/texas-helper";

jest.mock("../../../../assets/games/texas-holdem-poker/event-models/texas-holdem-poker-game-data", () => ({
    default: jest.fn().mockImplementation(() => {
        return {
            constructor: jest.fn()
        };
    })
}));

jest.mock("../../../../assets/games/texas-holdem-poker/event-models/texas-holdem-poker-place-bet-model", () => ({
    default: jest.fn().mockImplementation(() => {
        return {
            updateTotalBet: jest.fn()
        };
    })
}));

describe("TexasHoldemCallEventHandler", () => {
    let callHandlerHandler: any;
    let gameData: TexasHoldemPokerGameData<any>;
    let data: TexasHoldemCall;
    beforeAll(() => {
        callHandlerHandler = new TexasHoldemPokerCallEventHandler(gameData);
        callHandlerHandler.gameData = new TexasHoldemPokerGameData();
        callHandlerHandler.gameData.placeBetModel = new TexasHoldemPokerPlaceBetModel();
        callHandlerHandler.gameData.callModel = new TexasHoldemPokerCallModel();
        data = {
            call: {
                choices: {
                    ante: 5,
                    call: 10
                },
                combinationResult: {
                    player: {
                        id: 2,
                        combinationCards: [
                            {
                                rank: 9,
                                suit: 3
                            },
                            {
                                rank: 9,
                                suit: 0
                            }
                        ],
                        cards: [
                            {
                                rank: 9,
                                suit: 3
                            },
                            {
                                rank: 9,
                                suit: 0
                            },
                            {
                                rank: 3,
                                suit: 1
                            },
                            {
                                rank: 2,
                                suit: 3
                            },
                            {
                                rank: 1,
                                suit: 0
                            }
                        ]
                    }
                },

                communityCards: [
                    {
                        rank: 3,
                        suit: 1
                    },
                    {
                        rank: 1,
                        suit: 0
                    },
                    {
                        rank: 9,
                        suit: 0
                    }
                ],
                totalAmount: 15
            }
        };
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
