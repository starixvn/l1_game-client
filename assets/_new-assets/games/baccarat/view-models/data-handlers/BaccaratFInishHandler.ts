import Baccarat from "../Baccarat";
import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import * as _ from "lodash";

export default class BaccaratFinishHandler extends GameBaseFinishHandler {
    handleFinishData(dataFinish: any) {
        var baccaratMain = this.main as Baccarat;

        if (!dataFinish.result) {
            return;
        }

        this.showCards(dataFinish.result, baccaratMain);
        this.showResult(dataFinish.settlementResult);

    }

    private showCards(dataResult: any, baccaratMain: Baccarat) {
        var playerCards = dataResult.playerCards;
        var bankerCards = dataResult.bankerCards;
        debugger;
        baccaratMain.bankerCards.showCards(bankerCards);
        baccaratMain.playerCards.showCards(playerCards);
    }

    private showResult(resultData) {
        _.forEach(this.main.betItems, item => item.setHighlight(resultData[item.node.name.toLowerCase()]));
    }
}
