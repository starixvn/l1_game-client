import AnimatedTime from "../../common/animated-time/view-models/AnimatedTime";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CountDownWarning extends cc.Component {
  @property(AnimatedTime)
  time: AnimatedTime = null;

  @property
  duration = 3;

  private isShowing = false;
  private checkCancel = () => false;

  show(onFinished = () => {}, checkCancel = () => false) {
    this.checkCancel = checkCancel;
    this.node.active = true;
    this.setTime(this.duration);
    let count = 1;
    this.isShowing = true;
    cc.tween(this.node)
      .repeat(
        this.duration,
        cc
          .tween()
          .delay(1)
          .call(() => {
            this.setTime(this.duration - count);
            count++;
          })
      )
      .call(() => {
        this.node.active = false;
        this.isShowing = false;
        onFinished();
      })
      .start();
  }

  update() {
    if (!this.isShowing) {
      return;
    }

    if (this.checkCancel()) {
      this.node.stopAllActions();
      this.node.active = false;
      this.isShowing = false;
    }
  }

  setTime(time: number) {
    const num = String(time).padStart(2, '0');
    this.time.setTime(num);
  }
}
