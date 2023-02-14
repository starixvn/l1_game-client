const { ccclass, property } = cc._decorator;

@ccclass
export default class ChangeNodeColor extends cc.Component {
    @property
    changedColor = "";

    updateColor(color: string) {
        this.node.color = cc.Color.WHITE.fromHEX(color ? color : this.changedColor);
    }
}
