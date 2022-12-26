import NewCard from "../../../../common/new-card/view-models/NewCard";
import { convertRank, getCardsResult } from "../WinThreeCardsHelper";
import { WinThreeCardResult } from "../WinThreeCardsModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WinThreeCardsHistoryResult extends cc.Component {
    @property(cc.Label)
    handRank: cc.Label = null;

    @property(cc.Label)
    cardRank: cc.Label = null;

    @property({ type: NewCard })
    cards: NewCard[] = [];

    setData(betData: WinThreeCardResult) {
        this.handRank.string = getCardsResult(betData.handRankId);
        this.cardRank.string = convertRank(+betData.cardRankId);
        this.setCards(betData.cards);
    }

    private setCards(results: any) {
        Object.values(results).forEach((result: any, index) => {
            this.cards[index].setCardOldStyle({
                rank: result.rank,
                suit: result.suit
            });

            this.cards[index].faceUp();
        });
    }
}
