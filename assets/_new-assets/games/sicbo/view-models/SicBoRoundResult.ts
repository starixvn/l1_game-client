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

  @property(cc.SpriteAtlas)
  sicboAtlas: cc.SpriteAtlas = null;

  @property(cc.Sprite)
  total: cc.Sprite = null;

  @property(cc.Sprite)
  result: cc.Sprite = null;

  @property(cc.Sprite)
  highlight: cc.Sprite = null;

  onLoad() {
    cc.tween(this.highlight.node)
      .repeatForever(
        cc.tween()
          .to(0.4, { opacity: 150 }, { easing: "cubicIn" })
          .delay(0.4)
          .to(0.4, { opacity: 255 }, { easing: "cubicOut" })
      )
      .start();
  }

  updateLabels(data: any) {
    const { settlementResult, result } = data;
    let color = cc.Color.BLACK;

    this.total.spriteFrame = this.sicboAtlas.getSpriteFrame(`stats_${result.dice1 + result.dice2 + result.dice3}`);

    if (settlementResult[SicBoBetType.anyTriple]) {
      this.result.spriteFrame = this.sicboAtlas.getSpriteFrame(`stats_B`);
    } else {
      if (settlementResult[SicBoBetType.big]) {
        this.result.spriteFrame = this.sicboAtlas.getSpriteFrame(`stats_T`);
      } else {
        this.result.spriteFrame = this.sicboAtlas.getSpriteFrame(`stats_X`);
      }
    }
  }
}
