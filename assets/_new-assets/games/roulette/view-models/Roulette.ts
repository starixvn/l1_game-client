import GameRoomBase from "../../_base/GameRoomBase";
import { RouletteConfigs } from "./RouletteConfigs";
import RouletteMain from "./RouletteMain";
import RouletteFinishHandler from "./handlers/RouletteFinishHandler";
import RouletteLogsHandler from "./handlers/RouletteLogsHandler";
import RouletteMiniRoundResult from "./RouletteMiniRoundResult";
import RouletteUtils from "./RouletteUtils";
import RouletteTimeHandler from "./handlers/RouletteTimeHandler";
import RouletteBetHandler from "./handlers/RouletteBetHandler";

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
    Four_Numbers = "four_numbers",
    Line = "line",
    Column = "column",
    Dozen = "dozen",
    RedBlack = "redblack",
    EvenOdd = "evenodd",
    BigSmall = "bigsmall"
}

@ccclass
export default class Roulette extends GameRoomBase {
    @property(cc.Node)
    mainContainer: cc.Node = null;

    @property(cc.Prefab)
    mainPrefab: cc.Prefab = null;

    @property(RouletteMiniRoundResult)
    miniRoundResult: RouletteMiniRoundResult = null;

    rouletteMain: RouletteMain;

    tempBetChoices: any = {};
    currentBetChoices: any = {}

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
        const node = cc.instantiate(this.mainPrefab);
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
            this.betChips.placeChipBetRoulette(this.currentBet, this.rouletteMain.board.getBetNode(betInfo), null, () => {
                this.rouletteMain.board.addOwnBet(betInfo, this.currentBet);
                this.addBetChoice(betInfo, this.currentBet);
            });
        }
    }

    clearTempBetChoices() {
        this.tempBetChoices = {};
        this.rouletteMain.board.showBetChoices(this.currentBetChoices);
    }

    clearCurrentBetChoices() {
        this.currentBetChoices = {};
        this.rouletteMain.board.showBetChoices(this.currentBetChoices);
    }

    isDisablePlaceChip(): boolean {
        if (this.isDisableGame) {
            return true;
        }

        if (this.waitingProcessing) {
            this.showProcessingWarning(true);
            return true;
        }

        if (this.currentTimeRemaining <= this.config.stopBetTime || this.currentTimeRemaining > this.config.betTime) {
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

    }

    onPressedDouble() {
        this.playClick();
    }

    onPressedUndo() {
        this.playClick();
    }

    onPressedClear() {
        this.playClick();
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
}
