import AudioManager from "../../../common/audio/AudioManager";
import EffectAppearanceLabel from "../../../common/EffectAppearanceLabel";
import MiniRoundHistory from "../../../common/mini-round-history/MiniRoundHistory";
import SedieRoundHistory from "../../../common/round-history/sedie/SedieRoundHistory";
import MD5Component from "../../_base/view-models/MD5Component";
import { RoundHistory } from "../../_base_new/models/RoundHistory";
import { Durations } from "../../_new/_base/game-data-management/models/durations";
import MultiplayGameSingle from "../../multiplay/scripts/MultiplayGameSingle";
import { handlePlacingBet, handleShakeDish, handleSubGameWaitingTime } from "./actions/MegaSedieCustomActions";
import { miniSedieConfigs, tableGameColor } from "./MiniSedieConfigs";

const { ccclass, property } = cc._decorator;

export const MiniSedieId = 9;

export const KeyOpenScoreBoardStorage = "multiSedieIsShowScoreboard";

@ccclass
export default class MiniSedie extends MultiplayGameSingle {
    @property({ type: cc.Sprite })
    dots: cc.Sprite[] = [];

    @property(cc.SpriteFrame)
    dotRed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    dotWhite: cc.SpriteFrame = null;

    @property(cc.Animation)
    animation: cc.Animation = null;

    @property(cc.Prefab)
    roundHistoryPrefab: cc.Prefab = null;

    @property(cc.Node)
    roundHistoryContainer: cc.Node = null;

    @property(cc.Prefab)
    miniRoundHistoryPrefab: cc.Prefab = null;

    @property(cc.Node)
    miniRoundHistoryContainer: cc.Node = null;

    @property(cc.Node)
    dishNode: cc.Node = null;

    @property(cc.AudioSource)
    shakeDishAudio: cc.AudioSource = null;

    @property(cc.Node)
    timeShowResult: cc.Node = null;

    @property(cc.Sprite)
    gameNameImage: cc.Sprite = null;

    @property(cc.Node)
    tableGameBg: cc.Node = null;

    @property(cc.SpriteAtlas)
    mainAtlas: cc.SpriteAtlas = null;

    public roundHistory: SedieRoundHistory = null;
    public miniRoundHistory: MiniRoundHistory = null;
    openPlateDuration = 0.5;
    openPlatePos = cc.v2(15, 30);
    private showLogs = true;
    protected startRoundDuration = 1;
    readonly shakingDuration = 2;
    readonly showResultDuration = 2;

    constructor() {
        super();
        this.gameId = MiniSedieId;
    }

    onGameHide() {
        super.onGameHide();
        this.setBlurDishAndHideDices();
    }

    onGameShow() {
        super.onGameShow();
        this.setBlurDishAndHideDices();
    }

    onLoad() {
        super.onLoad();
        this.animatedTime.setAnimatedY(30, -5);
    }

    onEnable() {
        super.onEnable();
        const isShow = cc.sys.localStorage.getItem(KeyOpenScoreBoardStorage);
        this.showLogs = isShow === "false" ? false : true;
        this.showRoundHistory(this.showLogs);
    }

    setGameId(gameId: number) {
        this.gameId = gameId;
        this.config = miniSedieConfigs[gameId];
        this.renderTableGame(gameId);
    }

    initGameData() {
        super.initGameData();
        this.gameData.durations.addEvent(
            Durations.Events.SHOW_ANIMATION,
            {
                startTimePoint: this.config.fullTime,
                endTimePoint: this.config.fullTime - this.showResultDuration
            },
            null,
            Durations.Events.WAITING
        );

        this.gameData.durations.addEvent(
            Durations.Events.STARTING_ROUND,
            {
                startTimePoint: this.config.betTime + this.shakingDuration,
                endTimePoint: this.config.betTime
            },
            Durations.Events.WAITING,
            Durations.Events.PLACING_BET
        );

        this.gameData.roundHistory.historySize = 100;
    }

    renderTableGame(gameId: number) {
        if (this.gameNameImage && this.tableGameBg) {
            this.gameNameImage.spriteFrame = this.mainAtlas.getSpriteFrame(`game-name-${window.i18n.curLang}-${gameId}`);
            this.tableGameBg.color = cc.Color.BLACK.fromHEX(tableGameColor[gameId]);
            this.gameId = gameId;
        }
    }

    initGameDataEvents() {
        super.initGameDataEvents();
        this.emitterListener(this.gameData.durations, Durations.Events.PLACING_BET, handlePlacingBet);
        this.emitterListener(this.gameData.durations, Durations.Events.BEGIN_STARTING_ROUND, handleShakeDish);
        this.emitterListener(this.gameData.durations, Durations.Events.CHANGE_REMAINING_TIME, handleSubGameWaitingTime);
    }

    public highlightLastResult() {
        if (this.currentTimeRemaining <= this.config.stopBetTime) {
            return;
        }
        const dataLog = this.currentDataLogs[0];
        dataLog && this.highlightWonItems(dataLog.settlementResult, false);
    }

    public setDots(result) {
        Object.keys(result).forEach((key, index) => {
            this.dots[index].spriteFrame = result[key] ? this.dotRed : this.dotWhite;
        });
    }

    private highlightWonItems(settlementResult: any, isAnimated = true) {
        this.betItems.forEach((betItem) => {
            betItem.setHighlight(settlementResult[betItem.node.name], isAnimated);
        });
    }

    public updateRoundHistory() {
        const miniHistoryData = this.currentDataLogs.map((d) => {
            let count = 0;
            const list = ["red1", "red2", "red3", "red4"];
            list.forEach((i) => {
                if (d.result[i]) {
                    count++;
                }
            });
            return {
                roundId: d.roundId || d.id,
                red: count
            };
        });

        this.roundHistory && this.roundHistory.setData(miniHistoryData.map((d) => d.red));
        this.miniRoundHistory.setData(miniHistoryData);
    }

    public onToggleShowRoundResult() {
        this.showLogs = !this.showLogs;
        this.showRoundHistory(this.showLogs);
        cc.sys.localStorage.setItem(KeyOpenScoreBoardStorage, this.showLogs);
    }

    public showRoundHistory(show: boolean) {
        this.roundHistoryContainer && (this.roundHistoryContainer.active = show);
    }

    shakeThePlate() {
        this.showDicesAndPlates();
        this.closePlate(true);
        this.tween(this.dishNode)
            .delay(0.5)
            .call(() => {
                this.shakeDishAudio && AudioManager.getInstance().playSFX(this.shakeDishAudio.clip);
                this.animation.play();
            })
            .delay(1.5)
            .call(() => {
                this.setBlurDishAndHideDices();
            })
            .start();
    }

    resetDataAndUI() {
        super.resetDataAndUI();
        //this.closePlate(false);
    }

    handleRoundHistory() {
        this.updateRoundHistory();
    }

    showSettlementResult(settlement: any) {
        if (cc.RedT.GAME_IS_SHOWED) {
            this.setDots(settlement.result);

            if (this.currentDataLogs.length > 0) {
                this.handleAnimResult();
            }
        }
    }

    setBlurDishAndHideDices() {
        this.animation.node.opacity = 255;
        this.setDotsVisibility(false);
    }

    showDicesAndPlates() {
        this.animation.node.opacity = 255;
        this.setDotsVisibility(true);
    }

    handleAnimResult() {
        this.tween(this.dishNode)
            .call(() => {
                this.showDicesAndPlates();
                this.openPlate(true);
            })
            .delay(1.7)
            .call(() => {
                this.gameData.settlement.finishShowResult(this.gameData.settlement.settlement, true);
            })
            .start();
    }

    handleAfterSettlementResult(settlement: any, animated: boolean) {
        this.showWinChoiceAndUpdateHistory(settlement);
        this.scheduleOnce(() => {
            this.highlightAndPayout(settlement);
        }, 1);

        if (!animated) {
            this.dishNode.opacity = 0;
            this.animation.node.opacity = 255;
            this.setDotsVisibility(true);
        }
    }

    setDotsVisibility(show: boolean) {
        this.dots.forEach((dice) => {
            dice.node.active = show;
        });
    }

    showWinChoiceAndUpdateHistory(settlement: any) {
        this.gameData.roundHistory.update();
        this.showWaittingTime(true);
        this.updateRoundHistory();
        this.gameData.resultHash.updateUI();
        this.setDots(settlement.result);
    }

    highlightAndPayout(settlement: any) {
        this.betItems.forEach((betItem) => betItem.setHighlight(settlement.settlementResult[betItem.node.name.toLowerCase()], true));
        this.gameData.settlement.showStatus();
    }

    timeAnimShowResult(show: boolean) {
        if (this.timeShowResult) {
            this.timeShowResult.active = show;
        }
    }

    initMiniRoundHistory(node: cc.Node) {
        this.miniRoundHistory = node.getComponent(MiniRoundHistory);
        this.miniRoundHistory.managedByParent = true;

        this.emitterListener(this.gameData.roundHistory, RoundHistory.Events.CHANGE, () => () => {
            this.miniRoundHistory.nextItemActive = false;
        });
        this.emitterListener(this.gameData.durations, Durations.Events.LOCKING_BET, () => () => {
            this.miniRoundHistory.nextItemActive = true;
        });
    }

    initRoundHistory(node: cc.Node) {
        this.roundHistory = node.getComponent(SedieRoundHistory);
        this.roundHistory.logControl.managedByParent = true;
        this.emitterListener(this.gameData.roundHistory, RoundHistory.Events.CHANGE, () => () => {
            this.roundHistory.logControl.nextItemActive = false;
        });
        this.emitterListener(this.gameData.durations, Durations.Events.LOCKING_BET, () => () => {
            this.roundHistory.logControl.nextItemActive = true;
        });
    }

    initMD5String(node: cc.Node) {
        this.md5Component = node.getChildByName("md5-content").getComponent(MD5Component);
    }

    openPlate(animated: boolean) {
        const platePos = cc.v2(50, 100);
        if (animated) {
            cc.tween(this.dishNode)
                .to(1, { position: this.openPlatePos }, { easing: "sineInOut" })
                .to(this.openPlateDuration, { position: platePos }, { easing: "sineInOut" })
                .to(0.2, { opacity: 0 })
                .start();
        } else {
            this.dishNode.position = cc.v3(platePos);
            this.dishNode.opacity = 0;
        }
    }

    closePlate(animated = true) {
        if (animated) {
            const platePos = cc.v2(50, 100);
            this.dishNode.position = cc.v3(platePos);
            cc.tween(this.dishNode)
                .to(0, { opacity: 255 })
                .to(0.5, { position: cc.v2(0, 1.5) })
                .start();
        } else {
            this.dishNode.opacity = 255;
            this.dishNode.position = cc.v3(0, 1.5);
        }
    }

    setGameRound(gameRoundId) {
        if (!this.gameRound || gameRoundId < 0) {
            return;
        }

        const gameRound = this.formatGameRound(gameRoundId);
        const typingLabel = this.gameRound.node.parent.getComponent(EffectAppearanceLabel);
        if (typingLabel) {
            typingLabel.string = gameRound;
        } else {
            this.gameRound.string = gameRound;
        }
    }

    checkCircleCountDown() {}
}
