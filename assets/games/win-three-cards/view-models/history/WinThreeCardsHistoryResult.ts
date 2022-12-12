import { i18n } from "../../../../ClientModules";
import NewCard from "../../../../common/new-card/view-models/NewCard";
import { WinThreeCardResult } from "./WinThreeCardsHistory";

const {ccclass, property} = cc._decorator;

export const getCardsResult = (result: number) => {
    let resultText: string;

    switch (result) {
        case 1: 
            resultText = i18n.t("winThreeCards.highCard");
            break;
        case 2:             
            resultText = i18n.t("winThreeCards.onePair");
            break;
        case 3:        
            resultText = i18n.t("winThreeCards.straight");
            break;
        case 4:
            resultText = i18n.t("winThreeCards.flush");
            break;
        case 5:
            resultText = i18n.t("winThreeCards.straightFlush");
            break;
        case 6:
            resultText = i18n.t("winThreeCards.threeOfAKind");
            break;
        case 7:
            resultText = i18n.t("winThreeCards.killer235");
            break;
    }

    return resultText;
}

export const convertRank = (num: number): string => {
    num++;
    const dict = {
        11: "J",
        12: "Q",
        13: "K",
        1: "A",
        0: " ",
    };
    return dict[num] || num.toString();
};

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

    setCards(results: any) {        
        Object.values(results).forEach((result: any, index) => {            
            this.cards[index].setCardOldStyle({
                rank: result.rank,
                suit: result.suit
            }); 
           
            this.cards[index].faceUp();
        });        
    }
}
