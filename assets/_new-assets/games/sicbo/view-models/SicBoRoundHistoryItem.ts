import { SicBoBetType } from './SicBo';
const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class SicBoRoundHistoryItem extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Label)
    points: cc.Label = null;

    @property(cc.SpriteFrame)
    circle: cc.SpriteFrame = null;

    public data: any = {};

    public setData(data: any) {
        this.data = data.settlementResult;
        let color = cc.Color.BLACK;
        console.log(this.data);

        if (this.data[SicBoBetType.anyTriple]) {
            color.fromHEX("#f29f00");
        } else {
            if (this.data[SicBoBetType.big]) {
                color.fromHEX("#db1515");
            } else {
                color.fromHEX("#2580f1");
            }
        }

        this.icon.spriteFrame = this.circle;
        this.icon.node.color = color;

        let totalPoint = 0;
        Object.values(data.result).forEach((point: number) => {
            totalPoint += point;
        })

        this.points.string = totalPoint.toString();
    }
}
