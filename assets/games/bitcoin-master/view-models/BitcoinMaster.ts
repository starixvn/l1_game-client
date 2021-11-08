import AudioManager from "../../../common/audio/AudioManager";
import GameUtils from "../../../common/GameUtils";
import { GameIds } from "../../../configs/SabaConfigs";
import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";
import BalancedBettingPoolGameBase from "../../_base/BalancedBettingPoolGameBase";
import GameBaseFinishHandler from "../../_base/handlers/GameBaseFinishHandler";
import BalancedBettingPoolBetItem from "../../_base/view-models/BalancedBettingPoolBetItem";
import BitcoinMasterBetHistory from "./BitcoinMasterBetHistory";
import BitcoinMasterCandleTimer from "./BitcoinMasterCandleTimer";
import BitcoinMasterChart from "./BitcoinMasterChart";
import { BMBetType } from "./BitcoinMasterCommon";
import { BitcoinMasterConfigs } from "./BitcoinMasterConfigs";
import BitcoinMasterCurrentCandleValue from "./BitcoinMasterCurrentCandleValue";
import BitcoinMasterEvenOddMiniRoundHistory from "./BitcoinMasterEvenOddMiniRoundHistory";
import BitcoinMasterHistory from "./BitcoinMasterHistory";
import BitCoinMasterProgressBar from "./BitCoinMasterProgressBar";
import BitcoinMasterResult from "./BitcoinMasterResult";
import BitcoinMasterStatistic from "./BitcoinMasterStatistic";
import BitcoinMasterUpDownMiniRoundHistory from "./BitcoinMasterUpDownMiniRoundHistory";
import BitCoinMasterBetHandler from "./handlers/BitCoinMasterBetHandler";
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

    @property(cc.SpriteFrame)
    disabledBetButtonImage: cc.SpriteFrame = null;

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

    @property(BitcoinMasterResult)
    result: BitcoinMasterResult = null;

    @property(cc.Label)
    upDownOdds: cc.Label = null;

    @property(cc.Label)
    evenOddOdds: cc.Label = null;

    @property(cc.Prefab)
    statisticPrefab: cc.Prefab = null;

    @property(cc.Node)
    statisticNode: cc.Node = null;

    @property(BitcoinMasterChart)
    chartWebView: BitcoinMasterChart = null;

    @property(BitcoinMasterCurrentCandleValue)
    currentCandleValue: BitcoinMasterCurrentCandleValue = null;

    @property(BitcoinMasterCandleTimer)
    currentCandleTime: BitcoinMasterCandleTimer = null;

    @property(BitCoinMasterProgressBar)
    timeProgressBar: BitCoinMasterProgressBar = null;

    @property(cc.Label)
    descTimeLabel: cc.Label = null;

    @property(cc.Label)
    bettingPrice: cc.Label = null;

    @property(cc.Node)
    upDownTooltipNode: cc.Node = null;

    @property(cc.Node)
    evenOddTooltipNode: cc.Node = null;

    protected upDownMiniRoundHistory: BitcoinMasterUpDownMiniRoundHistory;
    protected evenOddMiniRoundHistory: BitcoinMasterEvenOddMiniRoundHistory;
    protected betHistory: BitcoinMasterBetHistory;
    statistic: BitcoinMasterStatistic;
    readonly choices = ["up", "down", "even", "odd"];
    remainingTimeGame: number;
    bettingPricePosition: cc.Vec3;
    movingBettingPricePosition: cc.Vec3;
    closePricePosition: cc.Vec3;
    movingClosePricePosition: cc.Vec3;
    gapAmountPosition: cc.Vec3;
    movingGapAmountPosition: cc.Vec3;
    evenOddResultPosition: cc.Vec3;
    movingEvenOddResultPosition: cc.Vec3;

    initMiniPanel(miniPanel: MiniPanel) {
        super.initMiniPanel(miniPanel);
        this.gameId = GameIds.BitcoinMaster;
        this.setConfig(new BitcoinMasterConfigs());
    }

    onLoad() {
        this.storeLabelPosition();
        super.onLoad();
        this.setValueBetAmount();
        this.initRoundHistory();
        this.animatedTime.setAnimatedY(0, 0);
        this.animatedTime.setRedTime(-1);
        GameUtils.moveToOtherNode(this.upDownMiniRoundHistory.bitcoinTip.node, this.upDownTooltipNode);
        GameUtils.moveToOtherNode(this.evenOddMiniRoundHistory.tip.node, this.evenOddTooltipNode);
        this.currentMiniPanel.addNewLayerCallback(this.gameName, () => {
            const zIndex = this.node.getSiblingIndex();

            if (
                zIndex < this.node.parent.childrenCount - 1 ||
                this.currentMiniPanel.noticeContainer.childrenCount > 0 ||
                this.currentMiniPanel.guideContainer.childrenCount > 0 ||
                this.currentMiniPanel.dialog.childrenCount > 0
            ) {
                this.hideChart();
            } else {
                this.showChart();
            }
        });

        this.statisticNode.on(cc.Node.EventType.CHILD_ADDED, this.hideChart.bind(this));
        this.statisticNode.on(cc.Node.EventType.CHILD_REMOVED, this.showChart.bind(this));
    }

    hideChart() {
        this.chartWebView.hideWebView();
    }

    showChart() {
        this.chartWebView.showWebView();
    }

    onEnable() {
        super.onEnable();
        this.initChart();
    }

    onDestroy() {
        this.currentMiniPanel.removeNewLayerCallback(this.gameName);
        super.onDestroy();
        this.miniRoundHistoryUpDownContainer.isValid && this.miniRoundHistoryUpDownContainer.destroyAllChildren();
        this.miniRoundHistoryEvenOddContainer.isValid && this.miniRoundHistoryEvenOddContainer.destroyAllChildren();
    }

    onData(data: any) {
        super.onData(data);
        if (data.close) {
            this.currentCandleValue.setData(data.open, data.close);
        }

        if (data.remainingTime) {
            this.remainingTimeGame = data.remainingTime;
            this.currentCandleTime.setCandleTime(this.remainingTimeGame);
            this.timeProgressBar.init(this);
        }

        if (data.round) {
            this.betHistory && this.betHistory.onData(data.round);
        }

        this.setBettingPrice(data);
    }

    initHandlers() {
        super.initHandlers();

        this.timeHandler = new BitcoinMasterTimeHandler(this);
        this.logsHandler = new BitcoinMasterLogsHandler(this);
        this.finishHandler = new BitcoinMasterFinishHandler(this);
        this.betHandler = new BitCoinMasterBetHandler(this);
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
        const upDownMini = cc.instantiate(this.miniRoundHistoryUpDownPrefab);
        this.upDownMiniRoundHistory = upDownMini.getComponent(BitcoinMasterUpDownMiniRoundHistory);
        this.upDownMiniRoundHistory.handleBetHistory = (roundId, view) => {
            this.openBetHistory(roundId, view);
        };
        this.miniRoundHistoryUpDownContainer.addChild(upDownMini);

        const evenOddMini = cc.instantiate(this.miniRoundHistoryEvenOddPrefab);
        this.evenOddMiniRoundHistory = evenOddMini.getComponent(BitcoinMasterEvenOddMiniRoundHistory);
        this.evenOddMiniRoundHistory.handleBetHistory = (roundId, view) => {
            this.openBetHistory(roundId, view);
        };
        this.miniRoundHistoryEvenOddContainer.addChild(evenOddMini);
    }

    updateRoundHistory() {
        this.upDownMiniRoundHistory.setData(this.currentDataLogs);
        this.evenOddMiniRoundHistory.setData(this.currentDataLogs);
    }

    setResult(result: any) {
        this.result.setData(result);
    }

    showResult() {
        this.disableHistoryButton();
        if (this.currentDataLogs.length > 0) {
            const { settlementResult } = this.currentDataLogs[0];
            this.result.showResult();
            if (this.currentTimeRemaining === this.config.fullTime - 1) {
                this.moveAnimation(0.4, this.result.closeBitcoinLabel.node, this.closePricePosition, this.movingClosePricePosition);
                this.moveAnimation(0.4, this.result.gapAmountComp.gapAmount.node, this.gapAmountPosition, this.movingGapAmountPosition);
                this.moveAnimation(0.4, this.result.evenOddResultLabel.node, this.evenOddResultPosition, this.movingEvenOddResultPosition);
            }
            const currentStatusData = this.statusHandler.currentStatusData;
            currentStatusData && this.statusHandler.status(currentStatusData.win, currentStatusData.bet);

            (this.finishHandler as GameBaseFinishHandler).payChips(settlementResult, null);
            this.finishShowResult = true;
        }
    }

    showWinningAnimation(data) {
        this.betItems.forEach((betItem) => {
            betItem.setHighlight(data.settlementResult[betItem.node.name], true);
        });
    }

    public openHistory() {
        AudioManager.getInstance().playClick();
        const node = cc.instantiate(this.historyPrefab);
        this.historyComponent = node.getComponent(BitcoinMasterHistory);
        const historyComp = this.historyComponent as BitcoinMasterHistory;
        historyComp.init(this.socket);
        historyComp.handleBetHistory = (roundId, view) => {
            this.openBetHistory(roundId, view);
        };

        this.currentMiniPanel.addDialog(node);
    }

    public openStatistic() {
        AudioManager.getInstance().playClick();
        const node = cc.instantiate(this.statisticPrefab);
        this.statistic = node.getComponent(BitcoinMasterStatistic);
        const condition = () => {
            return this.currentTimeRemaining < this.config.stopBetTime || this.currentTimeRemaining > this.config.fullTime;
        };
        this.statistic.init(this);
        this.statistic.setData(this.currentDataLogs);
        this.statistic.logControl.init(condition);
        this.statisticNode.addChild(node);
        this.chartWebView.hideWebView();
    }

    openBetHistory(roundId: number, view) {
        AudioManager.getInstance().playClick();
        const node = cc.instantiate(this.betHistoryPrefab);
        this.betHistory = node.getComponent(BitcoinMasterBetHistory);
        this.currentMiniPanel.addDialog(node);
        this.betHistory.init(this, roundId);
        this.betHistory.setDefaultView(view);
    }

    resetDataAndUI() {
        super.resetDataAndUI();
        this.statusHandler.currentStatusData = null;
        this.betItems.forEach((betItem) => {
            betItem.ownBet.string = "0";
        });
        this.node.stopAllActions();
        this.result.showResult(false);
        this.bettingPrice.node.position = this.bettingPricePosition;
        this.bettingPrice.node.active = false;
        this.result.closeBitcoinLabel.node.position = this.movingClosePricePosition;
        this.result.gapAmountComp.gapAmount.node.position = this.movingGapAmountPosition;
        this.result.evenOddResultLabel.node.position = this.movingEvenOddResultPosition;
        this.enableBetButtons(true, this.selectedBetAmountUnClickedImage);
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

    updateDescTimeGeneralInfo(desc: string) {
        this.descTimeLabel.string = desc;
    }

    closeGame() {
        super.closeGame();
        this.statisticNode.destroyAllChildren();
        this.chartWebView.hideWebView();
    }

    balanceBet() {
        const totalBets = this.totalBets;
        const upDownBalancedBetAmount = Math.min(...[totalBets.up ?? 0, totalBets.down ?? 0]);
        const evenOddBalancedBetAmount = Math.min(...[totalBets.even ?? 0, totalBets.odd ?? 0]);

        this.betItems.forEach((item) => {
            const itemComp = item as BalancedBettingPoolBetItem;
            if (item.node.name === BMBetType.Up || item.node.name === BMBetType.Down) {
                itemComp.balanceBet(upDownBalancedBetAmount);
            } else {
                itemComp.balanceBet(evenOddBalancedBetAmount);
            }
        });
    }

    convertCurrentBitcoinPosition(node: cc.Node, destNode: cc.Node): cc.Vec3 {
        return destNode.parent.convertToNodeSpaceAR(node.convertToWorldSpaceAR(cc.v3(0, 0, 0)));
    }

    setBettingPrice(data: any) {
        if (data.open && !data.close) {
            this.bettingPrice.node.active = true;
            this.bettingPrice.string = data.open;
            if (this.currentTimeRemaining === 58) {
                this.moveAnimation(0.2, this.bettingPrice.node, this.bettingPricePosition, this.movingBettingPricePosition);
            }
        }
    }

    storeLabelPosition() {
        this.bettingPricePosition = this.bettingPrice.node.position;
        this.movingBettingPricePosition = this.convertCurrentBitcoinPosition(this.currentCandleValue.value.node, this.bettingPrice.node);

        this.closePricePosition = this.result.closeBitcoinLabel.node.position;
        this.movingClosePricePosition = this.convertCurrentBitcoinPosition(
            this.currentCandleValue.value.node,
            this.result.closeBitcoinLabel.node
        );

        this.gapAmountPosition = this.result.gapAmountComp.gapAmount.node.position;
        this.movingGapAmountPosition = this.convertCurrentBitcoinPosition(
            this.currentCandleValue.value.node,
            this.result.gapAmountComp.node
        );

        this.evenOddResultPosition = this.result.evenOddResultLabel.node.position;
        this.movingEvenOddResultPosition = this.convertCurrentBitcoinPosition(
            this.currentCandleValue.value.node,
            this.result.evenOddResultLabel.node
        );
    }

    moveAnimation(duration: number, node: cc.Node, position: cc.Vec3, movingPosition: cc.Vec3) {
        node.position = movingPosition;
        node.opacity = 100;
        node.scale = 0.5;

        cc.tween(node).to(duration, { opacity: 255, position: position, scale: 1 }, { easing: "sineOut" }).start();
    }

    enableBetButtons(enabled: boolean, image: cc.SpriteFrame) {
        const upButton = this.selectedUpBetAmountSprite.node.getComponent(cc.Button);
        const downButton = this.selectedDownBetAmountSprite.node.getComponent(cc.Button);
        const evenButton = this.selectedEvenBetAmountSprite.node.getComponent(cc.Button);
        const oddButton = this.selectedOddBetAmountSprite.node.getComponent(cc.Button);
        upButton.interactable = enabled;
        downButton.interactable = enabled;
        evenButton.interactable = enabled;
        oddButton.interactable = enabled;

        this.selectedUpBetAmountSprite.spriteFrame = image;
        this.selectedDownBetAmountSprite.spriteFrame = image;
        this.selectedEvenBetAmountSprite.spriteFrame = image;
        this.selectedOddBetAmountSprite.spriteFrame = image;
    }

    hideBetButtons() {
        if (!this.betBoardContainer.children[0].active) {
            this.enableBetButtons(false, this.disabledBetButtonImage);
        }
    }
}
