import AudioManager from "../../../common/audio/AudioManager";
import { GameIds } from "../../../configs/SabaConfigs";
import MiniGameBase from "../../_base_new/view-models/MiniGameBase";
import { Durations } from "../../_new/_base/game-data-management/models/durations";
import { DishAnimation } from "../../bigsmall/view-models/BigSmall";
import { BigSmallConfigs } from "../../bigsmall/view-models/BigSmallConfigs";
import BigSmallDicesStatistic from "../../bigsmall/view-models/BigSmallDicesStatistic";
import BigSmallMiniRoundHistory from "../../bigsmall/view-models/BigSmallMiniRoundHistory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UnbalancedBigSmall extends MiniGameBase {
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

    constructor() {
        super();
        this.gameId = GameIds.UnbalancedBigSmall1;
    }

    config = new BigSmallConfigs();
    miniRoundHistory: BigSmallMiniRoundHistory;
    statistic: BigSmallDicesStatistic;

    initGameDataEvents() {
        super.initGameDataEvents();
        this.gameData.durations.on(Durations.Events.PLACING_BET, () => {
            this.bgTimer.opacity = 255;
            this.betItems.forEach((item) => item.resetHighlight());
            this.resetThePlate();
            this.disableResultNode();
        });
        this.gameData.durations.on(Durations.Events.BEGIN_PLACING_BET, () => {
            cc.tween(this.bgTimer).to(0.3, { opacity: 255 }).start();
        });
        this.gameData.durations.on(Durations.Events.WAITING, ({ globalRemaining }) => {
            const shakingDuration = 1;
            const shakeTimePoint = this.config.betTime + shakingDuration;
            if (globalRemaining === shakeTimePoint) {
                this.resetDataAndUI();
                this.shakeThePlate();
            }
        });
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
    }

    handleShowStatistic(show: boolean) {
        this.statistic.node.parent.active = show;
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
        this.statistic.init(this.currentDataLogs, this);
    }

    showHideResult(show: boolean) {
        this.dices.forEach((dice) => {
            dice.node.active = show;
        });
    }

    protected shakeThePlate() {
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
}
