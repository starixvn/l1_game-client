import * as helper from './helpers/Helper';

export default class GameUtils {
    public static addFlyingText(parent: cc.Node, win: boolean, value: number, duration: number = 1, flyingY: number = 100) {
        var temp = new cc.Node().addComponent(cc.Label);
        temp.string = (win ? "+" : "-") + helper.numberWithCommas(value);
        temp.font = win ? cc.RedT.util.fontCong : cc.RedT.util.fontTru;
        temp.lineHeight = 130;
        temp.fontSize = 30;
        temp.node.position = cc.v2(0, 0);
        parent.addChild(temp.node);
        temp.node.runAction(
            cc.sequence(
                cc.moveTo(duration, cc.v2(0, flyingY)),
                cc.callFunc(function () {
                    this.node.destroy();
                }, temp)
            )
        );
    }
}
