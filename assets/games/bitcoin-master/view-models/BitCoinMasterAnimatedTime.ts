import AnimatedTime from "../../../common/animated-time/view-models/AnimatedTime";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BitCoinMasterAnimatedTime extends AnimatedTime {
    // private waitin = 60;
    // public setColor(time: string, forceChangeColor = false) {
    //     const colorChange =
    //         forceChangeColor ||
    //         (this.timeToChangeColor !== undefined && parseInt(time) <= this.timeToChangeColor && parseInt(time) >= this.waitin);
    //     this.firstChar.node.color = colorChange ? this.changedColor : cc.Color.WHITE;
    //     this.secondChar.node.color = this.firstChar.node.color;
    // }
}
