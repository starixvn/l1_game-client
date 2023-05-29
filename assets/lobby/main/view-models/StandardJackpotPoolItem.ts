import GameUtils from "../../../common/GameUtils";
import JackpotPoolItem from "./JackpotPoolItem";

const { ccclass } = cc._decorator;

@ccclass
export default class StandardJackpotPoolItem extends JackpotPoolItem {
    convertCurrencyValue(amount) {
        return GameUtils.getValueByCurrency(amount);
    }
}
