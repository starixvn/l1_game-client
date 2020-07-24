import GameRoomBase from "../../_base/GameRoomBase";
import { property } from "lodash";

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
export default class Roulette extends cc.Component {
    @property(cc.Node)
    mainContainer: cc.Node = null;

    @property(cc.Prefab)
    mainPrefab: cc.Prefab = null;

    onLoad() {
        this.initMain();
    }

    initMain() {
        const node = cc.instantiate(this.mainPrefab);
        this.mainContainer.addChild(node);
    }
}
