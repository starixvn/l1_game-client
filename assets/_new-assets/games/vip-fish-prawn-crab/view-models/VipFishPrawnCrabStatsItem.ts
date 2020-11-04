const { ccclass, property } = cc._decorator;

@ccclass
export default class VipFishPrawnCrabStatsItem extends cc.Component {

    @property({ type: cc.Sprite })
    icons: cc.Sprite[] = [];
}
