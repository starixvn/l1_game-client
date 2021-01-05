import NewButton from "./NewButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ButtonGroup extends cc.Component {
    buttons: NewButton[] = [];

    private _interactable = true;

    onLoad() {
        this.registerEventListener();
        this.node.children.forEach((child) => {
            const newButton = child.getComponent(NewButton);
            newButton && this.buttons.push(newButton);
        });
    }

    onDestroy() {
        this.clearEvenListener();
    }

    registerEventListener() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onTouchCancel, this);
    }

    clearEvenListener() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        this.node.off(cc.Node.EventType.MOUSE_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.onTouchCancel, this);
    }

    onTouchMove(e) {
        let selected = false;
        for (let i = this.buttons.length - 1; i >= 0; i--) {
            const button = this.buttons[i];
            if (button.node.active && button.checkCollider(e) && !selected) {
                selected = true;
                button.setHighlight(true);
            } else {
                button.setHighlight(false);
            }
        }
    }

    onTouchEnd(e) {
        if (!this._interactable) {
            return;
        }

        for (let i = this.buttons.length - 1; i >= 0; i--) {
            const button = this.buttons[i];
            if (button.node.active && button.checkCollider(e)) {
                button.callback.selected();
                this._interactable = false;
                cc.tween(this.node)
                    .delay(1)
                    .call(() => (this._interactable = true))
                    .start();
                break;
            }
        }
    }

    onTouchCancel(e) {
        this.buttons.forEach((button) => button.setHighlight(false));
    }
}
