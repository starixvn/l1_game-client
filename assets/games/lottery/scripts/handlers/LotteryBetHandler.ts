import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
import GameBaseBetHandler from "../../../_base/handlers/GameBaseBetHandler";
import Lottery from "../Lottery";
import LotteryHelper from "../LotteryHelper";

export default class LotteryBetHandler extends GameBaseBetHandler {
    constructor(protected readonly main: Lottery) {
        super(main);
    }

    handle(data: any): boolean {
        super.handle(data);

        if (data.totalBets) {
            this.main.totalBets = data.totalBets;
            const total = LotteryHelper.getTotalBet(data.totalBets);
            this.main.totalBet.string = numberWithCommas(total);
        }

        return false;
    }
}
