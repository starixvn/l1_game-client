const { ccclass, property } = cc._decorator;

@ccclass
export default class TypingLabel extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;

    playTypingEffect(duration: number = 0.5) {
        const labelWidth = this.label.node.width;

        const changeWitdhAction = cc.sequence(
            cc.callFunc(() => {
                this.node.width += 1;
            }),
            cc.delayTime(duration / labelWidth)
        );

        this.node.runAction(cc.sequence(
            cc.callFunc(() => {
                this.node.width = 0;
            }),
            cc.repeat(changeWitdhAction, labelWidth),
            cc.delayTime(0.1),
            cc.callFunc(() => {
                this.label.node.runAction(cc.sequence(
                    cc.scaleTo(.1, 1.05),
                    cc.scaleTo(.1, 1)
                ));
            })
        ));
    }
}
