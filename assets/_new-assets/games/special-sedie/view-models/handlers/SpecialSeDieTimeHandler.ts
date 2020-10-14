import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import SpecialSeDie from "../SpecialSeDie";

export default class SpecialSeDieTimeHandler extends GameBaseTimeHandler {
  private readonly shakeThePlateTime = 32;
  private readonly displayResultTime = 36;

  constructor(protected readonly main: SpecialSeDie) {
    super(main);
  }

  get isInWaitTime() {
    return this.main.currentTimeRemaining > this.shakeThePlateTime && this.main.currentTimeRemaining <= this.displayResultTime;
  }

  get isInBalanceBetTime() {
    return this.main.currentTimeRemaining > this.displayResultTime;
  }

  get isStartingNewGameRound() {
    return this.main.currentTimeRemaining == this.shakeThePlateTime;
  }

  get isDisplayResultTime() {
    return this.main.currentTimeRemaining == this.displayResultTime;
  }

  gameUpdate(): void {
    super.gameUpdate();

    if (this.isInBalanceBetTime) {
      this.main.balanceBet();
    } else {
      this.main.hideBalanceBetNotice();
    }

    if (this.isDisplayResultTime) {
      this.main.hideBalanceBetNotice();
      this.main.showResult();
    }
  }

  handleStartingNewGameRound() {
    super.handleStartingNewGameRound();
    this.shakeThePlate();
  }

  handleInRoundTime() {
    this.main.setGameRound(this.main.roundId);
    this.main.betItems.forEach((item) => item.resetHighlight());
    this.main.thePlate.position = cc.v2(0, 0);
    this.main.thePlate.opacity = 255;
    this.main.thePlate.active = true;
    this.main.shakeThePlateAnimation.node.active = true;

    if (this.main.currentTimeRemaining <= this.main.config.betTime) {
      this.showRoundTime();
    }
  }

  handleWaitTime() {
    super.handleWaitTime();

    if (this.main.currentTimeRemaining > this.shakeThePlateTime && !this.main.finishShowResult) {
      this.main.showResult();
    }
  }

  showWaitTime() {
    this.main.timeWaitNode.active = true;
    this.main.timeWaitLabel.string = this.formatTime(this.main.currentTimeRemaining - this.shakeThePlateTime - 1);
  }

  shakeThePlate() {
    cc.tween(this.main.thePlate)
      .to(0, { opacity: 255 })
      .to(0.5, { position: cc.v2(0, 0) })
      .call(() => {
        this.main.shakeThePlateAnimation.node.active = true;
        this.main.shakeThePlateAnimation.play();
      })
      .start();
  }
}
