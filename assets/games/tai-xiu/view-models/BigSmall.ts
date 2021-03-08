import DraggableItem from '../../../common/draggable-layout/view-models/DraggableItem';
import MiniRoundHistory from '../../../common/mini-round-history/MiniRoundHistory';
import { games } from '../../../configs/SabaConfigs';
import BalancedBettingPoolGameBase from '../../_base/BalancedBettingPoolGameBase';
import GameBaseFinishHandler from '../../_base/handlers/GameBaseFinishHandler';
import BigSmallGuide from './BigSmallGuide';
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

    private miniRoundHistory: MiniRoundHistory;
    // private historyComponent: SpecialSeDieHistory;
    // private betHistory: SpecialSedieBetHistory;

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
        // if (data.history) {
        //     this.historyComponent.onData(data.history);
        // }

        // if (data.round) {
        //     this.betHistory && this.betHistory.onData(data.round);
        // }
    }

    initHandlers() {
        super.initHandlers();

        this.timeHandler = new BigSmallTimeHandler(this);
        this.logsHandler = new BigSmallLogsHandler(this);
        this.finishHandler = new BigSmallFinishHandler(this);
        this.betHandler = new BigSmallBetHandler(this);
        this.statusHandler = new BigSmallStatusHandler(this);
    }

    // initRoundHistory() {
    //     const node = cc.instantiate(this.roundHistoryPrefab);
    //     this.roundHistory = node.getComponent(SedieRoundHistory);
    //     this.roundHistory.init(this);
    //     this.roundHistoryContainer.addChild(node);

    //     const mini = cc.instantiate(this.miniRoundHistoryPrefab);
    //     this.miniRoundHistory = mini.getComponent(SpecialSedieRoundHistory);
    //     this.miniRoundHistory.handleBetHistory = (roundId) => {
    //         this.openBetHistory(roundId);
    //     };
    //     this.miniRoundHistoryContainer.addChild(mini);
    // }

    // updateRoundHistory() {
    //     const miniHistoryData = this.currentDataLogs.map((log) => {
    //         let count = 0;
    //         const { result } = log;
    //         Object.keys(result).forEach((key) => {
    //             if (result[key]) {
    //                 count++;
    //             }
    //         });
    //         return {
    //             roundId: log.roundId || log.id || log.round,
    //             red: count
    //         };
    //     });
    //     this.roundHistory.setData(miniHistoryData.map((d) => d.red));
    //     this.miniRoundHistory.setData(miniHistoryData);
    // }

    setDices(result) {
        Object.keys(result).forEach((key, index) => {
            this.dices[index].spriteFrame = this.diceFrames[result[key]];
        });
    }

    showResult() {
        if (this.currentDataLogs.length > 0) {
            const { settlementResult } = this.currentDataLogs[0];

            (this.finishHandler as GameBaseFinishHandler).payChips(settlementResult, null);
            this.finishShowResult = true;
        }
    }

    showWinningAnimation() {
        const currentStatusData = this.statusHandler.currentStatusData;
        currentStatusData && this.statusHandler.status(currentStatusData.win, currentStatusData.bet);
    }

    public highlightLastResult() {
        if (this.currentTimeRemaining <= this.config.stopBetTime) {
            return;
        }
        const dataLog = this.currentDataLogs[0];
        dataLog && this.highlightWonItems(dataLog.settlementResult, false);
    }

    private highlightWonItems(settlementResult: any, isAnimated = true) {
        this.betItems.forEach((betItem) => {
            betItem.setHighlight(settlementResult[betItem.node.name], isAnimated);
        });
    }

    public openGuide() {
        const guide = cc.instantiate(this.guidePrefab);
        const specialSedieGuide = guide.getComponent(BigSmallGuide);
        specialSedieGuide.init(this.gameConfigs);
        this.currentMiniPanel.node.addChild(guide);
    }

    public openHistory() {
        // const dialog = cc.instantiate(this.historyPrefab);
        // this.historyComponent = dialog.getComponent(SpecialSeDieHistory);
        // this.historyComponent.init(this.socket);
        // this.historyComponent.handleBetHistory = (roundId) => {
        //     this.openBetHistory(roundId);
        // };
        // this.currentMiniPanel.node.addChild(dialog);
    }

    openBetHistory(roundId: number) {
        // const node = cc.instantiate(this.betHistoryPrefab);
        // this.betHistory = node.getComponent(SpecialSedieBetHistory);
        // this.betHistory.init(this, roundId);
        // this.currentMiniPanel.node.addChild(node);
    }

    resetDataAndUI() {
        super.resetDataAndUI();
        this.statusHandler.currentStatusData = null;
    }
}
