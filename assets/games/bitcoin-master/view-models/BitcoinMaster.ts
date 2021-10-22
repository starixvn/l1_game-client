import AnimatedTime from "../../../common/animated-time/view-models/AnimatedTime";
import AudioManager from "../../../common/audio/AudioManager";
import { GameIds } from "../../../configs/SabaConfigs";
import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";
import BalancedBettingPoolGameBase from "../../_base/BalancedBettingPoolGameBase";
import GameBaseFinishHandler from "../../_base/handlers/GameBaseFinishHandler";
import BitcoinMasterChart from "./BitcoinMasterChart";
import { BitcoinMasterConfigs } from "./BitcoinMasterConfigs";
import BitCoinMasterProgressBar from "./BitCoinMasterProgressBar";
import BitcoinMasterFinishHandler from "./handlers/BitCoinMasterFinishHandler";
import BitcoinMasterLogsHandler from "./handlers/BitCoinMasterLogsHandler";
import BitcoinMasterStatusHandler from "./handlers/BitCoinMasterStatusHandler";
import BitcoinMasterTimeHandler from "./handlers/BitCoinMasterTimeHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMaster extends BalancedBettingPoolGameBase {
    @property(cc.Prefab)
    miniRoundHistoryUpDownPrefab: cc.Prefab = null;

    @property(cc.Node)
    miniRoundHistoryUpDownContainer: cc.Node = null;

    @property(cc.Prefab)
    miniRoundHistoryEvenOddPrefab: cc.Prefab = null;

    @property(cc.Node)
    miniRoundHistoryEvenOddContainer: cc.Node = null;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Label)
    selectedUpBetAmountLabel: cc.Label = null;

    @property(cc.Sprite)
    selectedUpBetAmountSprite: cc.Sprite = null;

    @property(cc.Label)
    selectedDownBetAmountLabel: cc.Label = null;

    @property(cc.Sprite)
    selectedDownBetAmountSprite: cc.Sprite = null;

    @property(cc.Label)
    selectedEvenBetAmountLabel: cc.Label = null;

    @property(cc.Sprite)
    selectedEvenBetAmountSprite: cc.Sprite = null;

    @property(cc.Label)
    selectedOddBetAmountLabel: cc.Label = null;

    @property(cc.Sprite)
    selectedOddBetAmountSprite: cc.Sprite = null;

    @property(cc.SpriteFrame)
    selectedBetAmountClickedImage: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    selectedBetAmountUnClickedImage: cc.SpriteFrame = null;

    @property(cc.Prefab)
    betHistoryPrefab: cc.Prefab = null;

    @property(cc.Label)
    upBetPercentage: cc.Label = null;

    @property(cc.Label)
    downBetPercentage: cc.Label = null;

    @property(cc.Label)
    evenBetPercentage: cc.Label = null;

    @property(cc.Label)
    oddBetPercentage: cc.Label = null;

    @property(cc.Node)
    upDownResultNode: cc.Node = null;

    @property(cc.Node)
    evenOddResultNode: cc.Node = null;

    // @property(cc.Label)
    // resultLabel: cc.Label = null;

    @property(cc.Label)
    upDownOdds: cc.Label = null;

    @property(cc.Label)
    evenOddOdds: cc.Label = null;

    @property(cc.Prefab)
    statisticPrefab: cc.Prefab = null;

    @property(BitcoinMasterChart)
    chartWebView: BitcoinMasterChart = null;

    @property(cc.Label)
    currentBitcoinValue: cc.Label = null;

    @property(AnimatedTime)
    currentCandleTime: AnimatedTime = null;

    @property(BitCoinMasterProgressBar)
    timeProgressBar: BitCoinMasterProgressBar = null;

    // protected miniRoundHistory: BigSmallMiniRoundHistory;
    // protected betHistory: BigSmallBetHistory;
    // statistic: BigSmallStatistic;
    private currentTimeRemainingCandle: number;
    readonly choices = ["up", "down", "even", "odd"];
    remainingTimeGame: number;

    initMiniPanel(miniPanel: MiniPanel) {
        super.initMiniPanel(miniPanel);
        this.gameId = GameIds.BitcoinMaster;
        this.setConfig(new BitcoinMasterConfigs());
    }

    onLoad() {
        super.onLoad();
        this.setValueBetAmount();
        this.initRoundHistory();
        this.animatedTime.setAnimatedY(10, 0);
        this.animatedTime.setRedTime(this.config.stopBetTime);
    }

    onEnable() {
        super.onEnable();
        this.initChart();
    }

    onDestroy() {
        super.onDestroy();
        // this.miniRoundHistoryUpDownContainer.isValid && this.miniRoundHistoryUpDownContainer.destroyAllChildren();
    }

    onData(data: any) {
        super.onData(data);
        if (data.close) {
            this.setCurrencyBitCoinValue(data.close);
        }

        if (data.remainingTime) {
            this.remainingTimeGame = data.remainingTime;
            this.unschedule(this.setTime);
            this.setCandleTime(data.remainingTime);
            console.log("timeProgressBar", data.remainingTime);
            this.timeProgressBar.init(this);
            this.timeProgressBar.setData();
        }

        // if (data.round) {
        //     this.betHistory && this.betHistory.onData(data.round);
        // }
    }

    initHandlers() {
        super.initHandlers();

        this.timeHandler = new BitcoinMasterTimeHandler(this);
        this.logsHandler = new BitcoinMasterLogsHandler(this);
        this.finishHandler = new BitcoinMasterFinishHandler(this);
        this.betHandler = new BitcoinMasterTimeHandler(this);
        this.statusHandler = new BitcoinMasterStatusHandler(this);
    }

    setValueBetAmount() {
        this.selectedBetAmountLabels = {
            [this.choices[0]]: this.selectedUpBetAmountLabel,
            [this.choices[1]]: this.selectedDownBetAmountLabel,
            [this.choices[2]]: this.selectedEvenBetAmountLabel,
            [this.choices[3]]: this.selectedOddBetAmountLabel
        };
        this.selectedBetAmountSprites = {
            [this.choices[0]]: this.selectedUpBetAmountSprite,
            [this.choices[1]]: this.selectedDownBetAmountSprite,
            [this.choices[2]]: this.selectedEvenBetAmountSprite,
            [this.choices[3]]: this.selectedOddBetAmountSprite
        };
        this.selectedBetAmountClickedImages = {
            [this.choices[0]]: this.selectedBetAmountClickedImage,
            [this.choices[1]]: this.selectedBetAmountClickedImage,
            [this.choices[2]]: this.selectedBetAmountClickedImage,
            [this.choices[3]]: this.selectedBetAmountClickedImage
        };
        this.selectedBetAmountUnClickedImages = {
            [this.choices[0]]: this.selectedBetAmountUnClickedImage,
            [this.choices[1]]: this.selectedBetAmountUnClickedImage,
            [this.choices[2]]: this.selectedBetAmountUnClickedImage,
            [this.choices[3]]: this.selectedBetAmountUnClickedImage
        };
        this.betPercentages = {
            [this.choices[0]]: this.upBetPercentage,
            [this.choices[1]]: this.downBetPercentage,
            [this.choices[2]]: this.evenBetPercentage,
            [this.choices[3]]: this.oddBetPercentage
        };
    }

    initRoundHistory() {
        // const mini = cc.instantiate(this.miniRoundHistoryPrefab);
        // this.miniRoundHistory = mini.getComponent(BigSmallMiniRoundHistory);
        // this.miniRoundHistory.handleBetHistory = (roundId) => {
        //     this.openBetHistory(roundId);
        // };
        // this.miniRoundHistoryContainer.addChild(mini);
    }

    updateRoundHistory() {
        // this.miniRoundHistory.setData(this.currentDataLogs);
    }

    setDices(result) {
        // Object.keys(result).forEach((key, index) => {
        //     this.dices[index].spriteFrame = this.diceFrames[result[key] - 1];
        // });
    }

    showResult() {
        if (this.currentDataLogs.length > 0) {
            const { settlementResult } = this.currentDataLogs[0];

            (this.finishHandler as GameBaseFinishHandler).payChips(settlementResult, null);
            this.finishShowResult = true;
        }
    }

    showWinningAnimation(data) {
        // cc.tween(this.node)
        //     .delay(this.diceAnimationDuration)
        //     .call(() => {
        //         this.betItems.forEach((betItem) => {
        //             betItem.setHighlight(data.settlementResult[betItem.node.name], true);
        //         });
        //         this.upDownResultNode.active = true;
        //         this.resultLabel.string = data.result.dice1 + data.result.dice2 + data.result.dice3;
        //         if (this.statistic && this.statistic.isAlive()) {
        //             this.statistic.updateStatistic(this.currentDataLogs);
        //         }
        //     })
        //     .start();
    }

    public openHistory() {
        AudioManager.getInstance().playClick();

        // const dialog = cc.instantiate(this.historyPrefab);
        // this.historyComponent = dialog.getComponent(BigSmallHistory);
        // const historyComp = this.historyComponent as BigSmallHistory;
        // historyComp.init(this.socket);
        // historyComp.handleBetHistory = (roundId) => {
        //     this.openBetHistory(roundId);
        // };
        // this.currentMiniPanel.node.addChild(dialog);
        // historyComp.setGameName(this.gameId);
    }

    public openStatistic() {
        AudioManager.getInstance().playClick();

        // const node = cc.instantiate(this.statisticPrefab);
        // this.statistic = node.getComponent(BigSmallStatistic);
        // this.currentMiniPanel.node.addChild(node);
        // this.statistic.init(this.currentDataLogs);
        // this.statistic.setGameName(this.gameId);
    }

    openBetHistory(roundId: number) {
        AudioManager.getInstance().playClick();

        // const node = cc.instantiate(this.betHistoryPrefab);
        // this.betHistory = node.getComponent(BigSmallBetHistory);
        // this.currentMiniPanel.node.addChild(node);
        // this.betHistory.init(this, roundId);
    }

    resetDataAndUI() {
        super.resetDataAndUI();
        this.statusHandler.currentStatusData = null;
        this.upDownResultNode.active = false;
        // this.node.stopAllActions();
        this.betItems.forEach((betItem) => {
            betItem.ownBet.string = "0";
        });
    }

    public updateOddsFromConfigs() {
        if (this.gameConfigs.odds) {
            this.upDownOdds.string = `1:${this.gameConfigs.odds[this.choices[0]]}`;
            this.evenOddOdds.string = `1:${this.gameConfigs.odds[this.choices[2]]}`;
        }
    }

    initChart() {
        this.chartWebView.initURL(window.authData.ss);
        this.chartWebView.loadWebView();
    }

    setCurrencyBitCoinValue(value: number) {
        this.currentBitcoinValue.string = value.toString();
    }

    setCandleTime(time: number) {
        const candleLife = 60;
        let candle1 = time > candleLife ? time - candleLife : time;
        this.currentTimeRemainingCandle = candle1;
        this.schedule(this.setTime, 1);
    }

    setTime() {
        this.currentTimeRemainingCandle--;
        if (this.currentTimeRemainingCandle < 0) {
            this.currentTimeRemainingCandle = 60;
        }
        this.currentCandleTime.setTime(this.currentTimeRemainingCandle.toString());
    }
}
