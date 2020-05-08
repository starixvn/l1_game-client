import * as helper from '../../common/helpers/Helper';
const { ccclass, property } = cc._decorator;

export interface PlayerData {
    id: string;
    red: any;
    name: string;
    avatarId: string;
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

    setInfo(data) {
        if (data) {
            this.data = data;
            this.node.active = true;
            this.balance.string = data.red ? helper.numberWithCommas(data.red) : 0;
            data.name && (this.nickname.string = data.name.length > 8 ? data.name.substring(0, 7) + "..." : data.name);
            this.setAvatar(data.avatarId);
        } else {
            this.data = null;
            this.node.active = false;
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
