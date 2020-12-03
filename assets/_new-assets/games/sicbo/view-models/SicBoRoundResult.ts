import { SicBoBetType } from './SicBo';
const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class SicBoRoundResult extends cc.Component {
  @property(cc.Sprite)
  dice1: cc.Sprite = null;

  @property(cc.Sprite)
  dice2: cc.Sprite = null;

  @property(cc.Sprite)
  dice3: cc.Sprite = null;

  @property(cc.Label)
  total: cc.Label = null;

  @property(cc.Label)
  result: cc.Label = null;

  @property(cc.Sprite)
  highlight: cc.Sprite = null;

  onLoad() {
    cc.tween(this.highlight.node)
      .repeatForever(
        cc.tween()
          .to(0.2, { opacity: 150 }, { easing: "cubicIn" })
          .delay(0.1)
          .to(0.2, { opacity: 255 }, { easing: "cubicOut" })
      )
      .start();
  }

  updateLabels(data: any) {
    const { settlementResult, result } = data;
    let color = cc.Color.BLACK;

    this.total.string = result.dice1 + result.dice2 + result.dice3;

    if (settlementResult[SicBoBetType.anyTriple]) {
      color.fromHEX('#f29f00');
      this.result.string = 'B';
      this.result.node.color = color;
    } else {
      if (settlementResult[SicBoBetType.big]) {
        color.fromHEX('#db1515');
        this.result.string = 'T';
        this.result.node.color = color;
      } else {
        color.fromHEX('#2580f1');
        this.result.string = 'X';
        this.result.node.color = color;
      }
    }
  }
}
