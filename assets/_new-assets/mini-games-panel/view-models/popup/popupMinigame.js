
cc.Class({
	extends: cc.Component,

	properties: {
		list: {
			default: null,
			type: cc.Node
		},
		time: {
			default: null,
			type: cc.Label
		},
		nodeTime: {
			default: null,
			type: cc.Node
		},
		panel: {
			default: null,
			type: cc.Node
		},
	},
	onLoad() {
		cc.RedT.setting.popupMini = cc.RedT.setting.popupMini || {};
		this.ttOffset = cc.v2(0, 0);
		this.ttOffset2 = cc.v2(0, 0);
		this.toggleRuning = false;

		if (void 0 !== cc.RedT.setting.popupMini.open) {
			if (cc.RedT.setting.popupMini.open) {
				this.list.active = true;
				this.nodeTime.position = cc.v2(-155.7, -5.6);
				this.list.scale = 1;
			} else {
				this.nodeTime.position = cc.v2(25, 43);
				this.list.scale = 0.2;
				this.list.active = false
			}
		}

		if (void 0 !== cc.RedT.setting.popupMini.position) {
			this.node.position = cc.RedT.setting.popupMini.position;
		}
		this.schedule(this.moveToEdge, 0.2, cc.macro.REPEAT_FOREVER);
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

		this.list.on(cc.Node.EventType.TOUCH_START, this.eventStart, this);
		this.list.on(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
		this.list.on(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
		this.list.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
		this.list.on(cc.Node.EventType.MOUSE_ENTER, this.setTop, this);
	},
	onDisable: function () {
		this.panel.off(cc.Node.EventType.TOUCH_START, this.eventStart, this);
		this.panel.off(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
		this.panel.off(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
		this.panel.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
		this.panel.off(cc.Node.EventType.MOUSE_ENTER, this.setTop, this);

		this.list.off(cc.Node.EventType.TOUCH_START, this.eventStart, this);
		this.list.off(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
		this.list.off(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
		this.list.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
		this.list.off(cc.Node.EventType.MOUSE_ENTER, this.setTop, this);
	},
	eventStart: function (e) {
		this.setTop();
		this.ttOffset = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y)
		this.ttOffset2 = cc.v2(e.touch.getLocationX() - (e.touch.getLocationX() - this.node.position.x), e.touch.getLocationY() - (e.touch.getLocationY() - this.node.position.y))
	},
	eventMove: function (e) {
		this.node.position = cc.v2(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y)
	},
	moveToEdge: function () {
		const width = this.node.parent.width;
		const height = this.node.parent.height;
		const fixTopPadding = 100;
		const maxX = width / 2 - Math.max(this.node.width, this.list.getBoundingBox().width) / 2;
		const maxY = height / 2 - Math.max(this.node.height, this.list.getBoundingBox().height) / 2;
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

		// this.node.stopAllActions();
		this.node.runAction(cc.moveTo(0.3, posX, posY).easing(cc.easeSineOut()));
		cc.RedT.setting.popupMini.position = cc.v2(posX, posY);
	},
	eventEnd: function (e) {
		this.moveToEdge();
		const xChanger = this.ttOffset2.x - (e.touch.getLocationX() - this.ttOffset.x)
		const yChanger = this.ttOffset2.y - (e.touch.getLocationY() - this.ttOffset.y)
		if (xChanger < 5 &&
			xChanger > -5 &&
			yChanger < 5 &&
			yChanger > -5) {
			this.toggle()
		}
	},
	toggle: function () {
		cc.RedT.audio.playClick();
		if (!this.toggleRuning) {
			this.toggleRuning = true
			this.list.stopAllActions()
			if (this.list.active) {
				cc.RedT.setting.popupMini.open = false;
				if (this.nodeTime.active) {
					this.nodeTime.runAction(cc.moveTo(0.3, cc.v2(25, 43)));
				} else {
					this.nodeTime.position = cc.v2(25, 43);
				}
				this.list.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.3, 0.2), cc.rotateTo(0.3, -720)), cc.callFunc(function () {
					this.toggleRuning = this.list.active = false
				}, this)))
			} else {
				this.list.active = cc.RedT.setting.popupMini.open = true
				if (this.nodeTime.active) {
					this.nodeTime.runAction(cc.moveTo(0.3, cc.v2(-155.7, -5.6)))
				} else {
					this.nodeTime.position = cc.v2(-155.7, -5.6);
				}
				this.list.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.3, 1), cc.rotateTo(0.3, 720)), cc.callFunc(function () {
					this.toggleRuning = false
				}, this)))
			}
		}
	},
	setTop: function () {
		this.node.parent.insertChild(this.node);
	},
});
