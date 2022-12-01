import BaccaratTimeHandler from "../../../baccarat/view-models/data-handlers/BaccaratTimeDataHandler";
import WinThreeCards from "../WinThreeCards";

export default class WinThreeCardsTimeDataHandler extends BaccaratTimeHandler {
    protected getOwnMain(): any {
        return this.main as WinThreeCards;
    }
}
