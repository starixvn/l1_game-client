import { games } from "../../../configs/SabaConfigs";
import SabaConfigs = require("../../../configs/SabaConfigs");
import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";
import BalancedBettingPoolGameBase from "../../_base/BalancedBettingPoolGameBase";
import GameBaseFinishHandler from "../../_base/handlers/GameBaseFinishHandler";
import BigSmallBetHistory from "./BigSmallBetHistory";
import { BigSmallConfigs } from "./BigSmallConfigs";
import BigSmallHistory from "./BigSmallHistory";
import BigSmallMiniRoundHistory from "./BigSmallMiniRoundHistory";
import BigSmallStatistic from "./BigSmallStatistic";
import BigSmallBetHandler from "./handlers/BigSmallBetHandler";
import BigSmallFinishHandler from "./handlers/BigSmallFinishHandler";
import BigSmallLogsHandler from "./handlers/BigSmallLogsHandler";
import BigSmallStatusHandler from "./handlers/BigSmallStatusHandler";
import BigSmallTimeHandler from "./handlers/BigSmallTimeHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BigSmall extends BalancedBettingPoolGameBase {
    get gameId() {
        return games.BigSmall.id;
    }

    @property(cc.Prefab)
    miniRoundHistoryPrefab: cc.Prefab = null;

    @property(cc.Node)
    miniRoundHistoryContainer: cc.Node = null;

    @property(cc.Animation)
    diceAnimation: cc.Animation = null;

    @property(cc.Node)
    diceContainer: cc.Node = null;

    @property({ type: cc.Sprite })
    dices: cc.Sprite[] = [];

    @property({ type: cc.SpriteFrame })
    diceFrames: cc.SpriteFrame[] = [];

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Label)
    selectedBetAmountLabelLeft: cc.Label = null;

    @property(cc.Sprite)
    selectedBetAmountSpriteLeft: cc.Sprite = null;

    @property(cc.Label)
    selectedBetAmountLabelRight: cc.Label = null;

    @property(cc.Sprite)
    selectedBetAmountSpriteRight: cc.Sprite = null;

    @property(cc.SpriteFrame)
    selectedBetAmountClickedImage: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    selectedBetAmountUnClickedImage: cc.SpriteFrame = null;

    @property(cc.Prefab)
    betHistoryPrefab: cc.Prefab = null;

    @property(cc.Label)
    betPercentageLeft: cc.Label = null;

    @property(cc.Label)
    betPercentageRight: cc.Label = null;

    @property(cc.Node)
    resultNode: cc.Node = null;

    @property(cc.Label)
    resultLabel: cc.Label = null;

    @property(cc.Label)
    odds: cc.Label = null;

    @property(cc.Prefab)
    statisticPrefab: cc.Prefab = null;

    protected miniRoundHistory: BigSmallMiniRoundHistory;
    protected historyComponent: BigSmallHistory;
    protected betHistory: BigSmallBetHistory;
    statistic: BigSmallStatistic;
    diceAnimationDuration: number;

    readonly choices = ["small", "big"];

    initMiniPanel(miniPanel: MiniPanel) {
        this.init("taixiu", new BigSmallConfigs(), miniPanel);
    }

    onLoad() {
        super.onLoad();
        this.diceAnimationDuration = this.diceAnimation.defaultClip.duration / this.diceAnimation.defaultClip.speed;
        this.setValueBetAmount();
        this.initRoundHistory();
    }

    onDestroy() {
        super.onDestroy();
        this.miniRoundHistoryContainer.isValid && this.miniRoundHistoryContainer.destroyAllChildren();
    }

    onData(data: any) {
        super.onData(data);
        if (data.history) {
            this.historyComponent.onData(data.history);
        }

        if (data.round) {
            this.betHistory && this.betHistory.onData(data.round);
        }
    }

    initHandlers() {
        super.initHandlers();

        this.timeHandler = new BigSmallTimeHandler(this);
        this.logsHandler = new BigSmallLogsHandler(this);
        this.finishHandler = new BigSmallFinishHandler(this);
        this.betHandler = new BigSmallBetHandler(this);
        this.statusHandler = new BigSmallStatusHandler(this);
    }

    setValueBetAmount() {
        this.selectedBetAmountLabels = {
            [this.choices[0]]: this.selectedBetAmountLabelRight,
            [this.choices[1]]: this.selectedBetAmountLabelLeft
        };
        this.selectedBetAmountSprites = {
            [this.choices[0]]: this.selectedBetAmountSpriteRight,
            [this.choices[1]]: this.selectedBetAmountSpriteLeft
        };
        this.selectedBetAmountClickedImages = {
            [this.choices[0]]: this.selectedBetAmountClickedImage,
            [this.choices[1]]: this.selectedBetAmountClickedImage
        };
        this.selectedBetAmountUnClickedImages = {
            [this.choices[0]]: this.selectedBetAmountUnClickedImage,
            [this.choices[1]]: this.selectedBetAmountUnClickedImage
        };
        this.betPercentages = {
            [this.choices[0]]: this.betPercentageRight,
            [this.choices[1]]: this.betPercentageLeft
        };
    }

    initRoundHistory() {
        const mini = cc.instantiate(this.miniRoundHistoryPrefab);
        this.miniRoundHistory = mini.getComponent(BigSmallMiniRoundHistory);
        this.miniRoundHistory.handleBetHistory = (roundId) => {
            this.openBetHistory(roundId);
        };
        this.miniRoundHistoryContainer.addChild(mini);
    }

    updateRoundHistory() {
        this.miniRoundHistory.setData(this.currentDataLogs);
    }

    setDices(result) {
        Object.keys(result).forEach((key, index) => {
            this.dices[index].spriteFrame = this.diceFrames[result[key] - 1];
        });
    }

    showResult() {
        if (this.currentDataLogs.length > 0) {
            const { settlementResult } = this.currentDataLogs[0];

            cc.tween(this.node)
                .call(() => {
                    this.diceAnimation.node.active = true;
                    this.diceContainer.active = false;
                    this.diceAnimation.play();

                    const currentStatusData = this.statusHandler.currentStatusData;
                    currentStatusData && this.statusHandler.status(currentStatusData.win, currentStatusData.bet);
                })
                .delay(this.diceAnimationDuration)
                .call(() => {
                    this.diceAnimation.node.active = false;
                    this.diceContainer.active = true;
                    this.updateRoundHistory();
                })
                .start();

            (this.finishHandler as GameBaseFinishHandler).payChips(settlementResult, null);
            this.finishShowResult = true;
        }
    }

    showWinningAnimation(data) {
        cc.tween(this.node)
            .delay(this.diceAnimationDuration)
            .call(() => {
                this.betItems.forEach((betItem) => {
                    betItem.setHighlight(data.settlementResult[betItem.node.name], true);
                });

                this.resultNode.active = true;
                this.resultLabel.string = data.result.dice1 + data.result.dice2 + data.result.dice3;

                if (this.statistic && this.statistic.node && this.statistic.node.isValid) {
                    this.statistic.updateStatistic(this.currentDataLogs);
                }
            })
            .start();
    }

    public openHistory() {
        cc.RedT.audio.playClick();

        const dialog = cc.instantiate(this.historyPrefab);
        this.historyComponent = dialog.getComponent(BigSmallHistory);
        this.historyComponent.init(this.socket);
        this.historyComponent.handleBetHistory = (roundId) => {
            this.openBetHistory(roundId);
        };
        this.currentMiniPanel.node.addChild(dialog);
        this.historyComponent.setGameName(this.gameId);
    }

    public openStatistic() {
        cc.RedT.audio.playClick();

        const node = cc.instantiate(this.statisticPrefab);
        this.statistic = node.getComponent(BigSmallStatistic);
        this.currentMiniPanel.node.addChild(node);
        this.statistic.init(this.currentDataLogs);
        this.statistic.setGameName(this.gameId);
    }

    openBetHistory(roundId: number) {
        cc.RedT.audio.playClick();

        const node = cc.instantiate(this.betHistoryPrefab);
        this.betHistory = node.getComponent(BigSmallBetHistory);
        this.currentMiniPanel.node.addChild(node);
        this.betHistory.init(this, roundId);
    }

    resetDataAndUI() {
        super.resetDataAndUI();
        this.statusHandler.currentStatusData = null;
        this.diceAnimation.stop();
        this.diceAnimation.node.active = false;
        this.diceContainer.active = false;
        this.resultNode.active = false;
        this.node.stopAllActions();
        this.betItems.forEach((betItem) => {
            betItem.ownBet.string = "0";
        });
    }

    public updateOddsFromConfigs() {
        if (this.gameConfigs.odds) {
            this.odds.string = `1:${this.gameConfigs.odds[this.choices[0]]}`;
        }
    }
}
