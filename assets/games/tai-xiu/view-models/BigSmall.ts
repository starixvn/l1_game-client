import DraggableItem from '../../../common/draggable-layout/view-models/DraggableItem';
import { games } from '../../../configs/SabaConfigs';
import BalancedBettingPoolGameBase from '../../_base/BalancedBettingPoolGameBase';
import GameBaseFinishHandler from '../../_base/handlers/GameBaseFinishHandler';
import BigSmallBetHistory from './BigSmallBetHistory';
import BigSmallGuide from './BigSmallGuide';
import BigSmallHistory from './BigSmallHistory';
import BigSmallMiniRoundHistory from './BigSmallMiniRoundHistory';
import BigSmallStatistic from './BigSmallStatistic';
import BigSmallBetHandler from './handlers/BigSmallBetHandler';
import BigSmallFinishHandler from './handlers/BigSmallFinishHandler';
import BigSmallLogsHandler from './handlers/BigSmallLogsHandler';
import BigSmallStatusHandler from './handlers/BigSmallStatusHandler';
import BigSmallTimeHandler from './handlers/BigSmallTimeHandler';

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
    guidePrefab: cc.Prefab = null;

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
    betPercentageBig: cc.Label = null;

    @property(cc.Label)
    betPercentageSmall: cc.Label = null;

    @property(cc.Node)
    resultNode: cc.Node = null;

    @property(cc.Label)
    resultLabel: cc.Label = null;

    @property(cc.Label)
    odds: cc.Label = null;

    @property(cc.Prefab)
    statisticPrefab: cc.Prefab = null;

    private miniRoundHistory: BigSmallMiniRoundHistory;
    private historyComponent: BigSmallHistory;
    private betHistory: BigSmallBetHistory;
    private bigSmallStats: BigSmallStatistic;

    private readonly choice = {
        big: "big",
        small: "small"
    };
    private showStats = true;

    onLoad() {
        super.onLoad();

        this.selectedBetAmountLabels = {
            [this.choice.small]: this.selectedBetAmountLabelRight,
            [this.choice.big]: this.selectedBetAmountLabelLeft
        };
        this.selectedBetAmountSprites = {
            [this.choice.small]: this.selectedBetAmountSpriteRight,
            [this.choice.big]: this.selectedBetAmountSpriteLeft
        };
        this.selectedBetAmountClickedImages = {
            [this.choice.small]: this.selectedBetAmountClickedImage,
            [this.choice.big]: this.selectedBetAmountClickedImage
        };
        this.selectedBetAmountUnClickedImages = {
            [this.choice.small]: this.selectedBetAmountUnClickedImage,
            [this.choice.big]: this.selectedBetAmountUnClickedImage
        };
        this.betPercentages = {
            [this.choice.small]: this.betPercentageSmall,
            [this.choice.big]: this.betPercentageBig
        };

        this.animatedTime.setAnimatedY(30, -5);
        this.initRoundHistory();

        const draggableItem = this.getComponent(DraggableItem);
        draggableItem.touchCallback.start = (node) => {
            this.node.parent.insertChild(this.node, this.node.parent.childrenCount - 1);
        };
    }

    onEnable() {
        super.onEnable();
        this.showStats = true;
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
                })
                .delay(3)
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
        this.betItems.forEach((betItem) => {
            betItem.setHighlight(data.settlementResult[betItem.node.name], true);
        });

        this.resultNode.active = true;
        this.resultLabel.string = data.result.dice1 + data.result.dice2 + data.result.dice3;
    }

    public openGuide() {
        cc.RedT.audio.playClick();

        const guide = cc.instantiate(this.guidePrefab);
        const specialSedieGuide = guide.getComponent(BigSmallGuide);
        specialSedieGuide.init(this.gameConfigs);
        this.currentMiniPanel.node.addChild(guide);
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
    }

    public openStatistic() {
        cc.RedT.audio.playClick();

        var node = cc.instantiate(this.statisticPrefab);
        this.bigSmallStats = node.getComponent("BigSmallStatistic");
        this.bigSmallStats.init(this);
        this.currentMiniPanel.node.addChild(node);
    }

    openBetHistory(roundId: number) {
        cc.RedT.audio.playClick();

        const node = cc.instantiate(this.betHistoryPrefab);
        this.betHistory = node.getComponent(BigSmallBetHistory);
        this.betHistory.init(this, roundId);
        this.currentMiniPanel.node.addChild(node);
    }

    resetDataAndUI() {
        super.resetDataAndUI();
        this.statusHandler.currentStatusData = null;
        this.diceContainer.active = false;
        this.resultNode.active = false;
    }

    public updateOddsFromConfigs() {
        if (this.gameConfigs.odds) {
            this.odds.string = `1:${this.gameConfigs.odds.big}`;
        }
    }
}
