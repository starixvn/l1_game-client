const { ccclass, property } = cc._decorator;

@ccclass
export default class CallbackAnimation extends cc.Component {
  @property(cc.Animation)
  animation: cc.Animation = null;

  public onFinishedCallback = () => {};

  onLoad() {
    this.animation.on('finished', () => this.finish());
  }

  play() {
    this.animation.play();
  }

  finish() {
    this.onFinishedCallback();
    this.node.destroy();
  }
}
