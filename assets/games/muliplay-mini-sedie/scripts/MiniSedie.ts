import AudioManager from "../../../common/audio/AudioManager";
import MiniRoundHistory from "../../../common/mini-round-history/MiniRoundHistory";
import SedieRoundHistory from "../../../common/round-history/sedie/SedieRoundHistory";
import MD5Component from "../../_base/view-models/MD5Component";
import { RoundHistory } from "../../_base_new/models/RoundHistory";
import { Durations } from "../../_new/_base/game-data-management/models/durations";
import MultiplayGameSingle from "../../multiplay/scripts/MultiplayGameSingle";
import { handlePlacingBet, handleShakeDish } from "./actions/MegaSedieCustomActions";
import { MiniSedie1Id, miniSedieConfigs, tableGameColor } from "./MiniSedieConfigs";

const { ccclass, property } = cc._decorator;

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

    @property(cc.Prefab)
    miniRoundHistoryPrefab: cc.Prefab = null;

    @property(cc.Node)
    miniRoundHistoryContainer: cc.Node = null;

    @property(cc.Node)
    dishNode: cc.Node = null;

    @property(cc.AudioSource)
    shakeDishAudio: cc.AudioSource = null;

    @property(cc.Sprite)
    gameNameImage: cc.Sprite = null;

    @property(cc.Node)
    tableGameBg: cc.Node = null;

    @property(cc.SpriteAtlas)
    mainAtlas: cc.SpriteAtlas = null;

    @property(cc.Node)
    positionRandomDot: cc.Node = null;

    public statisticHistory: SedieRoundHistory = null;
    public miniRoundHistory: MiniRoundHistory = null;
    openPlateDuration = 0.5;
    openPlatePos = cc.v2(15, 30);
    startRoundDuration = 2;

    constructor() {
        super();
        this.gameId = MiniSedie1Id;
        this.mainGameId = MiniSedie1Id;
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

    setGameId(gameId: number) {
        this.gameId = gameId;
        this.config = miniSedieConfigs[gameId];
        this.renderTableGame(gameId);
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
        this.emitterListener(this.gameData.durations, Durations.Events.BEGIN_STARTING_ROUND, handleShakeDish);
        this.emitterListener(this.gameData.durations, Durations.Events.PLACING_BET, handlePlacingBet);
    }

    public highlightLastResult() {
        if (this.currentTimeRemaining <= this.config.stopBetTime) {
            return;
        }
        const dataLog = this.currentDataLogs[0];
        dataLog && this.highlightWonItems(dataLog.settlementResult, false);
    }

    public setDots(result) {
        const roundId = this.gameData.roundId !== undefined ? this.gameData.roundId : 1;
        const randomOption = this.positionRandomDot.children[roundId % 5];
        console.log("randomOption", roundId % 5);
        Object.keys(result).forEach((key, index) => {
            this.dots[index].node.position = randomOption.children[index].position;
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

        this.statisticHistory && this.statisticHistory.setData(miniHistoryData.map((d) => d.red));
        this.miniRoundHistory.setData(miniHistoryData);
    }

    shakeThePlate() {
        this.showDicesAndPlates();
        this.closePlate(true);
        this.tween(this.dishNode)
            .call(() => {
                this.showOriginalDish();
            })
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
    }

    disableGame() {
        super.disableGame();
        this.gameData.durations.stop();
    }

    handleRoundHistory() {
        this.updateRoundHistory();
    }

    showSettlementResult(settlement: any) {
        this.gameAudios && this.gameAudios.playEndGameAudio();
        if (cc.RedT.GAME_IS_SHOWED) {
            this.setDots(settlement.result);
            this.handleAnimResult();
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

    showOriginalDish() {
        this.animation.node.opacity = 255;
        this.animation.node.position = cc.v3(0, 18, 0);
        this.animation.node.scale = 1;
    }

    handleAnimResult() {
        this.tween(this.dishNode)
            .call(() => {
                this.showDicesAndPlates();
                this.openPlate(true);
            })
            .delay(this.showResultDuration)
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
            this.showDicesAndPlates();
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
        this.statisticHistory = node.getComponent(SedieRoundHistory);
        this.statisticHistory.logControl.managedByParent = true;
        this.emitterListener(this.gameData.roundHistory, RoundHistory.Events.CHANGE, () => () => {
            this.statisticHistory.logControl.nextItemActive = false;
        });
        this.emitterListener(this.gameData.durations, Durations.Events.LOCKING_BET, () => () => {
            this.statisticHistory.logControl.nextItemActive = true;
        });
    }

    initMD5String(node: cc.Node) {
        this.md5Component = node.getChildByName("md5-content").getComponent(MD5Component);
    }

    openPlate(animated: boolean) {
        const platePos = cc.v2(60, 120);
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

    checkCircleCountDown() {}
}
