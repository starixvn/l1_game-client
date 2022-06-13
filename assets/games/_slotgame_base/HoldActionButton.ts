const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Button)
export default class HoldActionButton extends cc.Component {
    @property({ type: cc.Component.EventHandler })
    clickEvents: cc.Component.EventHandler[] = [];

    private isTouching = false;
    private isKeyPressing = false;
    private readonly _actions = [];

    interactable = true;

    get isAutoAction() {
        return this.isTouching || this.isKeyPressing;
    }

    public addAction(action: () => void) {
        this._actions.push(action);
    }

    onLoad() {
        this.registerKeyEvents();
        this.node.on(cc.Node.EventType.TOUCH_START, this.startHoldButton, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.handleTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.stopHoldButton, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.handleTouchEnd, this);
    }

    onDestroy() {
        this.removeKeyEvents();
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
        if (!this.interactable) {
            return;
        }
        cc.Component.EventHandler.emitEvents(this.clickEvents);
        this._actions.forEach((action) => action && action());
    }

    private updateForHoldButton() {
        if (this.isTouching) {
            this.doAction();
        }
    }

    private startHoldButton() {
        this.isTouching = true;
        this.schedule(this.updateForHoldButton, 1, cc.macro.REPEAT_FOREVER, 0);
    }

    private stopHoldButton() {
        this.isTouching = false;
        this.unschedule(this.updateForHoldButton);
    }

    registerKeyEvents() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    removeKeyEvents() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        if (event.keyCode === cc.macro.KEY.space || event.keyCode === cc.macro.KEY.enter) {
            this.enableAutoAction();
        }
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        if (event.keyCode === cc.macro.KEY.space || event.keyCode === cc.macro.KEY.enter) {
            this.disableAutoAction();
        }
    }

    enableAutoAction() {
        if (this.isKeyPressing) {
            return;
        }

        this.isKeyPressing = true;
        this.doAction();
        this.schedule(this.onScheduleUpdateForKey, 1, cc.macro.REPEAT_FOREVER);
    }

    disableAutoAction() {
        this.isKeyPressing = false;
        this.unschedule(this.onScheduleUpdateForKey);
    }

    onScheduleUpdateForKey() {
        if (!this.isKeyPressing) {
            return;
        }

        this.doAction();
    }
}
