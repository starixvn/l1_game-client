import StatusButton from "../../../common/custom-button/StatusButton";
import CascadingSlotPlaceBetModel from "../models/CascadingSlotPlaceBetModel";
import CascadingUIModel from "../models/CascadingUIModel";
import AudioManager from "../../../common/audio/AudioManager";
import { TotalBetType } from "./CascadingTotalBet";

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
    private isActiveDecreaseTotalBet = false;
    private isActiveIncreaseTotalBet = true;
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
        this.prepareTotalBetData(data);
        this.updateLabelValues();
    }

    private prepareBetLevelData(data) {
        this.betLevels = [...data.betLevels];
        this.betLevels.sort((a, b) => {
            return a - b;
        });
    }

    private prepareCoinData(data) {
        this.coinValues = [...data.coinValues];
        this.coinValues.sort((a, b) => {
            return a - b;
        });
    }

    private prepareTotalBetData(data) {
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

        totalBetIncrease.sort((a, b) => {
            return +Object.keys(a)[0] - +Object.keys(b)[0];
        });
        totalBetIncrease.forEach((element) => {
            const isDuplicate = uniqueIds.includes(Object.keys(element)[0]);
            if (!isDuplicate) {
                uniqueIds.push(Object.keys(element)[0]);
                this.totalBetUnique.push(element);
            }
        });
    }

    private updateLabelValues() {
        let betValue = this.betLevels[0] ?? 0;
        let coinValue = this.coinValues[0] ?? 0;

        this.loadDataFromStorage();

        if (this.betLevels[this.currentBetLevelIndex] === this.currentBetLevelValue) {
            betValue = this.currentBetLevelValue;
        } else {
            this.currentBetLevelIndex = 0;
        }

        if (this.coinValues[this.currentCoinIndex] === this.currentCoinValue) {
            coinValue = this.currentCoinValue;
        } else {
            this.currentCoinIndex = 0;
        }

        this.betLevel.string = betValue.toString();
        this.coinValue.string = coinValue.toString();
        this.updateTotalBet(betValue, coinValue);
        this.updateAllButtonStatus();
    }

    protected onClickDecreaseBetLevel() {
        if (this.currentBetLevelIndex > 0) {
            this.currentBetLevelIndex--;
            this.currentBetLevelValue = this.betLevels[this.currentBetLevelIndex];
            const valueBet = this.betLevels[this.currentBetLevelIndex];
            const valueCoin = this.coinValues[this.currentCoinIndex];
            this.betLevel.string = valueBet.toString();
            this.updateTotalBet(valueBet, valueCoin);
        }
        this.updateAllButtonStatus();
        this.updatePlaceBetAndUIModel();
    }

    protected onClickIncreaseBetLevel() {
        if (this.currentBetLevelIndex < this.betLevels.length - 1) {
            this.currentBetLevelIndex++;
            this.currentBetLevelValue = this.betLevels[this.currentBetLevelIndex];
            const valueBet = this.betLevels[this.currentBetLevelIndex];
            const valueCoin = this.coinValues[this.currentCoinIndex];
            this.betLevel.string = valueBet.toString();
            this.updateTotalBet(valueBet, valueCoin);
        }

        this.updateAllButtonStatus();
        this.updatePlaceBetAndUIModel();
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
        }
        this.updateAllButtonStatus();
        this.updatePlaceBetAndUIModel();
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
        }
        this.updateAllButtonStatus();
        this.updatePlaceBetAndUIModel();
    }

    protected onClickDecreaseTotalBet() {
        this.loadDataFromStorage();
        if (this.currentTotalBetIndex > 0) {
            this.currentTotalBetIndex--;
            this.handleClickTotalBet();
        }
        this.updateAllButtonStatus();
        this.updatePlaceBetAndUIModel();
    }

    protected onClickIncreaseTotalBet() {
        this.loadDataFromStorage();
        if (this.currentTotalBetIndex < this.totalBetUnique.length - 1) {
            this.currentTotalBetIndex++;
            this.handleClickTotalBet();
        }
        this.updateAllButtonStatus();
        this.updatePlaceBetAndUIModel();
    }

    private updateTotalBet(betLevelValue: number, coinValue: number) {
        const totalBet = CalculateTotalBet(betLevelValue, coinValue, this.betMultiplier);
        this.currentTotalBet = totalBet;
        this.totalBet.string = totalBet.toString();
        this.totalBetUnique.forEach((detail, index) => {
            if (+Object.keys(detail)[0] === this.currentTotalBet) {
                this.currentTotalBetIndex = index;
            }
        });

        this.storePreviousBetControl(this.currentTotalBetIndex, this.currentTotalBet);
    }

    private handleClickTotalBet() {
        const total: any = Object.values(this.totalBetUnique[this.currentTotalBetIndex])[0];
        this.betLevel.string = total.level.toString();
        this.coinValue.string = total.coin.toString();
        this.currentBetLevelIndex = total.indexLevel;
        this.currentBetLevelValue = total.level;
        this.currentCoinIndex = total.indexCoin;
        this.currentCoinValue = total.coin;

        this.totalBet.string = CalculateTotalBet(total.level, total.coin, this.betMultiplier).toString();
        this.currentTotalBet = CalculateTotalBet(total.level, total.coin, this.betMultiplier);
        this.storePreviousBetControl(this.currentTotalBetIndex, this.currentTotalBet);
    }

    private storePreviousBetControl(totalBetIndex, totalBet) {
        cc.sys.localStorage.setItem(this.betControlStorageKey, JSON.stringify({ totalBetIndex, totalBet }));
    }

    private loadDataFromStorage() {
        const storage = cc.sys.localStorage.getItem(this.betControlStorageKey);
        if (!storage || !storage.length) {
            return;
        }

        const previousBet: BetControlType = JSON.parse(storage);
        const betLevel = this.totalBetUnique[previousBet.totalBetIndex][previousBet.totalBet].level;
        const betLevelIndex = this.totalBetUnique[previousBet.totalBetIndex][previousBet.totalBet].indexLevel;
        const coin = this.totalBetUnique[previousBet.totalBetIndex][previousBet.totalBet].coin;
        const coinIndex = this.totalBetUnique[previousBet.totalBetIndex][previousBet.totalBet].indexCoin;

        if (this.betLevels.includes(betLevel) && this.coinValues.includes(coin)) {
            this.currentBetLevelIndex = betLevelIndex;
            this.currentBetLevelValue = betLevel;
            this.currentCoinIndex = coinIndex;
            this.currentCoinValue = coin;
            this.currentTotalBetIndex = previousBet.totalBetIndex;
        }
    }

    private updateAllButtonStatus() {
        this.updateCoinButtonStatus();
        this.updateLevelButtonStatus();
        this.updateTotalBetButtonStatus();
    }

    private updateLevelButtonStatus() {
        if (this.currentBetLevelIndex === 0) {
            this.nodeButtons[OrderButtonNode.betDecrease].interactable = false;
            return;
        }

        if (this.currentBetLevelIndex === this.betLevels.length - 1) {
            this.nodeButtons[OrderButtonNode.betIncrease].interactable = false;
            return;
        }

        this.nodeButtons[OrderButtonNode.betIncrease].interactable = true;
        this.nodeButtons[OrderButtonNode.betDecrease].interactable = true;
    }

    private updateCoinButtonStatus() {
        if (this.currentCoinIndex === 0) {
            this.nodeButtons[OrderButtonNode.coinDecrease].interactable = false;
            return;
        }

        if (this.currentCoinIndex === this.coinValues.length - 1) {
            this.nodeButtons[OrderButtonNode.coinIncrease].interactable = false;
            return;
        }

        this.nodeButtons[OrderButtonNode.coinDecrease].interactable = true;
        this.nodeButtons[OrderButtonNode.coinIncrease].interactable = true;
    }

    private updateTotalBetButtonStatus() {
        if (this.currentTotalBet === +Object.keys(this.totalBetUnique[0])[0]) {
            this.nodeButtons[OrderButtonNode.totalDecrease].interactable = false;
            this.setTotalBetButtonStatus({ status: false, isDecrease: true });
            return;
        }

        if (this.currentTotalBet === +Object.keys(this.totalBetUnique[this.totalBetUnique.length - 1])[0]) {
            this.nodeButtons[OrderButtonNode.totalIncrease].interactable = false;
            this.setTotalBetButtonStatus({ status: false, isIncrease: true });
            return;
        }

        this.nodeButtons[OrderButtonNode.totalDecrease].interactable = true;
        this.nodeButtons[OrderButtonNode.totalIncrease].interactable = true;
        this.setTotalBetButtonStatus({ status: true, isIncrease: true, isDecrease: true });
    }

    private updatePlaceBetAndUIModel() {
        this.placeBetModel.change({
            betLevel: this.betLevels[this.currentBetLevelIndex],
            coinValue: this.coinValues[this.currentCoinIndex],
            totalBet: this.currentTotalBet
        });
        this.uiModel.emit(CascadingUIModel.Events.CHANGE_TOTAL_BET, this.getMiniBetControlData());
    }

    private setTotalBetButtonStatus({ status, isIncrease, isDecrease }: { status: boolean; isIncrease?: boolean; isDecrease?: boolean }) {
        isIncrease && (this.isActiveIncreaseTotalBet = status);
        isDecrease && (this.isActiveDecreaseTotalBet = status);
    }

    getMiniBetControlData(): TotalBetType {
        return { totalBet: this.currentTotalBet, increase: this.isActiveIncreaseTotalBet, decrease: this.isActiveDecreaseTotalBet };
    }
}
