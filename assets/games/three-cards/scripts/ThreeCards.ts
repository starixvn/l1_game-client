import GameUtils from "../../../common/GameUtils";
import MiniRoundHistory from "../../../common/mini-round-history/MiniRoundHistory";
import NewCard from "../../../common/new-card/view-models/NewCard";
import SocketIOTableGameBase from "../../_base/SocketIOTableGameBase";
import { ThreeCardsRoundData } from "./DataDefinition";
import { ThreeCardsConfigs } from "./ThreeCardsConfigs";
import ThreeCardsResultStatistics from "./ThreeCardsResultStatistics";
import ThreeCardsRoundHistory from "./ThreeCardsRoundHistory";
import { games } from "../../../configs/SabaConfigs";
import GameRoomBaseBetHandler from "../../_base/handlers/GameRoomBaseBetHandler";
import ThreeCardsLogsHandler from "./handlers/ThreeCardsLogsHandler";
import ThreeCardsTimeHandler from "./handlers/ThreeCardsTimeHandler";
import ThreeCardsFinishHandler from "./handlers/ThreeCardsFinishHandler";
import ThreeCardsGuide from "./ThreeCardsGuide";
import ThreeCardsHistory from "./ThreeCardsHistory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ThreeCards extends SocketIOTableGameBase {
    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    guidePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    roundHistoryPrefab: cc.Prefab = null;

    @property(cc.Node)
    roundHistoryContainer: cc.Node = null;

    @property(cc.Prefab)
    miniRoundHistoryPrefab: cc.Prefab = null;

    @property(cc.Node)
    miniRoundHistoryContainer: cc.Node = null;

    @property(cc.Node)
    chipContainer: cc.Node = null;

    @property(cc.Node)
    totalBetContainer: cc.Node = null;

    @property(cc.Node)
    ownBetContainer: cc.Node = null;

    @property(cc.Animation)
    dealingAnimation: cc.Animation = null;

    @property({ type: cc.Animation })
    flippingAnimations: cc.Animation[] = [];

    @property({ type: NewCard })
    resultCards: NewCard[] = [];

    @property(ThreeCardsResultStatistics)
    resultStatistics: ThreeCardsResultStatistics = null;

    roundHistory: ThreeCardsRoundHistory;
    miniRoundHistory: MiniRoundHistory;
    historyComponent: ThreeCardsHistory;
    openCardsAnimation: cc.Tween = null;
    constructor() {
        super();
        this.init("ThreeCards", new ThreeCardsConfigs(), null, 1, games.ThreeCards.id);
    }

    initHandlers() {
        super.initHandlers();
        this.logsHandler = new ThreeCardsLogsHandler(this);
        this.timeHandler = new ThreeCardsTimeHandler(this);
        this.finishHandler = new ThreeCardsFinishHandler(this);
        this.betHandler = new GameRoomBaseBetHandler(this);
    }

    onLoad() {
        super.onLoad();
        this.initRoundHistory();

        this.animatedTime.setAnimatedY(20, 0);
        this.betItems.forEach((item) => {
            GameUtils.moveToOtherNode(item.chipNode, this.chipContainer);
            GameUtils.moveToOtherNode(item.totalBet.node, this.totalBetContainer);
            GameUtils.moveToOtherNode(item.ownBet.node, this.ownBetContainer);
        });

        this.miniRoundHistory.tip.node.zIndex = 100;
        GameUtils.moveToOtherNode(this.miniRoundHistory.tip.node, this.ownBetContainer);
        this.showCards(false);
    }

    showCards(show: boolean) {
        this.dealingAnimation.node.active = show;
    }

    initRoundHistory() {
        const node = cc.instantiate(this.roundHistoryPrefab);
        this.roundHistory = node.getComponent(ThreeCardsRoundHistory);
        const showResultDuration = 2;
        const condition = () => {
            return (
                this.currentTimeRemaining < this.config.stopBetTime || this.currentTimeRemaining > this.config.fullTime - showResultDuration
            );
        };
        this.roundHistory.logControl.init(condition);
        this.roundHistoryContainer.addChild(node);

        const mini = cc.instantiate(this.miniRoundHistoryPrefab);
        this.miniRoundHistory = mini.getComponent(MiniRoundHistory);
        this.miniRoundHistory.init(condition);
        this.miniRoundHistoryContainer.addChild(mini);
    }

    updateRoundHistory() {
        this.roundHistory.setData(this.currentDataLogs);

        const miniHistoryData = this.currentDataLogs.map((d) => {
            return {
                roundId: d.roundId,
                result: d.settlementResult.red,
                detail: d.result.map((card) => card.suit)
            };
        });
        this.miniRoundHistory.setData(miniHistoryData);

        const resultStatisticsData = this.currentDataLogs.map((log) => {
            return log.result.map((card) => card.suit);
        });
        this.resultStatistics.setData(resultStatisticsData);
        this.resultStatistics.node.active = true;
    }

    playDealingAnimation() {
        this.dealingAnimation.play();
    }

    playOpenCardAnimation(onFinished: () => void) {
        const delayTime = 0.5;
        let count = 0;
        this.openCardsAnimation = cc
            .tween(this.node)
            .repeat(
                3,
                cc
                    .tween()
                    .call(() => {
                        this.flippingAnimations[count].play();
                        this.resultCards[count].faceUp();
                        count++;
                    })
                    .delay(delayTime)
            )
            .call(onFinished)
            .start();
    }

    resetOpenCardAnimation() {
        if (this.openCardsAnimation) {
            this.openCardsAnimation.stop();
            this.openCardsAnimation = null;
        }
    }

    resetCards() {
        this.flippingAnimations.forEach((animation) => (animation.node.y = 0));
        this.resultCards.forEach((card) => card.faceDown());
    }

    showResult(data: ThreeCardsRoundData): Promise<void> {
        return new Promise((resolve) => {
            this.setCardsResult(data);
            this.playOpenCardAnimation(() => {
                this.highlightWonItems(data.settlementResult);
                this.updateAfterResult();
                resolve();
            });
        });
    }

    setCardsResult(data: any, faceUp = false) {
        const result = data.result;
        this.resultCards.forEach((card, index) => {
            card.setCard(result[index]);
            if (faceUp) {
                card.faceUp();
            } else {
                card.faceDown();
            }
        });
    }

    updateAfterResult() {
        this.updateRoundHistory();
        this.setCardsResult(this.currentDataLogs[0], true);
    }

    highlightLastResult() {
        if (this.currentTimeRemaining <= this.config.stopBetTime) {
            return;
        }
        const dataLog = this.currentDataLogs[0];
        dataLog && this.highlightWonItems(dataLog.settlementResult, false);
    }

    highlightWonItems(settlementResult: any, isAnimated = true) {
        this.betItems.forEach((betItem) => {
            betItem.setHighlight(settlementResult[betItem.node.name], isAnimated);
        });
    }

    openGuide() {
        cc.RedT.audio.playClick();
        const dialog = cc.instantiate(this.guidePrefab);
        const guide = dialog.getComponent(ThreeCardsGuide);
        guide.init(this.gameConfigs);
        this.currentMiniPanel.addDialog(dialog);
    }

    openHistory() {
        cc.RedT.audio.playClick();
        const dialog = cc.instantiate(this.historyPrefab);
        this.historyComponent = dialog.getComponent(ThreeCardsHistory);
        this.historyComponent.init(this.socket);
        this.currentMiniPanel.addDialog(dialog);
    }

    onDataGameRoom(data) {
        if (data.history) {
            this.historyComponent.onData(data.history);
        }

        super.onDataGameRoom(data);
    }
}
