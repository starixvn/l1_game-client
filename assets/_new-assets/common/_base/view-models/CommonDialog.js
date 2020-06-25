import BounceInEffect from '../../animations/BounceInEffect';

cc.Class({
	extends: BounceInEffect,

	properties: {
		time: {
			default: 0.4,
			override: true
		}
	},

	closeDialog: function () {
		this.node.runAction(cc.spawn(
			cc.scaleTo(this.time, 0).easing(cc.easeBackOut()),
			cc.fadeTo(this.time / 2, 0)));

		this.node.runAction(cc.sequence(cc.delayTime(this.time), cc.callFunc(() => {
			this.node.active = false;
		})));

		cc.RedT.audio.playUnClick();
	},
});
