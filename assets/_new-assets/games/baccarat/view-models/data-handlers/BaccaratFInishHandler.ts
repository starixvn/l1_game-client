import Baccarat from "../Baccarat";
import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import * as _ from "lodash";

export default class BaccaratFinishHandler extends GameBaseFinishHandler {
    handleFinishData(dataFinish: any) {
        var baccaratMain = this.main as Baccarat;

        if (!dataFinish.result) {
            return;
        }

        var dataResult = dataFinish.result;
        this.showCards(dataResult, baccaratMain);
        this.showResult(dataResult);

    }

    private showCards(dataResult: any, baccaratMain: Baccarat) {
        var playerCards = dataResult.playerCards;
        var bankerCards = dataResult.bankerCards;
        baccaratMain.bankerCards.showCards(bankerCards);
        baccaratMain.playerCards.showCards(playerCards);
    }

    private showResult(resultData) {
        _.forEach(this.main.betItems, item => item.setHighlight(resultData[item.node.name.toLowerCase()]));
    }
}
