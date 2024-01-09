import GameUtils from "../../../../common/GameUtils";
import BlackJackFinishHandler from "../../../blackjack/view-models/handlers/BlackJackFinishHandler";
import ChineseBlackjackUtils from "../ChineseBlackjackUtils";

export default class ChineseBlackjackFinishHandler extends BlackJackFinishHandler {
    showLogNotReceiveData() {
        console.error("ChineseBlackjack data finish did not receive");
    }

    processFinish() {
        const finish = this.finishDataCache;
        if (!finish) {
            this.showLogNotReceiveData();
            return;
        }

        const cards = finish?.result;
        if (ChineseBlackjackUtils.isBanBan(cards) || ChineseBlackjackUtils.isBanLuck(cards)) {
            this.finishBlackJackCase(finish);
        } else {
            this.finishNormalCase(finish);
        }
    }

    async finishBlackJackCase(finish) {
        await this.openFaceDownDealerCards(finish);
        super.finishBlackJackCase(finish);
    }

    async openFaceDownDealerCards(finish) {
        this.main.dealerOpenFirstCard(finish.result[0], this.openCardDuration);
        await GameUtils.delayTime(this.openCardDuration);
        await super.openFaceDownDealerCards(finish);
    }
}
