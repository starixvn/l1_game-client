const { ccclass, property } = cc._decorator;

@ccclass
export default class FourGuardiansGuideItem extends cc.Component {
  @property(cc.Label)
  times: cc.Label[] = [];

  @property(cc.Label)
  value: cc.Label[] = [];
}
