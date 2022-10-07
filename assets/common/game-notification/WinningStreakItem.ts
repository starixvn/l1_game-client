import GameUtils from "../GameUtils";
import NotificationItem from "./NotificationItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WinningStreakItem extends NotificationItem {
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
