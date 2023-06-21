import GameUtils from "../../../common/GameUtils";
import JackpotPoolItem from "./JackpotPoolItem";

const { ccclass } = cc._decorator;

@ccclass
export default class StandardJackpotPoolItem extends JackpotPoolItem {
    calculateJackpotPool(amount: number) {
        return GameUtils.getValueByCurrency(amount);
    }
}
