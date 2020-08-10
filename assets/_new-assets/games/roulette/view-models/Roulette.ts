import GameRoomBase from "../../_base/GameRoomBase";
import { RouletteConfigs } from "./RouletteConfigs";
import RouletteMain from "./RouletteMain";
import RouletteFinishHandler from "./handlers/RouletteFinishHandler";
import RouletteLogsHandler from "./handlers/RouletteLogsHandler";
import RouletteMiniRoundResult from "./RouletteMiniRoundResult";
import RouletteUtils from "./RouletteUtils";
import RouletteTimeHandler from "./handlers/RouletteTimeHandler";
import RouletteBetHandler from "./handlers/RouletteBetHandler";
import * as _ from "lodash";

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

    @property(cc.Prefab)
    mainPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    mobileMainPrefab: cc.Prefab = null;

    @property(RouletteMiniRoundResult)
    miniRoundResult: RouletteMiniRoundResult = null;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    guidePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    statisticPrefab: cc.Prefab = null;

    @property(cc.Node)
    expandedMenuNode: cc.Node = null;

    rouletteMain: RouletteMain;

    tempBetChoices: any = {};
    currentBetChoices: any = {};
    previousRoundBetChoices: any = {};

    betChoicesStack = [];

    constructor() {
        super();
        this.init("roulette", new RouletteConfigs());
    }

    initHandlers() {
        super.initHandlers();

        this.finishHandler = new RouletteFinishHandler(this);
        this.logsHandler = new RouletteLogsHandler(this);
        this.timeHandler = new RouletteTimeHandler(this);
        this.betHandler = new RouletteBetHandler(this);
        // this.timeHandler = new KenoTimeHandler(this);
    }

    onLoad() {
        this.initMain();
        this.initBetBoard();
        super.onLoad();
    }

    resetDataAndUI() {
        super.resetDataAndUI();

    }

    initMain() {
        const node = cc.instantiate(cc.sys.isMobile ? this.mobileMainPrefab : this.mainPrefab);
        this.mainContainer.addChild(node);
        this.rouletteMain = node.getComponent(RouletteMain);
        this.timeWaitLabel = this.rouletteMain.timeWaitLabel;
        this.timeWaitNode = this.rouletteMain.timeWaitNode;
        this.animatedTime = this.rouletteMain.animatedTime;
    }

    initBetBoard() {
        this.rouletteMain.board.callback.selected = (betInfo: RouletteBetInfo) => {
            if (this.isDisablePlaceChip()) {
                return;
            }

            const destNode = this.rouletteMain.board.getBetNodeByKey(betInfo.type, RouletteUtils.getKey(betInfo));
            this.betChips.placeChipBetRoulette(this.currentBet, destNode, null, () => {
                this.rouletteMain.board.addBetChoice(betInfo, this.currentBet);
                this.addBetChoice(betInfo, this.currentBet);

                const key = RouletteUtils.getKey(betInfo);
                const betChoices = {};
                betChoices[betInfo.type] = {};
                betChoices[betInfo.type][key] = this.currentBet;
                this.addToBetChoicesStack(betChoices);
            });
        }

        this.rouletteMain.quickBet.callback.getCurrentBet = () => this.currentBet;
        this.rouletteMain.quickBet.callback.selected = (betChoices: any) => {
            if (this.isDisablePlaceChip()) {
                return;
            }

            for (let type in betChoices) {
                for (let key in betChoices[type]) {
                    const betInfo = { type: type, numbers: RouletteUtils.parseKeyToNumbers(key) };
                    const bet = betChoices[type][key];
                    const destNode = this.rouletteMain.board.getBetNodeByKey(betInfo.type, key);
                    this.betChips.placeChipBetRoulette(bet, destNode, null, () => {
                        this.rouletteMain.board.addBetChoice(betInfo, bet);
                        this.addBetChoice(betInfo, bet);
                    });
                }
            }
            this.addToBetChoicesStack(betChoices);
        }
    }

    clearTempBetChoices() {
        this.tempBetChoices = {};
        this.betChoicesStack = [];
        this.rouletteMain.board.showBetChoices(this.currentBetChoices, this.currentBetChoices);
    }

    clearCurrentBetChoices() {
        this.currentBetChoices = {};
        this.rouletteMain.board.showBetChoices(this.currentBetChoices, this.currentBetChoices);
    }

    isDisablePlaceChip(): boolean {
        if (this.isDisableGame) {
            return true;
        }

        if (this.waitingProcessing) {
            this.showProcessingWarning(true);
            return true;
        }

        if (this.currentTimeRemaining <= this.config.stopBetTime || this.currentTimeRemaining >= this.config.betTime) {
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
    }

    showWheelResult(result: number, onComplete: () => void) {
        this.rouletteMain.showRoulette(result, onComplete);
    }

    updateMiniRoundResult(animated = false) {
        const data = this.currentDataLogs.map(log => log.result);
        this.miniRoundResult.setData(data, animated);
        if (this.currentTimeRemaining > this.config.stopBetTime) {
            this.rouletteMain.highlightLastResult(data[0]);
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

        let temp = {};
        temp = this.mergeBetChoices(temp, this.currentBetChoices);
        temp = this.mergeBetChoices(temp, this.tempBetChoices);

        this.addToBetChoicesStack(temp);
        temp = this.mergeBetChoices(temp, this.tempBetChoices);

        this.tempBetChoices = temp;
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
                    total[type] = { ...betChoices2[type] };
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
        }
        return result;
    }

    updateBetChoicesOnBoard() {
        let totalBetChoices = {};
        totalBetChoices = this.mergeBetChoices(totalBetChoices, this.tempBetChoices);
        totalBetChoices = this.mergeBetChoices(totalBetChoices, this.currentBetChoices);
        this.rouletteMain.board.showBetChoices(totalBetChoices, this.currentBetChoices);
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
    }

    onPressedConfirm() {
        this.playClick();
        if (this.isEmptyBetChoices()) {
            return;
        }

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

    public expandMenu() {
        if (this.expandedMenuNode.scaleY == 0) {
            this.expandedMenuNode.runAction(
                cc.spawn(
                    cc.fadeIn(0.2),
                    cc.scaleTo(0.2, 1, 1)
                ));
        } else {
            this.expandedMenuNode.runAction(
                cc.spawn(
                    cc.fadeOut(0.1),
                    cc.scaleTo(0.2, 1, 0)
                ));
        }
    }
}
