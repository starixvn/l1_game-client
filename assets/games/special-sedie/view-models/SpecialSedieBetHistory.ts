import GameBalancedBettingHistoryBase from "../../_base/view-models/GameBalancedBettingHistoryBase";
import { getStringDateByTime } from "./../../../common/helpers/DateTimeHelper";
const { ccclass, property } = cc._decorator;
@ccclass
export default class SpecialSedieBetHistory extends GameBalancedBettingHistoryBase {
    @property(cc.Node)
    dots: cc.Node = null;

    @property(cc.SpriteFrame)
    redDot: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    whiteDot: cc.SpriteFrame = null;

    protected betType = ["even", "odd"];

    onData(data: any) {
        super.onData(data);
        this.loadBettingUserList(this.betType[0], this.betType[1]);
        const { id, time, result } = data;
        this.roundIdLabel.string = `${id} - ${getStringDateByTime(time)}`;
        this.updateDotsResult(result);
    }

    updateDotsResult(result: any) {
        Object.keys(result).forEach((key, index) => {
            const dot = this.dots.children[index]?.getComponent(cc.Sprite);
            dot.spriteFrame = result[key] ? this.redDot : this.whiteDot;
        });
    }
}
