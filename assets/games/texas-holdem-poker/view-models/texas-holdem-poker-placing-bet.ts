import GameBase from "../../../games/_base/GameBase";
import Connection from "../../_new/connection/Connection";
import { events } from "../../_new/connection/SocketIOConnection";
import { TexasHoldemPokerChoicesType } from "../texas-type";
import { TexasHoldemPokerChoicesConst, BetAction } from "../texas-contants";
import { TexasHoldemPokerState } from "../texas-type";
import TexasHoldemPokerGameData from "../event-models/texas-holdem-poker-game-data";
import { validateAccountBalance, validateAccountBalanceForFullRound, validateBet } from "./texas-holdem-poker-validate-placing-bet";

export default class TexasHoldemPokerPlacingBet {
    private readonly gameData: TexasHoldemPokerGameData<TexasHoldemPokerChoicesType> = null;
    private readonly gameBase: GameBase = null;
    private readonly getConnection: () => Connection;

    constructor(gameData: TexasHoldemPokerGameData<TexasHoldemPokerChoicesType>, gameBase: GameBase, getConnection: () => Connection) {
        this.gameData = gameData;
        this.gameBase = gameBase;
        this.getConnection = getConnection;
    }

    placeBet(betChoice: string, betAmount: number) {
        if (
            betChoice === TexasHoldemPokerChoicesConst.anteBet &&
            (this.gameData.stateModel.state === TexasHoldemPokerState.blank_new ||
                this.gameData.stateModel.state === TexasHoldemPokerState.ante_bet ||
                this.gameData.stateModel.state === TexasHoldemPokerState.replay_new ||
                this.gameData.stateModel.state === TexasHoldemPokerState.calling_deal)
        ) {
            this.gameBase.playClick();
            if (this.gameData.isProcessingBet) {
                this.gameData.emit(TexasHoldemPokerGameData.Events.SHOW_PROCESSING_BET);
            } else {
                if (this.gameBase.waitingProcessing) {
                    return false;
                }
                const validateResult =
                    validateBet({
                        chipAmount: betAmount,
                        currentBettedAmount: this.gameData.placeBetModel.choices[betChoice],
                        currentTotalBettedAmount: this.getTotalBet(),
                        betChoice: betChoice,
                        showMiniWarningFunc: (mes) => this.gameBase.showMiniWarning(mes),
                        minBet: this.gameData.configs.minBet,
                        maxBetPerChoice: this.gameData.placeBetModel.choices[betChoice],
                        maxBetPerRound: this.gameBase.getMaxBet(),
                        waitingProcessing: this.gameBase.waitingProcessing,
                        getMaxBetAndStakePerChoice: this.getMaxBetAndStakePerChoice.bind(this),
                        minBetPerRound: this.gameBase.getMinBet()
                    }) &&
                    validateAccountBalance({
                        chipAmount: betAmount,
                        currentBettedAmount: this.gameData.placeBetModel.choices[betChoice],
                        userBalance: this.gameBase.getUserBalance(),
                        showMiniWarningFunc: (mes) => this.gameBase.showMiniWarning(mes)
                    });
                validateResult && this.gameData.receiveUIData({ bet: { choice: betChoice, amount: betAmount } });
            }
        }
    }
    private getTotalBet() {
        return Object.keys(this.gameData.placeBetModel.choices).reduce((sum, current) => {
            return sum + this.gameData.placeBetModel.choices[current];
        }, 0);
    }
    doubleBet(betChoice: string, betAmount: number) {
        if (
            validateBet({
                chipAmount: betAmount,
                currentBettedAmount: this.gameData.placeBetModel.choices[betChoice],
                currentTotalBettedAmount: this.getTotalBet(),
                betChoice: betChoice,
                showMiniWarningFunc: (mes) => this.gameBase.showMiniWarning(mes),
                minBet: this.gameData.configs.minBet,
                maxBetPerChoice: this.gameData.placeBetModel.choices[betChoice],
                maxBetPerRound: this.gameBase.getMaxBet(),
                waitingProcessing: this.gameBase.waitingProcessing,
                getMaxBetAndStakePerChoice: this.getMaxBetAndStakePerChoice.bind(this),
                minBetPerRound: this.gameBase.getMinBet()
            }) &&
            validateAccountBalance({
                chipAmount: betAmount,
                currentBettedAmount: this.gameData.placeBetModel.choices[betChoice],
                userBalance: this.gameBase.getUserBalance(),
                showMiniWarningFunc: (mes) => this.gameBase.showMiniWarning(mes)
            })
        ) {
            this.gameData.receiveUIData({ double: { choice: betChoice } });
        }
    }

    clear() {
        this.gameData.receiveUIData({
            cancel: {}
        });
        this.getConnection().emit("bet", { action: "settle" });
    }

    handleClickButton(betChoice: string, betAmount: number, betAction: string, payload?: any) {
        const validateResult =
            validateBet({
                chipAmount: betAmount,
                currentBettedAmount: this.gameData.placeBetModel.choices[betChoice],
                currentTotalBettedAmount: this.getTotalBet(),
                betChoice: betChoice,
                showMiniWarningFunc: (mes) => this.gameBase.showMiniWarning(mes),
                minBet: this.gameData.configs.minBet,
                maxBetPerChoice: this.gameData.configs.maxBetChoices[betChoice],
                maxBetPerRound: this.gameBase.getMaxBet(),
                waitingProcessing: this.gameBase.waitingProcessing,
                getMaxBetAndStakePerChoice: this.getMaxBetAndStakePerChoice.bind(this),
                minBetPerRound: this.gameBase.getMinBet()
            }) &&
            validateAccountBalance({
                chipAmount: betAmount,
                currentBettedAmount: this.gameData.placeBetModel.choices[betChoice],
                userBalance: this.gameBase.getUserBalance(),
                showMiniWarningFunc: (mes) => this.gameBase.showMiniWarning(mes)
            });
        if (validateResult) {
            this.gameData.isProcessingBet = true;
            const stateUI = {};
            stateUI[betAction] = {};
            this.gameData.receiveUIData(stateUI);
            this.getConnection().emit(events.bet, {
                action: betAction,
                ...payload
            });
        }
    }

    handleClickDeal() {
        const validateResult = validateAccountBalanceForFullRound({
            chipAmount: 0,
            currentBettedAmount: this.gameData.placeBetModel.choices.anteBet,
            userBalance: this.gameBase.getUserBalance(),
            showMiniWarningFunc: (mes) => this.gameBase.showMiniWarning(mes)
        });
        if (validateResult) {
            this.gameData.isProcessingBet = true;
            this.gameData.receiveUIData({
                deal: {}
            });
            this.getConnection().emit(events.bet, {
                action: BetAction.deal,
                anteBet: this.gameData.placeBetModel.choices.anteBet
            });
        }
    }

    handleClickButtonNoneBet(betAction: string, payload?: any) {
        this.gameData.isProcessingBet = true;
        const stateUI = {};
        stateUI[betAction] = {};
        this.gameData.receiveUIData(stateUI);
        this.getConnection().emit(events.bet, {
            action: betAction,
            ...payload
        });
    }

    rebetAndDeal() {
        const currentTotal = Object.keys(this.gameData.placeBetModel.previousChoices).reduce((sum, current) => {
            return sum + this.gameData.placeBetModel.previousChoices[current];
        }, 0);
        if (
            validateAccountBalanceForFullRound({
                chipAmount: 0,
                currentBettedAmount: currentTotal,
                userBalance: this.gameBase.getUserBalance(),
                showMiniWarningFunc: (mes) => this.gameBase.showMiniWarning(mes)
            })
        ) {
            this.gameData.isProcessingBet = true;
            this.gameData.receiveUIData({
                rebetAndDeal: {}
            });
            this.getConnection().emit(events.bet, {
                action: BetAction.deal,
                ...this.gameData.placeBetModel.choices
            });
        } else {
            this.gameData.receiveUIData({
                replayNew: {}
            });
        }
    }

    private getMaxBetAndStakePerChoice(betChoice: string): number {
        return Math.min(this.gameData.configs.maxBetChoices[TexasHoldemPokerChoicesConst[betChoice]], this.gameBase.getMaxBet());
    }
}
