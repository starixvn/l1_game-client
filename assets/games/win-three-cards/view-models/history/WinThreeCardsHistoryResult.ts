import NewCard from "../../../../common/new-card/view-models/NewCard";
import { WinThreeCardResult } from "./WinThreeCardsHistory";

const {ccclass, property} = cc._decorator;

export const getCardsResult = (result: number) => {
    let resultText: string;

    switch (result) {
        case 1: 
            resultText = "High Card";
            break;
        case 2:             
            resultText = "One Pair";
            break;
        case 3:        
            resultText = "Straight";
            break;
        case 4:
            resultText = "Flush";
            break;
        case 5:
            resultText = "Straight Flush";
            break;
        case 6:
            resultText = "Three Of A Kind";
            break;
        case 7:
            resultText = "Killer 235";
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
        console.log("this.cardRank", convertRank(+betData.cardRankId))
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
