import AudioManager from "../../../../assets/common/audio/AudioManager";
import {
    checkStatusLost,
    handleStatusWon,
    updateCard,
    updateStakes,
    updateStatistic,
} from "../../../../assets/games/hi-lo/actions/HiLoDealAction";
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
            showUserLoseMessage: jest.fn().mockResolvedValue((value: number) => {}),

            stakesComp: {
                updateStakes: jest.fn()
            },
            statisticComp: {
                updateCards: jest.fn()
            },

            betBoardComp: {
                setCurrentBet: jest.fn(),
                disableBetBoard: jest.fn()
            },
            resultComp: {
                updateResult: jest.fn(),
                spin: jest.fn()
            },

            currentBet: 1,
            spinCardsEffectDuration: 1,
            config: { betTime: 1 },
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

jest.mock("../../../../assets/games/hi-lo/events-models/HiLoStatusModel", () => ({
    HiLoStatusModel: () => ({
        isSettled: false,
        win: false,
        reset: jest.fn()
    })
}));

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

    describe("checkStatusLost", () => {
        beforeAll(() => {
            // Arrange
            statusModel = new HiLoStatusModel();
        });

        it("should do nothing when isSettled false", () => {
            // Arrange
            statusModel.isSettled = false;

            // Act
            checkStatusLost(mainGame)(statusModel);

            // Assert
            expect(mainGame.showUserLoseMessage).not.toBeCalled();
        });

        it("should do nothing when win true", () => {
            // Arrange
            statusModel.win = true;

            // Act
            checkStatusLost(mainGame)(statusModel);

            // Assert
            expect(mainGame.showUserLoseMessage).not.toBeCalled();
        });

        it("should call showUserLoseMessage when win false, isSettled true", () => {
            // Arrange
            statusModel.isSettled = true;
            statusModel.win = false;
            mainGame = new HiLo();

            // Act
            checkStatusLost(mainGame)(statusModel);

            // Assert
            expect(mainGame.showUserLoseMessage).toBeCalledTimes(1);
        });

        it("should not call mainGame.gameData.stateModel.prepareNewRound immediately when win false, isSettled true", () => {
            // Arrange
            statusModel.isSettled = true;
            statusModel.win = false;
            mainGame = new HiLo();

            // Act
            checkStatusLost(mainGame)(statusModel);

            // Assert
            expect(mainGame.gameData.stateModel.prepareNewRound).not.toBeCalled();
            expect(statusModel.reset).not.toBeCalled();
        });

        it("should call mainGame.gameData.stateModel.prepareNewRound after showUserLoseMessage when win false, isSettled true", async () => {
            // Arrange
            statusModel.isSettled = true;
            statusModel.win = false;
            mainGame = new HiLo();

            // Act
            await checkStatusLost(mainGame)(statusModel);

            // Assert
            expect(mainGame.gameData.stateModel.prepareNewRound).toBeCalledTimes(1);
            expect(statusModel.reset).toBeCalledTimes(1);
        });
    });

    describe("updateCard", () => {
        beforeEach(() => {
            // Act
            updateCard(mainGame)(ownBetsModel);
        });
        it("should call resultComp updateResult", () => {
            // Assert
            expect(mainGame.resultComp.updateResult).toBeCalledWith(ownBetsModel.result);
        });
        it("should call resultComp spin", () => {
            // Assert
            expect(mainGame.resultComp.spin).toBeCalledWith(
                mainGame.spinCardsEffectDuration,
                ownBetsModel.remainingTime > mainGame.config.betTime
            );
        });
    });

    describe("updateStatistic", () => {
        it("should call statisticComp updateCards", () => {
            // Act
            updateStatistic(mainGame)(ownBetsModel);
            // Assert
            expect(mainGame.statisticComp.updateCards).toBeCalledWith(ownBetsModel.result);
        });
    });
});
