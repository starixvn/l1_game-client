const _ = window.modules.lodash;
import BlockchainBaccaratCards from "../card/BlockchainBaccaratCards";
import BaccaratBaseHistoryItem from "../../../baccarat/view-models/BaccaratBaseHistoryItem";
import { BetLog } from "./BlockchainBaccaratTicketHistory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainBaccaratTicketHistoryItem extends BaccaratBaseHistoryItem {
    @property(BlockchainBaccaratCards)
    playerCards: BlockchainBaccaratCards = null;

    @property(BlockchainBaccaratCards)
    bankerCards: BlockchainBaccaratCards = null;

    @property(cc.Node)
    showBg: cc.Node = null;

    @property(cc.Node)
    playerCard3: cc.Node = null;

    @property(cc.Node)
    bankerCard3: cc.Node = null;

    setData(betLog: BetLog, index: number) {
        this.showBg.active = index % 2 === 0 ? false : true;
        super.setData(betLog);
    }

    showCards(betLog: BetLog) {
        if (!this.playerCards || !this.bankerCards) {
            return;
        }

        const playerCards = _.values(betLog.result.player).filter((card) => card != null);
        const bankerCards = _.values(betLog.result.banker).filter((card) => card != null);

        if (playerCards.length < 3) {
            this.playerCard3.active = false;
        }

        if (bankerCards.length < 3) {
            this.bankerCard3.active = false;
        }

        this.playerCards.showCardsWithoutInfoAndIndex(playerCards);
        this.bankerCards.showCardsWithoutInfoAndIndex(bankerCards);
    }
}
