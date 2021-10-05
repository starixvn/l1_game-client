import NoticeUtil from "../../common/utils/NoticeUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewsContent extends cc.Component {
    @property(cc.BitmapFont)
    marqueeFont: cc.BitmapFont = null;

    colors = ["#F24647", "#33D3E9", "#F8E49D"];

    update(t) {
        if (this.node.childrenCount === 0) {
            this.reset();
            return;
        }
        const limitLeft = -this.node.parent.width / 4;
        for (let i = 0; i < this.node.childrenCount; i++) {
            const child = this.node.children[i];
            child.position = cc.v3(child.position.x - 100 * t, 0);

            if (child.position.x + child.width < limitLeft) {
                child.destroy();
            }
        }
    }

    reset() {
        this.node.active = false;
    }

    onData(data) {
        if (!cc.RedT.GAME_IS_SHOWED) {
            return;
        }

        if (void 0 !== data) {
            this.addMarqueeMessage(NoticeUtil.getMessageByLocale(data));
        }
    }

    addMarqueeMessage(message) {
        const node = new cc.Node();
        node.color = node.color.fromHEX(this.colors[Math.floor(Math.random() * 3)]);
        node.addComponent(cc.Label);
        const label = node.getComponent(cc.Label);
        label.font = this.marqueeFont;
        label.string = message;
        label.lineHeight = 47;
        label.verticalAlign = cc.Label.VerticalAlign.CENTER;
        label.fontSize = 16;
        this.addNewsNode(node);
        this.node.active = true;
    }

    addNewsNode(node) {
        const count = this.node.childrenCount;
        let lastItemX = this.node.parent.width / 2 + node.width / 2;
        const lastNode = this.node.children[count - 1];

        this.node.addChild(node);
        if (lastNode) {
            lastItemX = Math.max(lastNode.position.x + lastNode.width / 2 + node.width / 2 + 100, lastItemX);
        }
        node.position = cc.v2(lastItemX, 0);
    }
}
