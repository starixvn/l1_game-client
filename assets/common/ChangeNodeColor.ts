const { ccclass } = cc._decorator;

@ccclass
export default class ChangeNodeColor extends cc.Component {
    updateNodeColor(color = "#ffffff") {
        this.node.color = cc.Color.WHITE.fromHEX(color);
    }
}
