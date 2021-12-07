import GameUtils from "../../../common/GameUtils";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Header extends cc.Component {
    @property(cc.Sprite)
    avatar: cc.Sprite = null;

    @property(cc.Label)
    userName: cc.Label = null;

    @property(cc.Label)
    userRed: cc.Label = null;

    @property(cc.Node)
    scoinsNode: cc.Node = null;

    @property(cc.Label)
    scoinsValue: cc.Label = null;

    @property(cc.Prefab)
    NoticePrefab: cc.Prefab = null;

    onLoad() {
        if (!cc.RedT.IS_LOGIN) {
            this.userName.string = this.userRed.string = "";
            this.avatar.node.active = false;
            this.userRed.node.parent.active = false;
        }
    }

    setBalance(balance: string) {
        this.userRed.node.parent.active = true;
        this.userRed.string = balance;
    }

    setAvatar(avatarId) {
        GameUtils.getAvatarSprite(avatarId).then((frame) => {
            if (this && this.avatar && frame) {
                this.avatar.spriteFrame = frame;
                this.avatar.node.active = true;
            }
        });
    }

    showScoins(scoins = 0) {
        this.scoinsNode.active = true;
        this.scoinsValue.string = numberWithCommas(scoins);
    }
}
