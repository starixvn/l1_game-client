const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteGroupBetItem extends cc.Component {
    @property
    betType: string = ""

    @property
    numbers: string = "";

    private selectedNumbers: number[] = [];

    public callback = {
        highlight: (highlight: boolean, numbers: number[]) => { },
        selected: (betType: string, numbers: number[]) => { }
    }

    getNumbers(): number[] {
        return this.selectedNumbers;
    }

    onLoad() {
        this.selectedNumbers = this.numbers.split(',').map(i => +i);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onTouchCancel, this);
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        this.node.off(cc.Node.EventType.MOUSE_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.onTouchCancel, this);

    }

    onTouchStart(e) {
        this.callback.highlight(true, this.selectedNumbers);
    }

    onTouchMove(e) {
        this.callback.highlight(true, this.selectedNumbers);
    }

    onTouchEnd(e) {
        this.callback.highlight(false, this.selectedNumbers);
        this.callback.selected(this.betType, this.selectedNumbers);
    }

    onTouchCancel(e: cc.Event.EventTouch) {
        this.callback.highlight(false, this.selectedNumbers);
    }
}
