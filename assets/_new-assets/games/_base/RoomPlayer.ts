import * as helper from '../../common/helpers/Helper';
const { ccclass, property } = cc._decorator;

export interface PlayerData {
    id: string;
    red: any;
    name: string;
    avatarId: string;
    type: boolean;
    idleCount: number;
}

@ccclass
export default class RoomPlayer extends cc.Component {

    @property(cc.Label)
    nickname: cc.Label = null;

    @property(cc.Label)
    balance: cc.Label = null;

    @property(cc.Sprite)
    avatar: cc.Sprite = null;

    data: PlayerData;


    get isIdle() {
        return this.data.idleCount > 3;
    }

    setInfo(data) {
        this.node.active = true;
        this.node.opacity = 0;

        if (data) {
            this.data = data;
            this.node.runAction(cc.fadeTo(1, 255));
            this.balance.string = (data.red ? helper.numberWithCommas(data.red) : 0).toString();
            data.name && (this.nickname.string = data.name.length > 8 ? data.name.substring(0, 7) + "..." : data.name);
            this.setAvatar(data.avatarId);
        } else {
            this.data = null;
            this.node.runAction(cc.fadeTo(1, 0));
        }
    }

    setBalance(balance: number) {
        this.data.idleCount = 0;
        this.data.red = balance ? balance : 0;
        this.balance.string = helper.numberWithCommas(this.data.red);
    }

    increaseBalance(money: number) {
        if (money) {
            this.data.red += money;
            this.balance.string = helper.numberWithCommas(this.data.red);
        }
    }

    setAvatar(avatarId) {
        let self = this;

        cc.loader.loadRes("profile-picture", cc.SpriteAtlas, function (err, atlas) {
            let frame = atlas.getSpriteFrame(avatarId ? avatarId : 1);

            if (self && self.avatar) {
                self.avatar.spriteFrame = frame;
            }
        });
    }
}
