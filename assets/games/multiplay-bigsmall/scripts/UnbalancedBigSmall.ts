import { i18n } from "../../../ClientModules";
import AudioManager from "../../../common/audio/AudioManager";
import { RoundHistory } from "../../_base_new/models/RoundHistory";
import { Durations } from "../../_new/_base/game-data-management/models/durations";
import { DishAnimation } from "../../bigsmall/view-models/BigSmall";
import { BigSmallConfigs } from "../../bigsmall/view-models/BigSmallConfigs";
import BigSmallMiniRoundHistory from "../../bigsmall/view-models/BigSmallMiniRoundHistory";
import MultiplayGameSingle from "../../multiplay/scripts/MultiplayGameSingle";
import { handlePlacingBet, handleShakeDish, handleSubGameWaitingTime, showBgTimer } from "./actions/CustomActions";
import MultiplayGameHistory from "./MultiplayGameHistory";
import { tableGameColor, UnbalancedBigSmall1Id, unbalancedBigSmallConfigs } from "./UnbalancedBigSmallConfig";

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

    @property(cc.Node)
    tableGameBg: cc.Node = null;

    @property(cc.SpriteAtlas)
    mainAtlas: cc.SpriteAtlas = null;

    @property(cc.Node)
    timeShowResult: cc.Node = null;

    public isMiniGameInContainer = true;

    protected scaleResultNode = 1;

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
    readonly shakingDuration = 2;
    readonly showResultDuration = 1;

    initGameData() {
        super.initGameData();
        this.gameData.roundHistory.historySize = 102;
    }

    initGameDataEvents() {
        super.initGameDataEvents();
        this.emitterListener(this.gameData.durations, Durations.Events.PLACING_BET, handlePlacingBet);
        this.emitterListener(this.gameData.durations, Durations.Events.BEGIN_PLACING_BET, showBgTimer);
        this.emitterListener(this.gameData.durations, Durations.Events.WAITING, handleShakeDish);
        this.emitterListener(this.gameData.durations, Durations.Events.CHANGE_REMAINING_TIME, handleSubGameWaitingTime);
    }

    renderTableGame(gameId: number) {
        if (this.gameNameImage && this.tableGameBg) {
            this.gameNameImage.spriteFrame = this.mainAtlas.getSpriteFrame(`tablename-${gameId}`);
            this.tableGameBg.color = cc.Color.BLACK.fromHEX(tableGameColor[gameId]);
        }
    }

    showSettlementResult(settlement: any) {
        cc.tween(this.bgTimer).to(0.3, { opacity: 0 }).start();
        this.setDices(settlement.result, settlement.settlementResult);

        if (this.currentDataLogs.length > 0) {
            this.handleAnimResult();
        }
    }

    handleAnimResult() {
        cc.tween(this.thePlate)
            .call(() => {
                this.showDicesAndPlates();
                this.shakeThePlateAnimation.playAdditive(DishAnimation.OpenDish);
            })
            .delay(1)
            .call(() => {
                this.gameData.settlement.finishShowResult(this.gameData.settlement.settlement, true);
            })
            .start();
    }

    handleAfterSettlementResult(settlement: any, animated: boolean) {
        this.showWinChoiceAndUpdateHistory(settlement);
        this.highlightAndPayout(settlement);
        if (!animated) {
            this.showDicesAndPlates();
        }
    }

    showWinChoiceAndUpdateHistory(settlement: any) {
        this.gameData.roundHistory.update();
        this.showWaittingTime(true);
        this.updateRoundHistory();
        this.showWinningAnimation(this.currentDataLogs[0]);
        this.gameData.resultHash.updateUI();
        this.setDices(settlement.result, settlement.settlementResult);
    }

    highlightAndPayout(settlement: any) {
        this.betItems.forEach((betItem) => betItem.setHighlight(settlement.settlementResult[betItem.node.name.toLowerCase()], true));
        this.gameData.settlement.showStatus();
        this.thePlate.opacity = 0;
    }

    handleRoundHistory(roundHistory: any) {
        this.updateRoundHistory();
    }

    initMiniRoundHistory(node: cc.Node) {
        this.miniRoundHistory = node.getComponent(BigSmallMiniRoundHistory);
        this.miniRoundHistory.managedByParent = true;

        this.emitterListener(this.gameData.roundHistory, RoundHistory.Events.CHANGE, () => () => {
            this.miniRoundHistory.nextItemActive = false;
        });
        this.emitterListener(this.gameData.durations, Durations.Events.LOCKING_BET, () => () => {
            this.miniRoundHistory.nextItemActive = true;
        });
    }

    protected setDices(result, settlementResult) {
        const { dice1, dice2, dice3 } = result;
        const winChoice = Object.keys(settlementResult).find((choice) => settlementResult[choice]);
        const winChoiceString = i18n.t(`ui.choice_${winChoice}`);
        this.dices[0].spriteFrame = this.diceAtlas.getSpriteFrame(`${dice1}-goc-2`);
        this.dices[1].spriteFrame = this.diceAtlas.getSpriteFrame(`${dice2}-goc-1`);
        this.dices[2].spriteFrame = this.diceAtlas.getSpriteFrame(`${dice3}-goc-1`);
        this.resultLabel.string = `${dice1 + dice2 + dice3} - ` + winChoiceString.toUpperCase();
    }

    protected updateRoundHistory() {
        this.miniRoundHistory.setData(this.currentDataLogs);
    }

    setDicesVisibility(show: boolean) {
        this.dices.forEach((dice) => {
            dice.node.active = show;
        });
    }

    shakeThePlate() {
        this.showDicesAndPlates();
        this.shakeThePlateAnimation.playAdditive(DishAnimation.ShakeDish);
        cc.tween(this.thePlate)
            .delay(0.2)
            .call(() => {
                this.setDicesVisibility(false);
            })
            .delay(1)
            .call(() => {
                AudioManager.getInstance().playSFX(this.shakeDishAudio.clip);
            })
            .delay(1)
            .call(() => {
                this.hideDicesAndPlates();
            })

            .start();
    }

    hideDicesAndPlates() {
        this.shakeThePlateAnimation.node.opacity = 25.5;
    }

    showDicesAndPlates() {
        this.shakeThePlateAnimation.node.opacity = 255;
        this.setDicesVisibility(true);
    }

    protected showWinningAnimation(data: any) {
        this.resultNode.active = true;
        cc.tween(this.resultNode)
            .to(0.2, { scale: 1.2 }, { easing: "bounceOut" })
            .to(0.3, { scale: this.scaleResultNode, opacity: 255 })
            .start();
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
        const control = dialog.getComponent(MultiplayGameHistory);
        control.handleSocketFromGame(this.gameId);
        this.currentMiniPanel.addDialog(dialog);
    }

    highlightLastResult() {
        const dataLog = this.currentDataLogs[0];
        dataLog &&
            this.betItems.forEach((betItem) => {
                betItem.setHighlight(dataLog.settlementResult[betItem.node.name], false);
            });
    }

    timeAnimShowResult(show: boolean) {
        if (this.timeShowResult) {
            this.timeShowResult.active = show;
        }
    }
}
