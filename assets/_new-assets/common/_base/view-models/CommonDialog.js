cc.Class({
	extends: cc.Component,

	properties: {
		time: 0.5
	},

	onEnable() {
		this.node.opacity = 0;
		this.node.scale = 0;
		this.node.runAction(cc.spawn(
			cc.scaleTo(this.time, 1).easing(cc.easeBackOut()),
			cc.fadeTo(this.time / 2, 255)));
	},

	closeDialog: function () {
		this.node.runAction(cc.spawn(
			cc.scaleTo(this.time, 0).easing(cc.easeBackOut()),
			cc.fadeTo(this.time / 2, 0)));

		cc.RedT.audio.playUnClick();
		// this.node.destroy();
	},
});
