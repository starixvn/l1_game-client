import GameUtils from "../../../common/GameUtils";
import { shortenName } from "../../../common/helpers/NicknameHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import { userManager } from "../../../common/user/UserManager";
import BannerJackpot from "./BannerJackpot";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotTopWinnersItem extends BannerJackpot {
    @property(cc.Sprite)
    image: cc.Sprite = null;

    @property(cc.Label)
    playerName: cc.Label = null;

    @property(cc.Label)
    amount: cc.Label = null;

    @property(cc.Label)
    gameName: cc.Label = null;

    setData(data) {
        const { avatarId, winnerName, amount, gameId } = data;
        this.gameId = gameId;
        this.setAvatar(avatarId);
        this.setName(winnerName);
        this.setAmount(amount);
        this.setGameName(GameUtils.getGameNameString(gameId));
    }

    async setAvatar(id: number) {
        this.image.spriteFrame = await GameUtils.getAvatarSprite(id);
    }

    private setName(name: string) {
        this.playerName.string = userManager.isLoginUser(name) ? name : shortenName(name);
    }

    private setAmount(amount: number) {
        this.amount.string = numberWithCommas(amount, 2);
    }

    private setGameName(gameName: string) {
        this.gameName.string = gameName;
    }
}
