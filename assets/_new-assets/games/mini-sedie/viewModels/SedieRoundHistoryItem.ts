const { ccclass, property } = cc._decorator;

@ccclass
export default class SedieRoundHistoryItem extends cc.Component {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    @property
    tip = false;

    public red: number = 0;

    public setValue(value: number) {
        this.red = value;

        if (!this.sprite || !this.atlas) {
            return;
        }

        let spriteName = "chip_trang_0";
        switch (value) {
            case 1:
            case 3:
                spriteName = `chip_do_${value}`;
                break;
            case 0:
            case 2:
            case 4:
                spriteName = `chip_trang_${value}`;
                break;
        }
        this.sprite.spriteFrame = this.atlas.getSpriteFrame(spriteName);
    }

    public listener = {
        onEnter: (node: cc.Node) => { },
        onLeave: (node: cc.Node) => { },
    }

    onEnable() {
        if (this.tip) {
            this.node.on(cc.Node.EventType.MOUSE_ENTER, this.eventOnEnter, this);
            this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.eventOnLeave, this);
        }
    }

    onDisable() {
        if (this.tip) {
            this.node.off(cc.Node.EventType.MOUSE_ENTER, this.eventOnEnter, this);
            this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.eventOnLeave, this);
        }
    }

    eventOnEnter() {
        this.listener.onEnter(this.node);
    }

    eventOnLeave() {
        this.listener.onLeave(this.node);
    }
}
