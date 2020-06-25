const { ccclass, property } = cc._decorator;

@ccclass
export default class AnimatedTime extends cc.Component {

    @property(cc.Label)
    firstChar: cc.Label = null;

    @property(cc.Label)
    secondChar: cc.Label = null;

    private timeToChangeColor: number = 5;
    private changedColor: cc.Color = cc.Color.RED;
    private animatedYTop: number = 60;
    private animatedYBottom: number = -10;

    setRedTime(time: number) {
        this.timeToChangeColor = time;
    }

    setChangedColor(color: cc.Color) {
        this.changedColor = color;
    }

    setAnimatedY(yTop: number, yBottom: number) {
        this.animatedYTop = yTop;
        this.animatedYBottom = yBottom;
    }

    resetTime() {
    }

    public setTime(time: string, forceChangeColor = false) {
        this.node.active = true;
        var firstTimeChar = time.toString().substr(0, 1);
        var secondTimeChar = time.toString().substr(1, 1);

        if (this.firstChar.string !== firstTimeChar) {
            this.handleBetTimeAnimation(this.firstChar.node);
        }

        this.handleBetTimeAnimation(this.secondChar.node);
        this.firstChar.string = firstTimeChar;
        this.secondChar.string = secondTimeChar;

        var colorChange = (forceChangeColor || (this.timeToChangeColor != undefined && parseInt(time) <= this.timeToChangeColor));
        this.firstChar.node.color = colorChange ? this.changedColor : cc.Color.WHITE;
        this.secondChar.node.color = this.firstChar.node.color;
    }

    protected handleBetTimeAnimation(node: cc.Node) {
        cc.tween(node)
            .to(0, {
                position: cc.v2(node.position.x, this.animatedYTop),
                opacity: 0
            })
            .to(0.2, {
                position: cc.v2(node.position.x, 0),
                opacity: 255
            })
            .to(0.1, {
                position: cc.v2(node.position.x, this.animatedYBottom)
            })
            .to(0.1, {
                position: cc.v2(node.position.x, 0),
                opacity: 255
            })
            .start();
    }
}
