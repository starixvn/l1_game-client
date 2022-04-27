const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Button)
export default class HoldActionButton extends cc.Component {
    @property({ type: cc.Component.EventHandler })
    clickEvents: cc.Component.EventHandler[] = [];

    private isHoldingButton = false;
    private _actions = [];

    public addAction(action: () => void) {
        this._actions.push(action);
    }

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.startHoldButton, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.handleTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.stopHoldButton, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.handleTouchEnd, this);
    }

    private handleTouchEnd(event: cc.Event.EventTouch) {
        const location = event.getLocation();
        const hit = this.node._hitTest(location);
        if (hit) {
            this.doAction();
        }

        this.stopHoldButton();
    }

    private handleTouchMove(event: cc.Event.EventTouch) {
        const location = event.getLocation();
        const hit = this.node._hitTest(location);
        if (!hit) {
            this.stopHoldButton();
            event.stopPropagation();
        }
    }

    private doAction() {
        cc.Component.EventHandler.emitEvents(this.clickEvents);
        this._actions.forEach((action) => action && action());
    }

    private updateForHoldButton() {
        if (this.isHoldingButton) {
            this.doAction();
        }
    }

    private startHoldButton() {
        this.isHoldingButton = true;
        this.schedule(this.updateForHoldButton, 1, cc.macro.REPEAT_FOREVER, 0);
    }

    private stopHoldButton() {
        this.isHoldingButton = false;
        this.unschedule(this.updateForHoldButton);
    }
}
