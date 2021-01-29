import GameUtils from "../../../common/GameUtils";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerInfo extends cc.Component {
    @property(cc.Sprite)
    image: cc.Sprite = null;

    @property(cc.Label)
    playerName: cc.Label = null;

    @property(cc.Label)
    amount: cc.Label = null;

    async setAvatar(id: number) {
        this.image.spriteFrame = await GameUtils.getAvatarSprite(id);
    }

    setName(name: string) {
        this.playerName.string = name;
    }

    setAmount(amount: number) {
        this.amount.string = numberWithCommas(amount);
    }
}
