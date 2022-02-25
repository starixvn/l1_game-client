import { handleGameState } from "../../../../assets/games/hi-lo/actions/HiLoBetAction";
import { HiLoState } from "../../../../assets/games/hi-lo/events-models/HiLoState";
import { HiLoStateModel } from "../../../../assets/games/hi-lo/events-models/HiLoStateModel";
import HiLo from "../../../../assets/games/hi-lo/view-models/HiLo";

jest.mock("../../../../assets/games/hi-lo/view-models/HiLo", () => ({
    default: jest.fn().mockImplementation(() => {
        return {
            resetUIBlankNewState: jest.fn(),
            showProcessingWarning: jest.fn(),

            stakesComp: {
                resetStakes: jest.fn()
            },

            betBoardComp: {
                setCurrentBet: jest.fn()
            },
            currentBet: 1
        };
    })
}));

jest.mock("../../../../assets/games/hi-lo/events-models/HiLoStateModel", () => {
    return {
        HiLoStateModel: () => ({
            state: 0
        })
    };
});

describe("HiLoBetAction", () => {
    let mainGame: HiLo;
    let stateModel: HiLoStateModel;
    beforeAll(() => {
        mainGame = new HiLo();
        stateModel = new HiLoStateModel();
    });

    describe("handleGameState", () => {
        describe("HiLoState.BLANK_NEW", () => {
            it("should call resetUIBlankNewState", () => {
                // Arrange
                stateModel.state = HiLoState.BLANK_NEW;

                // Act
                handleGameState(mainGame)(stateModel);

                // Assert
                expect(mainGame.resetUIBlankNewState).toBeCalledTimes(1);
            });
        });
    });
});
