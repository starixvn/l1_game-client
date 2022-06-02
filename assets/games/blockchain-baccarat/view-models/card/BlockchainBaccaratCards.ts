const { ccclass, property } = cc._decorator;
@ccclass
export default class BlockchainBaccaratCards extends cc.Component {
    @property(cc.Prefab)
    cardsPrefab: cc.Prefab = null;

    @property(cc.Node)
    cards: cc.Node[] = [];

    @property(cc.Node)
    cardsTmp: cc.Node = null;

    @property(cc.Node)
    cardsBox: cc.Node = null;

    @property(cc.Node)
    cardsDrop: cc.Node = null;

    @property(cc.Node)
    point: cc.Node = null;

    @property
    isBanker = false;

    @property()
    flyX = 0;
}
