import GameUtils from "../../../../common/GameUtils";
import { CardModel } from "../../../../common/new-card/view-models/NewCard";
import BlackJackFinishHandler from "../../../blackjack/view-models/handlers/BlackJackFinishHandler";
import ChineseBlackjack from "../ChineseBlackjack";
import ChineseBlackjackHandPlace from "../ChineseBlackjackHandPlace";
import ChineseBlackjackUtils from "../ChineseBlackjackUtils";

export interface IFinishData {
    result: CardModel[];
    settlementResult: string;
    winningHands: unknown[];
}

export interface IHand {
    betwin: number;
    cards: CardModel[];
    actions: string[];
    pos: number;
    bet: number;
    id: number;
    total: number[];
    isStand: boolean;
}
export default class ChineseBlackjackFinishHandler extends BlackJackFinishHandler {
    get mainGame() {
        return this.main as ChineseBlackjack;
    }
    showLogNotReceiveData() {
        console.error("ChineseBlackjack data finish did not receive");
    }

    processFinish() {
        const finish = this.finishDataCache as IFinishData;
        if (!finish) {
            this.showLogNotReceiveData();
            return;
        }
        this.mainGame.provablyFairComponent.seBehaviorClientSeed(true);
        this.mainGame.provablyFairComponent.setRandomClientSeed();
        const cards = finish?.result;
        if (ChineseBlackjackUtils.isBanBan(cards) || ChineseBlackjackUtils.isBanLuck(cards)) {
            this.finishBlackJackCase(finish);
        } else {
            this.finishNormalCase(finish);
        }
    }

    async finishBlackJackCase(finish: IFinishData) {
        await this.openFaceDownDealerCards(finish);
        const dealerHand = this.main.dealerHand as ChineseBlackjackHandPlace;
        dealerHand.cardLayout.updateLayout();
        dealerHand.showScoreWithOutData(finish.result, 2, true);
        this.showWinningHands();
        this.startNewRound();
    }

    async openFaceDownDealerCards(finish: IFinishData) {
        this.main.dealerOpenFirstCard(finish.result[0], this.openCardDuration);
        await GameUtils.delayTime(this.openCardDuration);
        await super.openFaceDownDealerCards(finish);
    }
}
