import AudioManager from "../../../common/audio/AudioManager";
import StatusButton from "../../../common/custom-button/StatusButton";
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
    totalBetIndex: number;
    totalBet: number;
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

    closeBetControl: () => void;

    onLoad() {
        this.resetValues();
    }

    resetValues() {
        this.currentCoinIndex = 0;
        this.currentBetLevelIndex = 0;
        this.currentTotalBetIndex = 0;
    }

    showView(status: boolean, callback: () => void, action?: string) {
        this.node.active = status;

        this.closeBetControl = callback;
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
        const betValue = this.betLevels[0] ?? 0;
        const coinValue = this.coinValues[0] ?? 0;

        this.betLevel.string = betValue.toString();
        this.coinValue.string = coinValue.toString();
        this.updateTotalBet(betValue, coinValue);
        this.updateAllButtonStatus();
    }

    protected onClickDecreaseBetLevel() {
        AudioManager.getInstance().playClick();
        if (this.currentBetLevelIndex > 0) {
            this.currentBetLevelIndex--;
            this.currentBetLevelValue = this.betLevels[this.currentBetLevelIndex];
            const valueBet = this.betLevels[this.currentBetLevelIndex];
            const valueCoin = this.coinValues[this.currentCoinIndex];
            this.betLevel.string = valueBet.toString();
            this.updateTotalBet(valueBet, valueCoin);
            this.updateAllButtonStatus();
            this.updatePlaceBetAndUIModel();
        }
    }

    protected onClickIncreaseBetLevel() {
        AudioManager.getInstance().playClick();
        if (this.currentBetLevelIndex < this.betLevels.length - 1) {
            this.currentBetLevelIndex++;
            this.currentBetLevelValue = this.betLevels[this.currentBetLevelIndex];
            const valueBet = this.betLevels[this.currentBetLevelIndex];
            const valueCoin = this.coinValues[this.currentCoinIndex];
            this.betLevel.string = valueBet.toString();
            this.updateTotalBet(valueBet, valueCoin);
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
            const valueCoin = this.coinValues[this.currentCoinIndex];
            this.coinValue.string = valueCoin.toString();
            this.updateTotalBet(valueBet, valueCoin);
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
            const coinValue = this.coinValues[this.currentCoinIndex];
            this.coinValue.string = coinValue.toString();
            this.updateTotalBet(betLevelValue, coinValue);
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
        this.totalBet.string = totalBet.toString();

        this.storePreviousBetControl(this.currentTotalBetIndex, this.currentTotalBet);
    }

    private handleClickTotalBet() {
        const item = this.totalBetUnique[this.currentTotalBetIndex];
        const total = Object.keys(item)[0];
        const detail = item[total];
        this.betLevel.string = detail.level.toString();
        this.coinValue.string = detail.coin.toString();
        this.currentBetLevelIndex = detail.indexLevel;
        this.currentBetLevelValue = detail.level;
        this.currentCoinIndex = detail.indexCoin;
        this.currentCoinValue = detail.coin;
        this.totalBet.string = total.toString();
        this.currentTotalBet = +total;
        this.storePreviousBetControl(this.currentTotalBetIndex, this.currentTotalBet);
    }

    private storePreviousBetControl(totalBetIndex, totalBet) {
        cc.sys.localStorage.setItem(this.betControlStorageKey, JSON.stringify({ totalBetIndex, totalBet }));
    }

    private loadDataFromStorage() {
        // const storage = cc.sys.localStorage.getItem(this.betControlStorageKey);
        // if (!storage || !storage.length) {
        //     return;
        // }
        // const previousBet: BetControlType = JSON.parse(storage);
        // const betLevel = this.totalBetUnique[previousBet.totalBetIndex][previousBet.totalBet].level;
        // const betLevelIndex = this.totalBetUnique[previousBet.totalBetIndex][previousBet.totalBet].indexLevel;
        // const coin = this.totalBetUnique[previousBet.totalBetIndex][previousBet.totalBet].coin;
        // const coinIndex = this.totalBetUnique[previousBet.totalBetIndex][previousBet.totalBet].indexCoin;
        // if (this.betLevels.includes(betLevel) && this.coinValues.includes(coin)) {
        //     this.currentBetLevelIndex = betLevelIndex;
        //     this.currentBetLevelValue = betLevel;
        //     this.currentCoinIndex = coinIndex;
        //     this.currentCoinValue = coin;
        //     this.currentTotalBetIndex = previousBet.totalBetIndex;
        // }
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
