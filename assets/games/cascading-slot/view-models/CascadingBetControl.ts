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
    private currentLevelIndex = 0;
    private currentTotalIndex: number;
    private totalBetCurrent: number;
    private coinValues: number[];
    private betLevels: number[];
    private betMultiplier: number;
    private placeBetModel: CascadingSlotPlaceBetModel;
    private uiModel: CascadingUIModel;

    onEnable() {
        this.handleFirstLoadUI();
        this.handleFirstLoadLabel();
    }

    onSetData(data: BetMultiplier, placeBetModel: CascadingSlotPlaceBetModel, uiModel: CascadingUIModel) {
        this.placeBetModel = placeBetModel;
        this.uiModel = uiModel;
        if (data) {
            this.handleFirstLoadData(data);
        }
    }

    handleFirstLoadData(data: BetMultiplier) {
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

    handleFirstLoadUI() {
        this.nodeButtons[OrderButtonNode.betDecrease].interactable = false;
        this.nodeButtons[OrderButtonNode.coinDecrease].interactable = false;
        this.nodeButtons[OrderButtonNode.totalDecrease].interactable = false;
    }

    handleFirstLoadLabel() {
        const betLevels = this.betLevels[0] ?? 0;
        const coinValues = this.betLevels[0] ?? 0;
        this.betLevel.string = betLevels.toString();
        this.coinValue.string = coinValues.toString();
        this.handleTotalBet(coinValues, betLevels);
    }

    onClickDecreaseBetLevel() {
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

    onClickIncreaseBetLevel() {
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

    onClickDecreaseCoinValue() {
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

    onClickIncreaseCoinValue() {
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

    onClickDecreaseTotalBet() {
        if (this.currentTotalIndex > 0) {
            this.currentTotalIndex--;
            this.handleClickTotalBet();
        }
        this.handleStatusCoinButton();
        this.handleStatusBetButton();
        this.handleStatusTotalButton();
        this.updatePlaceBetModel();
    }

    onClickIncreaseTotalBet() {
        if (this.currentTotalIndex < this.totalUnique.length - 1) {
            this.currentTotalIndex++;
            this.handleClickTotalBet();
        }
        this.handleStatusCoinButton();
        this.handleStatusBetButton();
        this.handleStatusTotalButton();
        this.updatePlaceBetModel();
    }

    handleTotalBet(valueBet: number, valueCoin: number) {
        const totalBet = CalculateTotalBet(valueBet, valueCoin, this.betMultiplier);
        this.totalBetCurrent = totalBet;
        this.totalBet.string = totalBet.toString();
        this.totalUnique.forEach((detail, index) => {
            if (+Object.keys(detail)[0] === this.totalBetCurrent) {
                this.currentTotalIndex = index;
            }
        });
    }

    handleClickTotalBet() {
        const total: any = Object.values(this.totalUnique[this.currentTotalIndex])[0];
        this.betLevel.string = total.level.toString();
        this.coinValue.string = total.coin.toString();
        this.currentLevelIndex = total.indexLevel;
        this.currentCoinIndex = total.indexCoin;
        this.totalBet.string = CalculateTotalBet(total.level, total.coin, this.betMultiplier).toString();
        this.totalBetCurrent = CalculateTotalBet(total.level, total.coin, this.betMultiplier);
    }

    handleStatusBetButton() {
        this.handleStatusTotalButton();
        console.log(this.currentLevelIndex, "this.currentLevelIndex");
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

    handleStatusCoinButton() {
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

    handleStatusTotalButton() {
        if (this.totalBetCurrent === +Object.keys(this.totalUnique[0])[0]) {
            this.nodeButtons[OrderButtonNode.totalDecrease].interactable = false;
            return;
        }

        if (this.totalBetCurrent === +Object.keys(this.totalUnique[this.totalUnique.length - 1])[0]) {
            this.nodeButtons[OrderButtonNode.totalIncrease].interactable = false;
            return;
        }

        this.nodeButtons[OrderButtonNode.totalDecrease].interactable = true;
        this.nodeButtons[OrderButtonNode.totalIncrease].interactable = true;
    }

    updatePlaceBetModel() {
        this.placeBetModel.change({
            betLevel: this.betLevels[this.currentLevelIndex],
            coinValues: this.coinValues[this.currentCoinIndex],
            totalBet: this.totalBetCurrent
        });

        this.uiModel.emit(CascadingUIModel.Events.CHANGE_TOTAL_MULTIPLIER, this.totalBetCurrent);
    }
}
