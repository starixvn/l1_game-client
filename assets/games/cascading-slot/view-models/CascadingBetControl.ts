import StatusButton from "../../../common/custom-button/StatusButton";
import CascadingSlotPlaceBetModel from "../models/CascadingSlotPlaceBetModel";
import CascadingUIModel from "../models/CascadingUIModel";

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

    private totalUnique = [];
    private currentCoinIndex = 0;
    private currentCoinValue = 0;
    private currentLevelIndex = 0;
    private currentLevelValue = 0;
    private currentTotalIndex = 0;
    private currentTotalBet = 0;
    private coinValues: number[];
    private betLevels: number[];
    private betMultiplier: number;
    private placeBetModel: CascadingSlotPlaceBetModel;
    private uiModel: CascadingUIModel;
    private isActiveDecreaseTotalBet = false;
    private isActiveIncreaseTotalBet = true;

    closeBetControl: () => void;

    onEnable() {
        this.handleFirstLoadUI();
    }

    showView(status: boolean, callback: () => void, action?: string) {
        this.node.active = status;
        this.closeBetControl = callback;
        action === StatusAction.increase && this.onClickIncreaseTotalBet();
        action === StatusAction.decrease && this.onClickDecreaseTotalBet();
    }

    onCloseBetControl() {
        this.closeBetControl();
    }

    onSetData(data: BetMultiplier, placeBetModel: CascadingSlotPlaceBetModel, uiModel: CascadingUIModel) {
        this.placeBetModel = placeBetModel;
        this.uiModel = uiModel;
        if (data) {
            this.handleFirstLoadData(data);
            this.handleDataOnLabel();
            this.updatePlaceBetModel();
        }
    }

    private handleFirstLoadData(data: BetMultiplier) {
        const uniqueIds = [];
        const totalIncrease = [];
        this.totalUnique = [];
        this.coinValues = data.coinValues;
        this.betLevels = data.betLevels;
        this.betMultiplier = data.betMultiplier;

        this.coinValues.forEach((coin, indexCoin) => {
            this.betLevels.forEach((level, indexLevel) => {
                totalIncrease.push({
                    [CalculateTotalBet(level, coin, this.betMultiplier)]: {
                        coin: coin,
                        level: level,
                        indexCoin: indexCoin,
                        indexLevel: indexLevel
                    }
                });
            });
        });

        totalIncrease
            .sort((a, b) => {
                return +Object.keys(a)[0] - +Object.keys(b)[0];
            })
            .forEach((element) => {
                const isDuplicate = uniqueIds.includes(Object.keys(element)[0]);
                if (!isDuplicate) {
                    uniqueIds.push(Object.keys(element)[0]);
                    this.totalUnique.push(element);
                }
            });
    }

    private handleFirstLoadUI() {
        this.nodeButtons[OrderButtonNode.betDecrease].interactable = false;
        this.nodeButtons[OrderButtonNode.coinDecrease].interactable = false;
        this.nodeButtons[OrderButtonNode.totalDecrease].interactable = false;
    }

    private handleDataOnLabel() {
        let betValue = this.betLevels[0] ?? 0;
        let coinValue = this.coinValues[0] ?? 0;

        if (this.betLevels[this.currentLevelIndex] === this.currentLevelValue) {
            betValue = this.currentLevelValue;
        } else {
            this.currentLevelIndex = 0;
        }

        if (this.coinValues[this.currentCoinIndex] === this.currentCoinValue) {
            coinValue = this.currentCoinValue;
        } else {
            this.currentCoinIndex = 0;
        }

        this.betLevel.string = betValue.toString();
        this.coinValue.string = coinValue.toString();
        this.handleTotalBet(betValue, coinValue);
    }

    protected onClickDecreaseBetLevel() {
        if (this.currentLevelIndex > 0) {
            this.currentLevelIndex--;
            const valueBet = this.betLevels[this.currentLevelIndex];
            const valueCoin = this.coinValues[this.currentCoinIndex];
            this.betLevel.string = valueBet.toString();
            this.handleTotalBet(valueBet, valueCoin);
        }
        this.handleStatusBetButton();
        this.updatePlaceBetModel();
    }

    protected onClickIncreaseBetLevel() {
        if (this.currentLevelIndex < this.betLevels.length - 1) {
            this.currentLevelIndex++;
            const valueBet = this.betLevels[this.currentLevelIndex];
            const valueCoin = this.coinValues[this.currentCoinIndex];
            this.betLevel.string = valueBet.toString();
            this.handleTotalBet(valueBet, valueCoin);
        }

        this.handleStatusBetButton();
        this.updatePlaceBetModel();
    }

    protected onClickDecreaseCoinValue() {
        if (this.currentCoinIndex > 0) {
            this.currentCoinIndex--;
            const valueBet = this.betLevels[this.currentLevelIndex];
            const valueCoin = this.coinValues[this.currentCoinIndex];
            this.coinValue.string = valueCoin.toString();
            this.handleTotalBet(valueBet, valueCoin);
        }
        this.handleStatusCoinButton();
        this.updatePlaceBetModel();
    }

    protected onClickIncreaseCoinValue() {
        if (this.currentCoinIndex < this.coinValues.length - 1) {
            this.currentCoinIndex++;
            const valueBet = this.betLevels[this.currentLevelIndex];
            const valueCoin = this.coinValues[this.currentCoinIndex];
            this.coinValue.string = valueCoin.toString();
            this.handleTotalBet(valueBet, valueCoin);
        }
        this.handleStatusCoinButton();
        this.updatePlaceBetModel();
    }

    protected onClickDecreaseTotalBet() {
        if (this.currentTotalIndex > 0) {
            this.currentTotalIndex--;
            this.handleClickTotalBet();
        }
        this.handleStatusCoinButton();
        this.handleStatusBetButton();
        this.updatePlaceBetModel();
    }

    protected onClickIncreaseTotalBet() {
        if (this.currentTotalIndex < this.totalUnique.length - 1) {
            this.currentTotalIndex++;
            this.handleClickTotalBet();
        }
        this.handleStatusCoinButton();
        this.handleStatusBetButton();
        this.updatePlaceBetModel();
    }

    private handleTotalBet(valueBet: number, valueCoin: number) {
        const totalBet = CalculateTotalBet(valueBet, valueCoin, this.betMultiplier);
        this.currentTotalBet = totalBet;
        this.totalBet.string = totalBet.toString();
        this.totalUnique.forEach((detail, index) => {
            if (+Object.keys(detail)[0] === this.currentTotalBet) {
                this.currentTotalIndex = index;
            }
        });
    }

    private handleClickTotalBet() {
        const total: any = Object.values(this.totalUnique[this.currentTotalIndex])[0];
        this.betLevel.string = total.level.toString();
        this.coinValue.string = total.coin.toString();
        this.currentLevelIndex = total.indexLevel;
        this.currentCoinIndex = total.indexCoin;
        this.totalBet.string = CalculateTotalBet(total.level, total.coin, this.betMultiplier).toString();
        this.currentTotalBet = CalculateTotalBet(total.level, total.coin, this.betMultiplier);
    }

    private handleStatusBetButton() {
        this.handleStatusTotalButton();
        if (this.currentLevelIndex === 0) {
            this.nodeButtons[OrderButtonNode.betDecrease].interactable = false;
            return;
        }

        if (this.currentLevelIndex === this.betLevels.length - 1) {
            this.nodeButtons[OrderButtonNode.betIncrease].interactable = false;
            return;
        }

        this.nodeButtons[OrderButtonNode.betIncrease].interactable = true;
        this.nodeButtons[OrderButtonNode.betDecrease].interactable = true;
    }

    private handleStatusCoinButton() {
        this.handleStatusTotalButton();

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

    private handleStatusTotalButton() {
        if (this.currentTotalBet === +Object.keys(this.totalUnique[0])[0]) {
            this.nodeButtons[OrderButtonNode.totalDecrease].interactable = false;
            this.handleStatusButtonTotalBet({ status: false, isDecrease: true });
            return;
        }

        if (this.currentTotalBet === +Object.keys(this.totalUnique[this.totalUnique.length - 1])[0]) {
            this.nodeButtons[OrderButtonNode.totalIncrease].interactable = false;
            this.handleStatusButtonTotalBet({ status: false, isIncrease: true });
            return;
        }

        this.nodeButtons[OrderButtonNode.totalDecrease].interactable = true;
        this.nodeButtons[OrderButtonNode.totalIncrease].interactable = true;
        this.handleStatusButtonTotalBet({ status: true, isIncrease: true, isDecrease: true });
    }

    private updatePlaceBetModel() {
        this.placeBetModel.change({
            betLevel: this.betLevels[this.currentLevelIndex],
            coinValue: this.coinValues[this.currentCoinIndex],
            totalBet: this.currentTotalBet
        });
        this.currentCoinValue = this.coinValues[this.currentCoinIndex];
        this.currentLevelValue = this.betLevels[this.currentLevelIndex];

        this.uiModel.emit(CascadingUIModel.Events.CHANGE_TOTAL_BET, { ...this.getStatusButtonTotalBet(), totalBet: this.currentTotalBet });
    }

    private handleStatusButtonTotalBet({
        status,
        isIncrease,
        isDecrease
    }: {
        status: boolean;
        isIncrease?: boolean;
        isDecrease?: boolean;
    }) {
        isIncrease && (this.isActiveIncreaseTotalBet = status);
        isDecrease && (this.isActiveDecreaseTotalBet = status);
    }

    getStatusButtonTotalBet() {
        return { increase: this.isActiveIncreaseTotalBet, decrease: this.isActiveDecreaseTotalBet };
    }
}
