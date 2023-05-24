import GameUtils from "../../../common/GameUtils";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import { buildProxyUrl } from "../../../common/helpers/UrlHelper";
import BannerJackpot from "./BannerJackpot";

const { ccclass, property } = cc._decorator;

export interface JackpotPoolInfo {
    gameId: number;
    amount: number;
    pool: number;
}

@ccclass
export default class BannerJackpotPoolItem extends BannerJackpot {
    @property(cc.Sprite)
    gameIcon: cc.Sprite = null;

    @property(cc.Label)
    gameName: cc.Label = null;

    @property(cc.Label)
    poolAmount: cc.Label = null;

    setData(data: JackpotPoolInfo) {
        const { gameId, amount } = data;
        this.gameId = gameId;

        const remoteUrl = buildProxyUrl("/game/static/fourguardians2/game-icon.png");
        cc.assetManager.loadRemote(remoteUrl, (err, texture: cc.Texture2D) => {
            // Use texture to create sprite frame
            // const spriteFrame = new cc.SpriteFrame();
            // // const newTexture = new cc.Texture2D();
            // // newTexture._native = texture;
            // spriteFrame.setTexture(texture);
            console.log(texture);
        });

        // this.gameIcon.spriteFrame = icon;
        this.gameName.string = GameUtils.getGameNameString(gameId);
        this.poolAmount.string = numberWithCommas(amount, 2);
    }
}
