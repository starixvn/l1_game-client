import GameUtils from "../../../common/GameUtils";
import KenoNotificationItem from "./KenoNotificationItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoWinningItem extends KenoNotificationItem {
    @property(cc.Label)
    amount: cc.Label = null;

    @property(cc.Label)
    gameName: cc.Label = null;

    setData(data: { amount: number; gameId: number }) {
        const { amount, gameId } = data;
        this.amount.string = `+${amount.toString()}`;
        this.gameName.string = `(${GameUtils.getGameNameString(gameId)})`;
    }
}
