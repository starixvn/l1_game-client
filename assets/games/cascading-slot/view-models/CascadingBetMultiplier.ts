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

@ccclass
export default class CascadingBetMultiplier extends cc.Component {
    @property(cc.Label)
    betLevel: cc.Label = null;

    @property(cc.Label)
    coinValue: cc.Label = null;

    @property(cc.Label)
    totalBet: cc.Label = null;

    @property(cc.Node)
    nodeButton: cc.Node[] = [];

    @property(cc.Node)
    nodeButtonInactive: cc.Node[] = [];

    private totalIncrease = [];
    private totalUnique = [];
    private currentCoinIndex = 0;
    private currentLevelIndex = 0;
    private currentTotalIndex: number;
    private totalBetCurrent: number;
    private coinValues: number[];
    private betLevels: number[];
    private betMultiplier: number;

    onEnable() {
        this.handleFirstLoadUI();
        this.handleFirstLoadLabel();
    }

    onSetData(data: BetMultiplier) {
        if (data) {
            this.handleFirstLoadData(data);
        }
    }

    handleFirstLoadData(data: BetMultiplier) {
        const uniqueIds = [];
        this.totalIncrease = [];
        this.totalUnique = [];
        this.coinValues = data.coinValues;
        this.betLevels = data.betLevels;
        this.betMultiplier = data.betMultiplier;

        this.coinValues.forEach((coin, indexCoin) => {
            this.betLevels.forEach((level, indexLevel) => {
                this.totalIncrease.push({
                    [this.calculateTotalBet(level, coin)]: {
                        coin: coin,
                        level: level,
                        indexCoin: indexCoin,
                        indexLevel: indexLevel
                    }
                });
            });
        });

        this.totalIncrease
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
        this.nodeButtonInactive[OrderButtonNode.betDecrease].active = true;
        this.nodeButtonInactive[OrderButtonNode.coinDecrease].active = true;
        this.nodeButtonInactive[OrderButtonNode.totalDecrease].active = true;
        this.nodeButton[OrderButtonNode.betDecrease].getComponent(cc.Button).enabled = false;
        this.nodeButton[OrderButtonNode.coinDecrease].getComponent(cc.Button).enabled = false;
        this.nodeButton[OrderButtonNode.totalDecrease].getComponent(cc.Button).enabled = false;
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
    }

    onClickDecreaseTotalBet() {
        if (this.currentTotalIndex > 0) {
            this.currentTotalIndex--;
            this.handleClickTotalBet();
        }
        this.handleStatusCoinButton();
        this.handleStatusBetButton();
        this.handleStatusTotalButton();
    }

    onClickIncreaseTotalBet() {
        if (this.currentTotalIndex < this.totalUnique.length - 1) {
            this.currentTotalIndex++;
            this.handleClickTotalBet();
        }
        this.handleStatusCoinButton();
        this.handleStatusBetButton();
        this.handleStatusTotalButton();
    }

    handleTotalBet(valueBet: number, valueCoin: number) {
        const totalBet = this.calculateTotalBet(valueBet, valueCoin);
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
        this.totalBet.string = this.calculateTotalBet(total.level, total.coin).toString();
        this.totalBetCurrent = this.calculateTotalBet(total.level, total.coin);
    }

    handleStatusBetButton() {
        this.handleStatusTotalButton();
        if (this.currentLevelIndex === 0) {
            this.nodeButtonInactive[OrderButtonNode.betDecrease].active = true;
            this.nodeButton[OrderButtonNode.betDecrease].getComponent(cc.Button).enabled = false;
            return;
        }

        if (this.currentLevelIndex === this.betLevels.length - 1) {
            this.nodeButtonInactive[OrderButtonNode.betIncrease].active = true;
            this.nodeButton[OrderButtonNode.betIncrease].getComponent(cc.Button).enabled = false;
            return;
        }

        this.nodeButtonInactive[OrderButtonNode.betDecrease].active = false;
        this.nodeButtonInactive[OrderButtonNode.betIncrease].active = false;
        this.nodeButton[OrderButtonNode.betIncrease].getComponent(cc.Button).enabled = true;
        this.nodeButton[OrderButtonNode.betDecrease].getComponent(cc.Button).enabled = true;
    }

    handleStatusCoinButton() {
        this.handleStatusTotalButton();

        if (this.currentCoinIndex === 0) {
            this.nodeButtonInactive[OrderButtonNode.coinDecrease].active = true;
            this.nodeButton[OrderButtonNode.coinDecrease].getComponent(cc.Button).enabled = false;
            return;
        }

        if (this.currentCoinIndex === this.coinValues.length - 1) {
            this.nodeButtonInactive[OrderButtonNode.coinIncrease].active = true;
            this.nodeButton[OrderButtonNode.coinIncrease].getComponent(cc.Button).enabled = false;
            return;
        }

        this.nodeButtonInactive[OrderButtonNode.coinDecrease].active = false;
        this.nodeButtonInactive[OrderButtonNode.coinIncrease].active = false;
        this.nodeButton[OrderButtonNode.coinDecrease].getComponent(cc.Button).enabled = true;
        this.nodeButton[OrderButtonNode.coinIncrease].getComponent(cc.Button).enabled = true;
    }

    handleStatusTotalButton() {
        if (this.totalBetCurrent === +Object.keys(this.totalUnique[0])[0]) {
            this.nodeButtonInactive[OrderButtonNode.totalDecrease].active = true;
            this.nodeButton[OrderButtonNode.totalDecrease].getComponent(cc.Button).enabled = false;
            return;
        }

        if (this.totalBetCurrent === +Object.keys(this.totalUnique[this.totalUnique.length - 1])[0]) {
            this.nodeButtonInactive[OrderButtonNode.totalIncrease].active = true;
            this.nodeButton[OrderButtonNode.totalIncrease].getComponent(cc.Button).enabled = false;
            return;
        }

        this.nodeButtonInactive[OrderButtonNode.totalDecrease].active = false;
        this.nodeButtonInactive[OrderButtonNode.totalIncrease].active = false;
        this.nodeButton[OrderButtonNode.totalDecrease].getComponent(cc.Button).enabled = true;
        this.nodeButton[OrderButtonNode.totalIncrease].getComponent(cc.Button).enabled = true;
    }

    calculateTotalBet(level: number, coin: number) {
        return +(level * coin * this.betMultiplier).toFixed(1);
    }
}
