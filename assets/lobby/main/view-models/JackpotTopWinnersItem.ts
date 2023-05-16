import GameUtils from "../../../common/GameUtils";
import { shortenName } from "../../../common/helpers/NicknameHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import { userManager } from "../../../common/user/UserManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotTopWinnersItem extends cc.Component {
    @property(cc.Sprite)
    image: cc.Sprite = null;

    @property(cc.Label)
    playerName: cc.Label = null;

    @property(cc.Label)
    amount: cc.Label = null;

    @property(cc.Label)
    gameName: cc.Label = null;

    async setAvatar(id: number) {
        this.image.spriteFrame = await GameUtils.getAvatarSprite(id);
    }

    setName(name: string) {
        this.playerName.string = userManager.isLoginUser(name) ? name : shortenName(name);
    }

    setAmount(amount: number) {
        this.amount.string = numberWithCommas(amount, 2);
    }

    setGameName(gameName: string) {
        this.gameName.string = gameName;
    }
}
