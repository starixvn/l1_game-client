import { numberWithCommas } from "../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BannerJackpotPoolItem extends cc.Component {
    @property(cc.Sprite)
    gameIcon: cc.Sprite = null;

    @property(cc.Label)
    gameName: cc.Label = null;

    @property(cc.Label)
    poolAmount: cc.Label = null;

    setData(gameName: string, poolAmount: number) {
        // this.gameIcon.spriteFrame = icon;
        this.gameName.string = gameName;
        this.poolAmount.string = numberWithCommas(poolAmount);
    }
}
