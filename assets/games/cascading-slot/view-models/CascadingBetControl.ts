import AudioManager from "../../../common/audio/AudioManager";
import StatusButton from "../../../common/custom-button/StatusButton";
import GameUtils from "../../../common/GameUtils";
import CascadingSlotPlaceBetModel from "../models/CascadingSlotPlaceBetModel";
import CascadingUIModel from "../models/CascadingUIModel";

export type TotalBetType = { coin: number; level: number; totalBet: number; increase: boolean; decrease: boolean };

const { ccclass, property } = cc._decorator;

export type BetMultiplier = {
    coinValues: number[];
    betLevels: number[];
    betMultiplier: number;
};

enum OrderButtonNode {
    betDecrease = 0,
    betIncrease,
    coinDecrease,
    coinIncrease,
    totalDecrease,
    totalIncrease
}

enum StatusAction {
    decrease = "decrease",
    increase = "increase"
}

type BetControlType = {
    coin: number;
    level: number;
    multiplier: number;
};

export const CalculateTotalBet = (level: number, coin: number, betMultiplier: number) => {
    return +(level * coin * betMultiplier).toFixed(1);
};

@ccclass
export default class CascadingBetControl extends cc.Component {
    @property(cc.Label)
    betLevel: cc.Label = null;

    @property(cc.Label)
    coinValue: cc.Label = null;

    @property(cc.Label)
    totalBet: cc.Label = null;

    @property(StatusButton)
    nodeButtons: StatusButton[] = [];

    private totalBetUnique = [];
    private currentCoinIndex = 0;
    private currentCoinValue = 0;
    private currentBetLevelIndex = 0;
    private currentBetLevelValue = 0;
    private currentTotalBetIndex = 0;
    private currentTotalBet = 0;
    private coinValues: number[];
    private betLevels: number[];
    private betMultiplier: number;
    private placeBetModel: CascadingSlotPlaceBetModel;
    private uiModel: CascadingUIModel;
    betControlStorageKey = "CASCADING_SLOT_BET_CONTROL";
    gameId: number;

    closeBetControl: () => void;

    resetValues() {
        this.currentCoinIndex = 0;
        this.currentBetLevelIndex = 0;
        this.currentTotalBetIndex = 0;
        const data = GameUtils.getGameSetting(this.gameId);
        data.betControl = null;
        GameUtils.setGameSetting(this.gameId, data);
    }

    init(callback: () => void) {
        this.closeBetControl = callback;
    }

    showView(status: boolean, action?: string) {
        this.node.active = status;

        action === StatusAction.increase && this.onClickIncreaseTotalBet();
        action === StatusAction.decrease && this.onClickDecreaseTotalBet();
    }

    onCloseBetControl() {
        AudioManager.getInstance().playClick();
        this.closeBetControl();
    }

    onSetData(data: BetMultiplier, placeBetModel: CascadingSlotPlaceBetModel, uiModel: CascadingUIModel) {
        this.placeBetModel = placeBetModel;
        this.uiModel = uiModel;
        if (data) {
            this.handleData(data);
            this.loadDataFromStorage();
            this.updatePlaceBetAndUIModel();
        }
    }

    private handleData(data: BetMultiplier) {
        this.betMultiplier = data.betMultiplier;
        this.prepareBetLevelData(data);
        this.prepareCoinData(data);
        this.prepareTotalBetData();
        this.updateLabelValues();
    }

    private prepareBetLevelData(data) {
        this.betLevels = [...data.betLevels];
        this.betLevels.sort((a, b) => a - b);
    }

    private prepareCoinData(data) {
        this.coinValues = [...data.coinValues];
        this.coinValues.sort((a, b) => a - b);
    }

    private prepareTotalBetData() {
        const uniqueIds = [];
        const totalBetIncrease = [];
        this.totalBetUnique = [];

        this.coinValues.forEach((coin, indexCoin) => {
            this.betLevels.forEach((level, indexLevel) => {
                totalBetIncrease.push({
                    [CalculateTotalBet(level, coin, this.betMultiplier)]: {
                        coin: coin,
                        level: level,
                        indexCoin: indexCoin,
                        indexLevel: indexLevel
                    }
                });
            });
        });

        totalBetIncrease.sort((a, b) => +Object.keys(a)[0] - +Object.keys(b)[0]);
        totalBetIncrease.forEach((element) => {
            const isDuplicate = uniqueIds.includes(Object.keys(element)[0]);
            if (!isDuplicate) {
                uniqueIds.push(Object.keys(element)[0]);
                this.totalBetUnique.push(element);
            }
        });
    }

    private updateLabelValues() {
        this.currentBetLevelValue = this.betLevels[0] ?? 0;
        this.currentCoinValue = this.coinValues[0] ?? 0;
        this.updateTotalBet(this.currentBetLevelValue, this.currentCoinValue);
        this.updateDisplayLabels();
        this.updateAllButtonStatus();
    }

    protected onClickDecreaseBetLevel() {
        AudioManager.getInstance().playClick();
        if (this.currentBetLevelIndex > 0) {
            this.currentBetLevelIndex--;
            this.currentBetLevelValue = this.betLevels[this.currentBetLevelIndex];
            const valueCoin = this.coinValues[this.currentCoinIndex];
            this.updateTotalBet(this.currentBetLevelValue, valueCoin);
            this.updateDisplayLabels();
            this.updateAllButtonStatus();
            this.updatePlaceBetAndUIModel();
        }
    }

    protected onClickIncreaseBetLevel() {
        AudioManager.getInstance().playClick();
        if (this.currentBetLevelIndex < this.betLevels.length - 1) {
            this.currentBetLevelIndex++;
            this.currentBetLevelValue = this.betLevels[this.currentBetLevelIndex];
            const valueCoin = this.coinValues[this.currentCoinIndex];
            this.updateTotalBet(this.currentBetLevelValue, valueCoin);
            this.updateDisplayLabels();
            this.updateAllButtonStatus();
            this.updatePlaceBetAndUIModel();
        }
    }

    protected onClickDecreaseCoinValue() {
        AudioManager.getInstance().playClick();
        if (this.currentCoinIndex > 0) {
            this.currentCoinIndex--;
            this.currentCoinValue = this.coinValues[this.currentCoinIndex];
            const valueBet = this.betLevels[this.currentBetLevelIndex];
            this.updateTotalBet(valueBet, this.currentCoinValue);
            this.updateDisplayLabels();
            this.updateAllButtonStatus();
            this.updatePlaceBetAndUIModel();
        }
    }

    protected onClickIncreaseCoinValue() {
        AudioManager.getInstance().playClick();
        if (this.currentCoinIndex < this.coinValues.length - 1) {
            this.currentCoinIndex++;
            this.currentCoinValue = this.coinValues[this.currentCoinIndex];
            const betLevelValue = this.betLevels[this.currentBetLevelIndex];
            this.updateTotalBet(betLevelValue, this.currentCoinValue);
            this.updateDisplayLabels();
            this.updateAllButtonStatus();
            this.updatePlaceBetAndUIModel();
        }
    }

    protected onClickDecreaseTotalBet() {
        if (this.currentTotalBetIndex > 0) {
            this.currentTotalBetIndex--;
            this.handleClickTotalBet();
            this.updateAllButtonStatus();
            this.updatePlaceBetAndUIModel();
        }
    }

    protected onClickIncreaseTotalBet() {
        if (this.currentTotalBetIndex < this.totalBetUnique.length - 1) {
            this.currentTotalBetIndex++;
            this.handleClickTotalBet();
            this.updateAllButtonStatus();
            this.updatePlaceBetAndUIModel();
        }
    }

    private updateTotalBet(betLevelValue: number, coinValue: number) {
        const totalBet = CalculateTotalBet(betLevelValue, coinValue, this.betMultiplier);
        this.currentTotalBet = totalBet;
        this.currentTotalBetIndex = this.totalBetUnique.findIndex((detail) => +Object.keys(detail)[0] === this.currentTotalBet);
    }

    private updateDisplayLabels() {
        this.coinValue.string = this.currentCoinValue.toString();
        this.betLevel.string = this.currentBetLevelValue.toString();
        this.totalBet.string = this.currentTotalBet.toString();
    }

    private handleClickTotalBet() {
        const item = this.totalBetUnique[this.currentTotalBetIndex];
        const total = Object.keys(item)[0];
        const detail = item[total];
        this.currentBetLevelIndex = detail.indexLevel;
        this.currentBetLevelValue = detail.level;
        this.currentCoinIndex = detail.indexCoin;
        this.currentCoinValue = detail.coin;
        this.currentTotalBet = +total;

        this.updateDisplayLabels();
    }

    private saveData() {
        const betControl = {
            coin: this.currentCoinValue,
            level: this.currentBetLevelValue,
            multiplier: this.betMultiplier
        };
        const data = GameUtils.getGameSetting(this.gameId);
        data.betControl = betControl;
        GameUtils.setGameSetting(this.gameId, data);
    }

    private loadDataFromStorage() {
        const data = GameUtils.getGameSetting(this.gameId);
        if (!data.betControl) {
            return;
        }
        const { coin, level, multiplier } = data.betControl;
        const coinIndex = this.coinValues.findIndex((value) => value === coin);
        const levelIndex = this.betLevels.findIndex((value) => value === level);
        if (coinIndex !== -1 && levelIndex !== -1 && multiplier === this.betMultiplier) {
            this.currentCoinValue = coin;
            this.currentCoinIndex = coinIndex;
            this.currentBetLevelValue = level;
            this.currentBetLevelIndex = levelIndex;
            this.updateTotalBet(level, coin);
            this.updateDisplayLabels();
        }
    }

    private updateAllButtonStatus() {
        this.updateCoinButtonStatus();
        this.updateLevelButtonStatus();
        this.updateTotalBetButtonStatus();
    }

    private updateLevelButtonStatus() {
        this.nodeButtons[OrderButtonNode.betIncrease].interactable = this.currentBetLevelIndex < this.betLevels.length - 1;
        this.nodeButtons[OrderButtonNode.betDecrease].interactable = this.currentBetLevelIndex > 0;
    }

    private updateCoinButtonStatus() {
        this.nodeButtons[OrderButtonNode.coinIncrease].interactable = this.currentCoinIndex < this.coinValues.length - 1;
        this.nodeButtons[OrderButtonNode.coinDecrease].interactable = this.currentCoinIndex > 0;
    }

    private updateTotalBetButtonStatus() {
        this.nodeButtons[OrderButtonNode.totalIncrease].interactable = this.currentTotalBetIndex < this.totalBetUnique.length - 1;
        this.nodeButtons[OrderButtonNode.totalDecrease].interactable = this.currentTotalBetIndex > 0;
    }

    private updatePlaceBetAndUIModel() {
        this.saveData();
        this.placeBetModel.change({
            betLevel: this.betLevels[this.currentBetLevelIndex],
            coinValue: this.coinValues[this.currentCoinIndex],
            totalBet: this.currentTotalBet
        });
        this.uiModel.emit(CascadingUIModel.Events.CHANGE_TOTAL_BET, this.generateBetControlData());
    }

    private generateBetControlData(): TotalBetType {
        return {
            totalBet: this.currentTotalBet,
            coin: this.currentCoinValue,
            level: this.currentBetLevelValue,
            increase: this.nodeButtons[OrderButtonNode.totalIncrease].interactable,
            decrease: this.nodeButtons[OrderButtonNode.totalDecrease].interactable
        };
    }
}
