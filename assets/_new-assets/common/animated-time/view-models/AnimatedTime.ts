const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    firstChar: cc.Label = null;

    @property(cc.Label)
    secondChar: cc.Label = null;

    private timeToChangeColor: number = 5;
    private defaultColor: cc.Color;

    public onLoad() {
        this.node.active = false;
        this.defaultColor = this.firstChar.node.color;
    }

    setRedTime(time: number) {
        this.timeToChangeColor = time;
    }

    public setTime(time: number, forceChangeColor = false, changedColor: cc.Color = cc.Color.RED) {
        var firstTimeChar = time.toString().substr(0, 1);
        var secondTimeChar = time.toString().substr(1, 1);

        if (this.firstChar.string !== firstTimeChar) {
            this.handleBetTimeAnimation(this.firstChar.node);
        }

        this.handleBetTimeAnimation(this.secondChar.node);
        this.firstChar.string = firstTimeChar;
        this.secondChar.string = secondTimeChar;

        var colorChange = (forceChangeColor || (this.timeToChangeColor != undefined && time <= this.timeToChangeColor));
        this.firstChar.node.color = colorChange ? changedColor : this.defaultColor;
        this.secondChar.node.color = this.firstChar.node.color;
    }

    private handleBetTimeAnimation(node: cc.Node) {
        var nodeY = node.position.y;

        cc.tween(node)
            .to(0, {
                position: cc.v2(node.position.x, 60),
                opacity: 0
            })
            .to(0.2, {
                position: cc.v2(node.position.x, 0),
                opacity: 255
            })
            .to(0.1, {
                position: cc.v2(node.position.x, - 10)
            })
            .to(0.1, {
                position: cc.v2(node.position.x, 0),
                opacity: 255
            })
            .start();
    }
}
