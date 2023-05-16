import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import GameUtils from "../../../common/GameUtils";

const { ccclass, property } = cc._decorator;

export interface JackpotPoolInfo {
    gameId: number;
    amount: number;
    pool: number;
}

@ccclass
export default class BannerJackpotPoolItem extends cc.Component {
    @property(cc.Sprite)
    gameIcon: cc.Sprite = null;

    @property(cc.Label)
    gameName: cc.Label = null;

    @property(cc.Label)
    poolAmount: cc.Label = null;

    setData(data: JackpotPoolInfo) {
        const { gameId, amount } = data;
        // this.gameIcon.spriteFrame = icon;
        this.gameName.string = GameUtils.getGameNameString(gameId);
        this.poolAmount.string = numberWithCommas(amount, 2);
    }
}
