import AudioManager from "../../../common/audio/AudioManager";
import { Durations } from "../../_new/_base/game-data-management/models/durations";
import { DishAnimation } from "../../bigsmall/view-models/BigSmall";
import { BigSmallConfigs } from "../../bigsmall/view-models/BigSmallConfigs";
import BigSmallDicesStatistic from "../../bigsmall/view-models/BigSmallDicesStatistic";
import BigSmallMiniRoundHistory from "../../bigsmall/view-models/BigSmallMiniRoundHistory";
import MultiplayGameSingle from "../../multiplay/scripts/MultiplayGameSingle";
import { handlePlacingBet, handleShakeDish, showBgTimer } from "./actions/CustomActions";
import MultiplayGameHistory from "./MultiplayGameHistory";
import { UnbalancedBigSmall1Id, unbalancedBigSmallConfigs } from "./UnbalancedBigSmallConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UnbalancedBigSmall extends MultiplayGameSingle {
    @property({ type: cc.Sprite })
    dices: cc.Sprite[] = [];

    @property({ type: cc.SpriteAtlas })
    diceAtlas: cc.SpriteAtlas = null;

    @property(cc.Node)
    thePlate: cc.Node = null;

    @property(cc.AudioSource)
    shakeDishAudio: cc.AudioSource = null;

    @property(cc.Animation)
    shakeThePlateAnimation: cc.Animation = null;

    @property(cc.Node)
    resultNode: cc.Node = null;

    @property(cc.Label)
    resultLabel: cc.Label = null;

    @property(cc.Node)
    bgTimer: cc.Node = null;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Sprite)
    gameNameImage: cc.Sprite = null;

    @property(cc.Sprite)
    tableGameBg: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    mainAtlas: cc.SpriteAtlas = null;

    public isMiniGameInContainer = true;

    constructor() {
        super();
        this.gameId = UnbalancedBigSmall1Id;
    }

    setGameId(gameId: number) {
        this.gameId = gameId;
        this.config = unbalancedBigSmallConfigs[gameId];
        this.renderTableGame(gameId);
    }

    config = new BigSmallConfigs();
    miniRoundHistory: BigSmallMiniRoundHistory;
    statistic: BigSmallDicesStatistic;
    readonly shakingDuration = 2;
    readonly showResultDuration = 1;

    initGameDataEvents() {
        super.initGameDataEvents();
        this.emitterListener(this.gameData.durations, Durations.Events.PLACING_BET, handlePlacingBet);
        this.emitterListener(this.gameData.durations, Durations.Events.BEGIN_PLACING_BET, showBgTimer);
        this.emitterListener(this.gameData.durations, Durations.Events.WAITING, handleShakeDish);
    }

    renderTableGame(gameId: number) {
        if (this.gameNameImage && this.tableGameBg) {
            this.gameNameImage.spriteFrame = this.mainAtlas.getSpriteFrame(`tablename-${gameId}`);
            this.tableGameBg.spriteFrame = this.mainAtlas.getSpriteFrame(`table${gameId}`);
        }
    }

    showSettlementResult(settlement: any) {
        cc.tween(this.bgTimer).to(0.3, { opacity: 0 }).start();
        this.setDices(settlement.result);

        if (this.currentDataLogs.length > 0) {
            cc.tween(this.thePlate)
                .call(() => {
                    this.showHideResult(true);
                    this.shakeThePlateAnimation.playAdditive(DishAnimation.OpenDish);
                })
                .delay(1)
                .call(() => {
                    this.gameData.settlement.finishShowResult();
                })
                .start();
        }
    }

    handleAfterSettlementResult(settlement: any) {
        super.handleAfterSettlementResult(settlement);
        this.updateRoundHistory();
        this.betItems.forEach((betItem) => betItem.setHighlight(settlement.settlementResult[betItem.node.name.toLowerCase()], true));
        this.showWinningAnimation(this.currentDataLogs[0]);
    }

    handleRoundHistory(roundHistory: any) {
        if (roundHistory && roundHistory[0] && roundHistory[0].result) {
            this.setDices(roundHistory[0].result);
        }
        this.updateRoundHistory();
    }

    initMiniRoundHistory(node: cc.Node) {
        this.miniRoundHistory = node.getComponent(BigSmallMiniRoundHistory);
    }

    initStatistic(node: cc.Node) {
        this.statistic = node.getComponent(BigSmallDicesStatistic);
        const condition = () => {
            return (
                this.currentTimeRemaining < this.config.stopBetTime ||
                this.currentTimeRemaining > this.config.fullTime - this.showResultDuration
            );
        };
        this.statistic.logView.init(condition);
    }

    onToggleStatisticChanged() {
        this.playClick();
        this.statistic.node.parent.active = !this.statistic.node.parent.active;
    }

    protected setDices(result) {
        const { dice1, dice2, dice3 } = result;
        this.dices[0].spriteFrame = this.diceAtlas.getSpriteFrame(`${dice1}-goc-2`);
        this.dices[1].spriteFrame = this.diceAtlas.getSpriteFrame(`${dice2}-goc-1`);
        this.dices[2].spriteFrame = this.diceAtlas.getSpriteFrame(`${dice3}-goc-1`);
        this.resultLabel.string = dice1 + dice2 + dice3;
    }

    protected updateRoundHistory() {
        this.miniRoundHistory.setData(this.currentDataLogs);
        this.statistic?.updateData(this.currentDataLogs);
    }

    showHideResult(show: boolean) {
        this.dices.forEach((dice) => {
            dice.node.active = show;
        });
    }

    shakeThePlate() {
        this.shakeThePlateAnimation.playAdditive(DishAnimation.ShakeDish);
        cc.tween(this.thePlate)
            .delay(0.2)
            .call(() => {
                this.showHideResult(false);
            })
            .delay(1)
            .call(() => {
                AudioManager.getInstance().playSFX(this.shakeDishAudio.clip);
            })
            .start();
    }

    protected showResult() {
        if (this.currentDataLogs.length > 0) {
            const { settlementResult } = this.currentDataLogs[0];

            cc.tween(this.thePlate)
                .call(() => {
                    this.showHideResult(true);
                    this.shakeThePlateAnimation.playAdditive(DishAnimation.OpenDish);
                })
                .delay(1)
                .call(() => {
                    this.updateRoundHistory();
                    this.betItems.forEach((betItem) => betItem.setHighlight(settlementResult[betItem.node.name.toLowerCase()], true));
                    this.showWinningAnimation(this.currentDataLogs[0]);
                })
                .start();
        }
    }

    protected showWinningAnimation(data: any) {
        this.resultNode.active = true;
        cc.tween(this.resultNode).to(0.2, { scale: 1.2 }, { easing: "bounceOut" }).to(0.3, { scale: 1, opacity: 255 }).start();
    }

    resetDataAndUI() {
        super.resetDataAndUI();
        this.resetThePlate();
        this.disableResultNode();
    }

    disableResultNode() {
        this.resultNode.active = false;
        this.resultNode.opacity = 0;
    }

    resetThePlate() {
        this.thePlate.position = cc.v3(0, 0);
        this.thePlate.opacity = 255;
        this.thePlate.active = true;
    }

    openHistory() {
        const dialog = cc.instantiate(this.historyPrefab);
        this.historyComponent = dialog.getComponent(MultiplayGameHistory);
        this.historyComponent.init(this.socket);
        this.currentMiniPanel.addDialog(dialog);
    }
}
