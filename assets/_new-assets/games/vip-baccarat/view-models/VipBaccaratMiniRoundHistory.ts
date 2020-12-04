import MiniRoundHistory from '../../../common/mini-round-history/MiniRoundHistory';

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipBaccaratMiniRoundHistory extends cc.Component {
  @property(cc.Node)
  content: cc.Node = null;
}
