import { numberTo } from "../../../common/helpers/Helper";
import BetItem from "../../_base/BetItem";

const { ccclass } = cc._decorator;

@ccclass
export default class SpecialSeDieBetItem extends BetItem {
  setTotalBet(bet: number) {
    numberTo(this.totalBet, 0, bet, 1000, true);
  }
}
