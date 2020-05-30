const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniRoundHistory extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;

    @property({ type: cc.SpriteFrame })
    itemSprites: cc.SpriteFrame[] = [];

    private items: cc.Sprite[] = [];

    onLoad() {
        this.items = this.content.children.map(child => child.getComponent(cc.Sprite));
        this.items.forEach(item => item.node.active = false);
    }

    public setData(redData: number[]) {
        this.items.forEach((item, index) => {
            let value = redData[index];
            item.spriteFrame = this.itemSprites[value];
            item.node.active = true;
        });
    }
}
