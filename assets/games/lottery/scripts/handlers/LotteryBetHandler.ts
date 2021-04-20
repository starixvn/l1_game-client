import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
import GameBaseBetHandler from "../../../_base/handlers/GameBaseBetHandler";
import Lottery from "../Lottery";

export default class LotteryBetHandler extends GameBaseBetHandler {
    constructor(protected readonly main: Lottery) {
        super(main);
    }

    handle(data: any): boolean {
        super.handle(data);

        if (data.ownBets) {
            this.main.ownBets = data.ownBets;
            this.main.totalBet.string = numberWithCommas(data.ownBets.totalAmount);
            this.main.updateDisplayOwnBets();
        }

        if (data.stats) {
            this.main.stats = data.stats;
            this.main.updateDisplayStats();
        }

        return false;
    }
}
