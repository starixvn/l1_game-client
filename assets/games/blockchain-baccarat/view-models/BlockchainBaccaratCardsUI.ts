import BlockchainBaccaratCards from "./card/BlockchainBaccaratCards";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainBaccaratCardsUI extends cc.Component {
    @property(BlockchainBaccaratCards)
    bankerCard: BlockchainBaccaratCards = null;

    @property(BlockchainBaccaratCards)
    playerCard: BlockchainBaccaratCards = null;

    @property(cc.Node)
    bankerPoint: cc.Node = null;

    @property(cc.Node)
    playerPoint: cc.Node = null;

    onLoad() {
        this.bankerPoint.active = false;
        this.playerPoint.active = false;
    }
}
