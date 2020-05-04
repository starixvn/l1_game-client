import * as helper from '../../common/helpers/Helper';
const { ccclass, property } = cc._decorator;

@ccclass
export default class RoomPlayer extends cc.Component {

    @property(cc.Label)
    nickname: cc.Label = null;

    @property(cc.Label)
    balance: cc.Label = null;

    @property(cc.Label)
    avatar: cc.Sprite = null;

    setInfo(data) {
        if (!!data) {
            this.node.active = true;
            this.balance.string = !!data.red ? helper.numberWithCommas(data.red) : 0;
            !!data.name && (this.nickname.string = data.name.length > 8 ? data.name.substring(0, 7) + "..." : data.name);
            this.setAvatar(data.avatarId);
        } else {
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
