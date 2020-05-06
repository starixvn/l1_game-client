import Baccarat from "../Baccarat";
import GameBaseFinishHandler from "../../../../common/game/handlers/GameBaseFinishHandler";

export default class BaccaratFinishHandler extends GameBaseFinishHandler {
    handleFinishData(dataFinish: any) {
        var baccaratMain = this.main as Baccarat;
        var playerCards = dataFinish.result.playerCards;
        var bankerCards = dataFinish.result.bankerCards;
        baccaratMain.bankerCards.showCards(bankerCards);
        baccaratMain.playerCards.showCards(playerCards);
    }
}
