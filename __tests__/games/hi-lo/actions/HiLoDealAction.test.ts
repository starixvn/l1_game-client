import AudioManager from "../../../../assets/common/audio/AudioManager";
import { handleStatusWon, updateStakes } from "../../../../assets/games/hi-lo/actions/HiLoDealAction";
import { HiLoOwnBetsModel } from "../../../../assets/games/hi-lo/events-models/HiLoOwnBetsModel";
import { HiLoStakeModel } from "../../../../assets/games/hi-lo/events-models/HiLoStakeModel";
import { HiLoStateModel } from "../../../../assets/games/hi-lo/events-models/HiLoStateModel";
import { HiLoStatusModel } from "../../../../assets/games/hi-lo/events-models/HiLoStatusModel";
import HiLo from "../../../../assets/games/hi-lo/view-models/HiLo";

jest.mock("../../../../assets/common/audio/AudioManager", () => jest.requireActual("../../../mocks/MockedAudioManager"));

jest.mock("../../../../assets/games/hi-lo/view-models/HiLo", () => ({
    default: jest.fn().mockImplementation(() => {
        return {
            resetUIBlankNewState: jest.fn(),
            showProcessingWarning: jest.fn(),
            showPlayGameButton: jest.fn(),
            updateUserBalance: jest.fn(),
            resetUIPrepareNewRound: jest.fn(),
            showWinningBet: jest.fn().mockResolvedValue((value: number) => {}),

            stakesComp: {
                updateStakes: jest.fn()
            },

            betBoardComp: {
                setCurrentBet: jest.fn(),
                disableBetBoard: jest.fn()
            },
            currentBet: 1,
            isStopSchedule: false,

            gameData: {
                stateModel: new HiLoStateModel()
            },
            collectAudioClip: {}
        };
    })
}));

jest.mock("../../../../assets/games/hi-lo/events-models/HiLoStateModel", () => {
    return {
        HiLoStateModel: () => ({
            state: 0,
            prepareNewRound: jest.fn()
        })
    };
});

describe("HiLoDealAction", () => {
    let mainGame: HiLo;
    let ownBetsModel: HiLoOwnBetsModel;
    let statusModel: HiLoStatusModel;
    let playSFX: any;

    beforeAll(() => {
        mainGame = new HiLo();
        ownBetsModel = new HiLoOwnBetsModel();
    });

    describe("updateStakes", () => {
        it("should not call updateStakes when nextAmounts null", () => {
            // Arrange
            ownBetsModel.nextAmounts = null;

            // Act
            updateStakes(mainGame)(ownBetsModel);

            // Assert
            expect(mainGame.stakesComp.updateStakes).not.toBeCalled();
        });
        it("should call updateStakes when nextAmounts not null", () => {
            // Arrange
            ownBetsModel.nextAmounts = {} as HiLoStakeModel;

            // Act
            updateStakes(mainGame)(ownBetsModel);

            // Assert
            expect(mainGame.stakesComp.updateStakes).toBeCalledWith(ownBetsModel.nextAmounts);
        });
    });

    describe("handleStatusWon", () => {
        beforeEach(() => {
            // Arrange
            statusModel = new HiLoStatusModel();
            playSFX = jest.spyOn(AudioManager.getInstance(), "playSFX");
        });

        it("should call playSFX", () => {
            // Act
            handleStatusWon(mainGame)(statusModel);
            // Assert
            expect(playSFX).toBeCalledWith(mainGame.collectAudioClip);
        });

        it("should call updateUserBalance", () => {
            // Act
            handleStatusWon(mainGame)(statusModel);
            // Assert
            expect(mainGame.updateUserBalance).toHaveBeenCalledTimes(1);
        });
        it("should call resetUIPrepareNewRound", () => {
            // Act
            handleStatusWon(mainGame)(statusModel);

            // Assert
            expect(mainGame.resetUIPrepareNewRound).toBeCalledTimes(1);
        });
        it("should call showWinningBet", () => {
            // Act
            handleStatusWon(mainGame)(statusModel);

            // Assert
            expect(mainGame.showWinningBet).toBeCalledTimes(1);
        });
        it("should not call prepareNewRound from mainGame.gameData.stateModel immediately", () => {
            // Act
            handleStatusWon(mainGame)(statusModel);

            // Assert
            expect(mainGame.gameData.stateModel.prepareNewRound).not.toBeCalled();
        });

        it("should call prepareNewRound from mainGame.gameData.stateModel after showWinningBet ", async () => {
            // Arrange
            mainGame = new HiLo();

            // Act
            await handleStatusWon(mainGame)(statusModel);

            // Assert
            expect(mainGame.gameData.stateModel.prepareNewRound).toHaveBeenCalledTimes(1);
        });
    });
});
