import BounceInEffect from "../../animations/BounceInEffect";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CommonDialog extends BounceInEffect {
	@property({ override: true })
	time = 0.4;

	closeDialog() {
		this.node.runAction(cc.spawn(
			cc.scaleTo(this.time, 0).easing(cc.easeBackIn()),
			cc.fadeTo(this.time, 0)));

		this.node.runAction(cc.sequence(cc.delayTime(this.time), cc.callFunc(() => {
			this.node.active = false;
		})));

		cc.RedT.audio.playUnClick();
	}
}
