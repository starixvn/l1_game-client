const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemPercentStatistic extends cc.Component {
    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Label)
    choiceName: cc.Label = null;

    @property(cc.Label)
    percent: cc.Label = null;

    init(spriteFrame: cc.SpriteFrame, choiceName: string) {
        this.icon && (this.icon.spriteFrame = spriteFrame);
        this.choiceName && (this.choiceName.string = choiceName);
    }

    setPercent(percent: number) {
        this.percent && (this.percent.string = `${percent}%`);
    }
}
