cc.Class({
    extends: cc.Component,

    properties: {
        list: {
            default: null,
            type: cc.Node
        },
        panel: {
            default: null,
            type: cc.Node
        },
        background: {
            default: null,
            type: cc.Node
        },
        menuIcon: {
            default: null,
            type: cc.Node
        }
    },
    onLoad() {
        cc.RedT.setting.popupMini = cc.RedT.setting.popupMini || {};
        this.background.active = false;
        this.background.opacity = 0;
        this.list.active = false;
        this.list.scale = 0;

        this.ttOffset = cc.v2(0, 0);
        this.ttOffset2 = cc.v2(0, 0);
        this.toggleRuning = false;

        if (void 0 !== cc.RedT.setting.popupMini.position) {
            this.node.position = cc.RedT.setting.popupMini.position;
        }
        this.schedule(this.moveToEdge, 0.05, cc.macro.REPEAT_FOREVER);
    },
    onDestroy: function () {
        this.unschedule(this.moveToEdge);
    },
    onEnable: function () {
        this.panel.on(cc.Node.EventType.TOUCH_START, this.eventStart, this);
        this.panel.on(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
        this.panel.on(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
        this.panel.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
        this.panel.on(cc.Node.EventType.MOUSE_ENTER, this.setTop, this);
    },
    onDisable: function () {
        this.panel.off(cc.Node.EventType.TOUCH_START, this.eventStart, this);
        this.panel.off(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
        this.panel.off(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
        this.panel.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
        this.panel.off(cc.Node.EventType.MOUSE_ENTER, this.setTop, this);
    },
    eventStart: function (e) {
        this.setTop();
        this.ttOffset = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y);
        this.ttOffset2 = cc.v2(
            e.touch.getLocationX() - (e.touch.getLocationX() - this.node.position.x),
            e.touch.getLocationY() - (e.touch.getLocationY() - this.node.position.y)
        );
    },
    eventMove: function (e) {
        this.node.position = cc.v2(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y);
    },
    getCurrentSize() {
        const listBox = this.list.getBoundingBox();
        return cc.v2(Math.max(this.node.width, listBox.width), Math.max(this.node.height, listBox.height));
    },
    moveToEdge: function () {
        const width = this.node.parent.width;
        const height = this.node.parent.height;
        const fixTopPadding = 100;
        const size = this.getCurrentSize();
        const maxX = width / 2 - size.x / 2;
        const maxY = height / 2 - size.y / 2;
        const deltaWidth = maxX - Math.abs(this.node.x);
        const deltaHeight = maxY - Math.abs(this.node.y);

        let posX, posY;
        if (deltaWidth < deltaHeight) {
            posY = this.node.y;
            posY = Math.min(maxY, posY);
            posY = Math.max(-maxY, posY);
            posX = this.node.x < 0 ? -maxX : maxX;
        } else {
            posX = this.node.x;
            posX = Math.min(maxX, posX);
            posX = Math.max(-maxX, posX);
            posY = this.node.y < 0 ? -maxY : maxY;
        }

        posY = Math.min(maxY - fixTopPadding, posY);

        this.node.runAction(cc.moveTo(0.1, posX, posY).easing(cc.easeSineOut()));
        cc.RedT.setting.popupMini.position = cc.v2(posX, posY);
    },
    eventEnd: function (e) {
        this.moveToEdge();
        const xChanger = this.ttOffset2.x - (e.touch.getLocationX() - this.ttOffset.x);
        const yChanger = this.ttOffset2.y - (e.touch.getLocationY() - this.ttOffset.y);
        if (xChanger < 5 && xChanger > -5 && yChanger < 5 && yChanger > -5) {
            this.toggle();
        }
    },
    toggle: function () {
        cc.RedT.audio.playClick();
        if (!this.toggleRuning) {
            this.toggleRuning = true;
            const menuAnimation = this.menuIcon.getComponent(cc.Animation);

            if (this.list.active) {
                cc.tween(this.menuIcon).to(0.2, { scale: 0.9 }).start();
                this.hideListGame();
                cc.tween(this.node).to(0.2, { scale: 1 }).start();
                menuAnimation.play();
            } else {
                cc.tween(this.menuIcon).to(0.2, { scale: 0.8 }).start();
                this.showListGame();
                cc.tween(this.node).to(0.2, { scale: 1 }).start();
                menuAnimation.stop();
                this.menuIcon.getChildByName("icon").angle = 0;
            }
        }
    },
    showListGame() {
        this.background.active = true;
        this.background.runAction(cc.fadeTo(0.1, 224));
        this.list.active = cc.RedT.setting.popupMini.open = true;
        this.node.runAction(
            cc.sequence(
                cc.scaleTo(0.1, 1).easing(cc.easeSineInOut()),
                cc.callFunc(() => {
                    cc.tween(this.list).to(0.2, { scale: 1 }).start();
                    this.toggleRuning = false;
                }, this)
            )
        );
    },
    hideListGame() {
        cc.RedT.setting.popupMini.open = false;
        this.node.runAction(
            cc.sequence(
                cc.scaleTo(0.1, 1).easing(cc.easeSineInOut()),
                cc.callFunc(function () {
                    this.list.active = false;
                    this.background.runAction(
                        cc.sequence(
                            cc.fadeOut(0.1),
                            cc.callFunc(() => {
                                this.background.active = false;
                                this.toggleRuning = false;
                                cc.tween(this.list).to(0.1, { scale: 0 }).start();
                            })
                        )
                    );
                }, this)
            )
        );
    },
    setTop: function () {
        this.node.parent.insertChild(this.node);
    }
});
