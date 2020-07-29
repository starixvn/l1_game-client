import GameRoomBase from "../../_base/GameRoomBase";
import { RouletteConfigs } from "./RouletteConfigs";

const { ccclass, property } = cc._decorator;


export interface RouletteBetInfo {
    type: string;
    numbers: number[];
    bet: number;
}

export enum RouletteBetType {
    Direct = "direct",
    Separate = "separate",
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

    constructor() {
        super();
        this.init("roulette", new RouletteConfigs());
    }

    initHandlers() {
        super.initHandlers();

        // this.finishHandler = new KenoFinishHandler(this);
        // this.timeHandler = new KenoTimeHandler(this);
        // this.logsHandler = new KenoLogsHandler(this);
    }

    onLoad() {
        super.onLoad();
        this.initMain();

    }

    resetDataAndUI() {
        super.resetDataAndUI();

    }

    initMain() {
        const node = cc.instantiate(this.mainPrefab);
        this.mainContainer.addChild(node);
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
    }
}
