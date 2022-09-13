import GameUtils from "../../../common/GameUtils";
import KenoNotificationItem from "./KenoNotificationItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoWinningStreakItem extends KenoNotificationItem {
    @property(cc.Label)
    gameName: cc.Label = null;

    @property(cc.RichText)
    result: cc.RichText = null;

    setData(data: any) {
        const { choice, count, gameId } = data;
        this.gameName.string = `(${GameUtils.getGameNameString(gameId)})`;
        this.result.string = `<img src='icon_${choice}'> x${count}`;
    }
}
