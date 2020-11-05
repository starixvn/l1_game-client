import * as _ from "lodash";

import GameUtils from "../../../common/GameUtils";
import * as helper from "../../../common/helpers/Helper";
import { games } from "../../../SabaConfigs";
import GameRoomBase from "../../_base/GameRoomBase";
import BottomControls from "./BottomControls";
import RouletteBetHandler from "./handlers/RouletteBetHandler";
import RouletteFinishHandler from "./handlers/RouletteFinishHandler";
import RouletteLogsHandler from "./handlers/RouletteLogsHandler";
import RouletteTimeHandler from "./handlers/RouletteTimeHandler";
import LeftControls from "./LeftControls";
import { RouletteConfigs } from "./RouletteConfigs";
import RouletteMain from "./RouletteMain";
import RouletteMiniRoundResult from "./RouletteMiniRoundResult";
import RouletteUtils from "./RouletteUtils";
import TopControls from "./TopControls";

const { ccclass, property } = cc._decorator;

export interface RouletteBetInfo {
    type: string;
    numbers: number[];
}

export enum RouletteBetType {
    StraightUp = "straightUp",
    Split = "split",
    Street = "street",
    Triangle = "triangle",
    Corner = "corner",
    FourNumbers = "fourNumbers",
    Line = "line",
    Column = "column",
    Dozen = "dozen",
    RedBlack = "redBlack",
    OddEven = "oddEven",
    BigSmall = "bigSmall"
}

@ccclass
export default class Roulette extends GameRoomBase {
    @property(cc.Node)
    mainContainer: cc.Node = null;

    @property(RouletteMiniRoundResult)
    miniRoundResult: RouletteMiniRoundResult = null;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    guidePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    statisticPrefab: cc.Prefab = null;

    @property(cc.Label)
    totalBetLabel: cc.Label = null;

    @property(cc.Label)
    tempBetLabel: cc.Label = null;

    @property(cc.Node)
    topContainer: cc.Node = null;

    @property(cc.Node)
    bottomContainer: cc.Node = null;

    @property(cc.Node)
    leftContainer: cc.Node = null;

    @property(cc.Node)
    roundIdContainer: cc.Node = null;

    topControls: TopControls = null;
    bottomControls: BottomControls = null;
    leftControls: LeftControls = null;

    doubleButton: cc.Button = null;
    rebetButton: cc.Button = null;
    undoButton: cc.Button = null;
    clearButton: cc.Button = null;
    confirmButton: cc.Button = null;
    confirmGlow: cc.Node = null;

    rouletteMain: RouletteMain;

    tempBetChoices: any = {};
    currentBetChoices: any = {};
    previousRoundBetChoices: any = {};
    betChoicesStack = [];
    isPlacingChip = false;

    constructor() {
        super();
        this.init("roulette", new RouletteConfigs(), null, 1, games.Roulette.id);
    }

    initHandlers() {
        super.initHandlers();

        this.finishHandler = new RouletteFinishHandler(this);
        this.logsHandler = new RouletteLogsHandler(this);
        this.timeHandler = new RouletteTimeHandler(this);
        this.betHandler = new RouletteBetHandler(this);
        // this.timeHandler = new KenoTimeHandler(this);
    }

    start() {
        // dont send until loading resoures done
        // cc.RedT.send({ scene: this.gameName, g: { [this.gameName]: { ingame: true } } });
    }


    onEnable() {
        // this.startGame();
        // this.registerViewGame();
    }

    onLoad() {
        this.roundIdContainer.opacity = 0;
        this.initMain().then(() => {
            this.initBetBoard();
            super.onLoad();
            this.currentMiniPanel.miniMenu.position = this.currentMiniPanel.miniMenu.convertToNodeSpaceAR(this.rouletteMain.newMenuPosition.convertToWorldSpaceAR(cc.v2(0, 0)));
            this.updateTotalBetLabel();
            this.updateBetStatus(true);
            this.schedule(this.updateBetStatus, 0.3, cc.macro.REPEAT_FOREVER, 1);

            this.startGame();
            this.registerViewGame();
            cc.RedT.send({ scene: this.gameName, g: { [this.gameName]: { ingame: true } } });
        });


    }

    setGameRound(gameRoundId) {
        super.setGameRound(gameRoundId);
        this.roundIdContainer.opacity = 255;
    }

    onDestroy() {
        super.onDestroy();
        this.unschedule(this.updateBetStatus);
    }

    updateBetStatus(forceUpdate = false) {
        if (this.currentTimeRemaining > this.config.betTime || !forceUpdate) {
            return;
        }

        const tempLength = Object.keys(this.tempBetChoices).length;
        const currentLength = Object.keys(this.currentBetChoices).length;
        const previosRoundLength = Object.keys(this.previousRoundBetChoices).length;

        this.rebetButton.node.active = tempLength === 0 && currentLength === 0 && previosRoundLength > 0;
        this.rebetButton.interactable = this.currentTimeRemaining > this.config.stopBetTime;
        this.doubleButton.node.active = !this.rebetButton.node.active;

        this.clearButton.interactable = tempLength > 0;
        this.doubleButton.interactable = tempLength > 0;
        this.undoButton.interactable = tempLength > 0;
        if (this.confirmButton.interactable != tempLength > 0) {
            this.confirmButton.node.parent.stopAllActions();
            this.confirmGlow.active = false;
            this.confirmButton.node.scale = 1;
            if (!this.confirmButton.interactable) {
                cc.tween(this.confirmButton.node.parent)
                    .repeatForever(
                        cc.tween()
                            .to(0.15, { scale: 0.9 })
                            .to(0.1, { scale: 1 })
                            .to(0.1, { scale: 0.9 })
                            .to(0.1, { scale: 1 })
                            .delay(1))
                    .start();

                this.confirmGlow.active = true;
            }
        }
        this.confirmButton.interactable = tempLength > 0;

        //update disable frame
        this.clearButton.node.children[1].active = !this.clearButton.interactable;
        this.doubleButton.node.children[1].active = !this.doubleButton.interactable;
        this.confirmButton.node.children[1].active = !this.confirmButton.interactable;
        this.undoButton.node.children[1].active = !this.undoButton.interactable;
        this.rebetButton.node.children[1].active = !this.rebetButton.interactable;
    }

    resetDataAndUI() {
        super.resetDataAndUI();
    }

    async initMain() {
        const node = await this.loadResource('RouletteMain', this.mainContainer);
        this.rouletteMain = node.getComponent(RouletteMain);
        this.timeWaitLabel = this.rouletteMain.timeWaitLabel;
        this.timeWaitNode = this.rouletteMain.timeWaitNode;
        this.animatedTime = this.rouletteMain.animatedTime;

        const bottomControlsNode = await this.loadResource('BottomControls', this.bottomContainer);
        this.bottomControls = bottomControlsNode.getComponent(BottomControls);
        this.bottomControls.doubleButton.node.on('click', this.onPressedDouble, this);
        this.bottomControls.clearButton.node.on('click', this.onPressedClear, this);
        this.bottomControls.rebetButton.node.on('click', this.onPressedRebet, this);
        this.bottomControls.confirmButton.node.on('click', this.onPressedConfirm, this);
        this.bottomControls.undoButton.node.on('click', this.onPressedUndo, this);

        this.userName = this.bottomControls.userName;
        this.userBalance = this.bottomControls.userBalance;
        this.userAvatar = this.bottomControls.userAvatar;
        this.betChipsContainer = this.bottomControls.betChipsContainer;
        this.doubleButton = this.bottomControls.doubleButton;
        this.clearButton = this.bottomControls.clearButton;
        this.rebetButton = this.bottomControls.rebetButton;
        this.confirmButton = this.bottomControls.confirmButton;
        this.confirmGlow = this.bottomControls.confirmGlow;
        this.undoButton = this.bottomControls.undoButton;

        const topControlsNode = await this.loadResource('TopControls', this.topContainer);
        this.topControls = topControlsNode.getComponent(TopControls);
        this.players = this.topControls.players;
        this.otherPlayers = this.topControls.otherPlayers;

        const leftControlsNode = await this.loadResource('LeftControls', this.leftContainer);
        this.leftControls = leftControlsNode.getComponent(LeftControls);
        this.leftControls.guideButton.on('click', this.pressedShowGuide, this);
        this.leftControls.historyButton.on('click', this.pressedShowHistory, this);
        this.leftControls.statisticButton.on('click', this.pressedShowStatistic, this);
        this.leftControls.homeButton.on('click', this.onCloseGameClick, this);
    }

    async loadResource(name: string, container: cc.Node) {
        const suffix = cc.sys.isMobile ? `_mobile` : ``;
        const path = `games/roulette/${name}${suffix}`;
        const prefab = await GameUtils.loadResource(path);
        const node = cc.instantiate(prefab);
        container.addChild(node);
        return node;
    }

    initBetBoard() {
        const chipFlyingDuration = 0.3;
        this.rouletteMain.board.callback.selected = (betInfo: RouletteBetInfo) => {
            if (this.isDisablePlaceChip()) {
                return;
            }
            this.isPlacingChip = true;

            if (!this.checkAvailableBalance(this.currentBet)) {
                this.isPlacingChip = false;
                return;
            }

            const key = RouletteUtils.getKey(betInfo);
            const betChoices = {};
            betChoices[betInfo.type] = {};
            betChoices[betInfo.type][key] = this.currentBet;

            if (!this.checkAvailableBetChoices(betChoices)) {
                this.isPlacingChip = false;
                return;
            }

            const destNode = this.rouletteMain.board.getBetNodeByKey(betInfo.type, RouletteUtils.getKey(betInfo));
            const chipNode = RouletteUtils.createChip(this.currentBet, this.betChips.chipAltas);

            this.addBetChoice(betInfo, this.currentBet);
            this.addToBetChoicesStack(betChoices);
            this.betChips.moveChipWithCallback(chipNode, this.currentBet, destNode, null, () => {
                this.rouletteMain.board.addBetChoice(betInfo, this.currentBet);
                this.isPlacingChip = false;
            }, 0, chipFlyingDuration);
        }

        this.rouletteMain.quickBet.callback.getCurrentBet = () => this.currentBet;
        this.rouletteMain.quickBet.callback.selected = (betChoices: any) => {
            if (this.isDisablePlaceChip()) {
                return;
            }
            this.isPlacingChip = true;

            // this.rouletteMain.switchToRegularBet();

            const sum = this.sumValueBetChoices(betChoices);
            if (!this.checkAvailableBalance(sum)) {
                this.isPlacingChip = false;
                return;
            }

            if (!this.checkAvailableBetChoices(betChoices)) {
                this.isPlacingChip = false;
                return;
            }

            for (let type in betChoices) {
                for (let key in betChoices[type]) {
                    const betInfo = { type: type, numbers: RouletteUtils.parseKeyToNumbers(key) };
                    const bet = betChoices[type][key];
                    const destNode = this.rouletteMain.board.getBetNodeByKey(betInfo.type, key);
                    const chipNode = RouletteUtils.createChips(bet, this.betChips.chipAltas);

                    this.addBetChoice(betInfo, bet);
                    this.betChips.moveChipWithCallback(chipNode, bet, destNode, null, () => {
                        this.rouletteMain.board.addBetChoice(betInfo, bet);
                        this.isPlacingChip = false;
                    }, 0, chipFlyingDuration);
                }
            }
            this.addToBetChoicesStack(betChoices);
        }
    }

    clearTempBetChoices() {
        this.tempBetChoices = {};
        this.betChoicesStack = [];
        this.isPlacingChip = false;
        this.rouletteMain.board.showBetChoices(this.currentBetChoices, this.currentBetChoices);

        this.updateTotalBetLabel();
        // this.rouletteMain.board.hideBetDetailTips();
        this.rouletteMain.board.showBetDetailTips();
        this.rouletteMain.board.clearHighlight();
    }

    clearCurrentBetChoices() {
        this.currentBetChoices = {};
        this.rouletteMain.board.showBetChoices(this.currentBetChoices, this.currentBetChoices);
        this.rouletteMain.board.showBetDetailTips();
        // this.rouletteMain.board.hideBetDetailTips();
    }

    checkAvailableBalance(bet: number): boolean {
        const total = this.sumValueBetChoices(this.tempBetChoices);
        const available = total + bet <= cc.RedT.user.red;

        !available && this.showMiniWarning("Bạn hiện không có đủ tiền để cược.");
        return available;
    }

    sumValueBetChoices(totalChoices: any) {
        let total = 0;
        for (let type in totalChoices) {
            for (let key in totalChoices[type]) {
                total += totalChoices[type][key];
            }
        }
        return total;
    }

    checkAvailableBetChoices(betChoices): boolean {
        let totalChoices = {};
        totalChoices = this.mergeBetChoices(totalChoices, this.currentBetChoices);
        totalChoices = this.mergeBetChoices(totalChoices, this.tempBetChoices);

        const isMultiChoices = Object.keys(betChoices).length > 1 || Object.keys(betChoices[Object.keys(betChoices)[0]]).length > 1;

        for (let type in betChoices) {
            for (let key in betChoices[type]) {
                if (betChoices[type][key] > this.gameConfigs.choices_maxbet[type]) {
                    this.showMiniWarning(isMultiChoices ? "Tiền cược của một trong các cửa vượt mức quy định." : `Tiền cược tối đa ở cửa này là ${helper.numberWithCommas(this.gameConfigs.choices_maxbet[type])}`);
                    return false;
                }
                if (totalChoices[type] && totalChoices[type][key]) {
                    const total = totalChoices[type][key] + betChoices[type][key];
                    if (total > this.gameConfigs.choices_maxbet[type]) {
                        this.showMiniWarning(isMultiChoices ? "Tiền cược của một trong các cửa vượt mức quy định." : `Tiền cược tối đa ở cửa này là ${helper.numberWithCommas(this.gameConfigs.choices_maxbet[type])}`);
                        return false;
                    }
                }
            }
        }

        const currentTotal = this.sumValueBetChoices(totalChoices);
        const newTotal = this.sumValueBetChoices(betChoices);
        if (currentTotal + newTotal > this.gameConfigs.maxbet) {
            this.showMiniWarning(`Tổng tiền cược tối đa ở phiên này là ${helper.numberWithCommas(this.gameConfigs.maxbet)}`);
            return false;
        }

        return true;
    }

    isDisablePlaceChip(): boolean {
        if (this.isDisableGame || this.isPlacingChip) {
            return true;
        }

        if (this.waitingProcessing) {
            this.showProcessingWarning(true);
            return true;
        }

        if (this.currentTimeRemaining < this.config.stopBetTime || this.currentTimeRemaining > this.config.betTime - 1) {
            this.showMiniWarning("Vui lòng đặt cược ở phiên sau.");
            return true;
        }

        return false;
    }

    addBetChoice(betInfo: RouletteBetInfo, bet: number) {
        const key = RouletteUtils.getKey(betInfo);
        if (!this.tempBetChoices[betInfo.type]) {
            this.tempBetChoices[betInfo.type] = {};
        }
        const current = this.tempBetChoices[betInfo.type][key] || 0;
        this.tempBetChoices[betInfo.type][key] = current + bet;

        this.updateTotalBetLabel();
    }

    showWheelResult(result: number, onComplete: () => void) {
        this.rouletteMain.showRoulette(result, onComplete);
    }

    updateMiniRoundResult(animated = false) {
        const data = this.currentDataLogs.map(log => log.result);
        this.miniRoundResult.setData(data, animated);
        if (this.currentTimeRemaining > this.config.stopBetTime) {
            this.rouletteMain.highlightLastResult(data[0], animated);
        }
    }

    playClick() {
        cc.RedT.isSoundGame() && cc.RedT.audio.playClick();
    }

    addToBetChoicesStack(betChoices: any) {
        this.betChoicesStack.push(betChoices);
    }

    onPressedDouble() {
        this.playClick();
        if (this.isDisablePlaceChip()) {
            return;
        }

        const temp = _.cloneDeep(this.tempBetChoices);
        const sum = this.sumValueBetChoices(temp);
        if (!this.checkAvailableBalance(sum)) {
            return;
        }

        if (!this.checkAvailableBetChoices(temp)) {
            return;
        }

        this.addToBetChoicesStack(temp);
        this.tempBetChoices = this.mergeBetChoices(this.tempBetChoices, temp);
        this.updateBetChoicesOnBoard();
    }

    mergeBetChoices(betChoices1: any, betChoices2: any): any {
        const total = _.cloneDeep(betChoices1);
        for (let type in betChoices2) {
            for (let key in betChoices2[type]) {
                if (total[type]) {
                    if (total[type][key]) {
                        total[type][key] += betChoices2[type][key];
                    } else {
                        total[type][key] = betChoices2[type][key];
                    }
                } else {
                    total[type] = {};
                    total[type][key] = betChoices2[type][key];
                }
            }
        }
        return total;
    }

    subtractBetChoices(betChoices1: any, betChoices2: any): any {
        const result = _.cloneDeep(betChoices1);
        for (let type in betChoices2) {
            for (let key in betChoices2[type]) {
                if (result[type]) {
                    if (result[type][key]) {
                        result[type][key] -= betChoices2[type][key];
                        if (result[type][key] === 0) {
                            delete result[type][key];
                        }
                    }
                }
            }

            if (Object.keys(result[type]).length === 0) {
                delete result[type];
            }
        }
        return result;
    }

    getCurrentTotalBetChoices(): any {
        let totalBetChoices = {};
        totalBetChoices = this.mergeBetChoices(totalBetChoices, this.tempBetChoices);
        totalBetChoices = this.mergeBetChoices(totalBetChoices, this.currentBetChoices);
        return totalBetChoices;
    }

    updateBetChoicesOnBoard() {
        const totalBetChoices = this.getCurrentTotalBetChoices();
        this.rouletteMain.board.showBetChoices(totalBetChoices, this.currentBetChoices);
        this.rouletteMain.board.showBetDetailTips();
        this.updateTotalBetLabel();
    }

    updateTotalBetLabel() {
        const totalBetChoices = this.currentBetChoices;// this.getCurrentTotalBetChoices();
        const total = this.sumValueBetChoices(totalBetChoices);
        const newTotal = helper.numberWithCommas(total);
        if (newTotal !== this.totalBetLabel.string) {
            this.totalBetLabel.string = newTotal;
            this.totalBetLabel.node.runAction(cc.repeat(cc.sequence(
                cc.scaleTo(0.15, 1.2),
                cc.scaleTo(0.15, 1.0)
            ), 2));
        }

        const tempValue = this.sumValueBetChoices(this.tempBetChoices);
        const newTempValue = helper.numberWithCommas(tempValue);
        if (this.tempBetLabel.string !== newTempValue) {
            this.tempBetLabel.string = newTempValue;
            this.tempBetLabel.node.runAction(cc.repeat(cc.sequence(
                cc.scaleTo(0.15, 1.2),
                cc.scaleTo(0.15, 1.0)
            ), 2));
        }
    }

    onPressedUndo() {
        this.playClick();

        if (this.betChoicesStack.length === 0) {
            return;
        }

        const lastBetChoices = this.betChoicesStack.pop();
        this.tempBetChoices = this.subtractBetChoices(this.tempBetChoices, lastBetChoices);

        this.updateBetChoicesOnBoard();
    }

    onPressedClear() {
        this.playClick();
        this.clearTempBetChoices();
    }

    onPressedRebet() {
        this.playClick();

        if (this.isDisablePlaceChip()) {
            return;
        }

        this.tempBetChoices = _.cloneDeep(this.previousRoundBetChoices);
        this.addToBetChoicesStack(this.tempBetChoices);
        this.updateBetChoicesOnBoard();
    }

    onPressedConfirm() {
        this.playClick();
        if (this.isEmptyBetChoices()) {
            return;
        }
        if (this.waitingProcessing) {
            this.showProcessingWarning(true);
            return;
        }

        this.waitingProcessing = true;
        this.sendData({
            bet: {
                roundId: this.roundId,
                betChoices: this.tempBetChoices
            }
        });
    }

    isEmptyBetChoices(): boolean {
        return Object.keys(this.tempBetChoices).length === 0;
    }

    public pressedShowGuide() {
        this.playClick();
        let dialog = cc.instantiate(this.guidePrefab);
        var rouletteGuide = dialog.getComponent("RouletteGuide");
        rouletteGuide.init(this.gameConfigs);
        this.currentMiniPanel.node.addChild(dialog);
    }

    public pressedShowStatistic() {
        this.playClick();
        let dialog = cc.instantiate(this.statisticPrefab);
        this.currentMiniPanel.node.addChild(dialog);
    }

    public pressedShowHistory() {
        this.playClick();
        let dialog = cc.instantiate(this.historyPrefab);
        this.currentMiniPanel.node.addChild(dialog);
    }

    protected formatGameRound(gameRoundId: any) {
        return gameRoundId ? `#${gameRoundId}` : "";
    }
}
