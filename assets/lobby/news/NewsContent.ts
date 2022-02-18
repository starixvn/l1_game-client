import NoticeUtil from "../../common/utils/NoticeUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewsContent extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Font)
    marqueeFont: cc.Font = null;

    private readonly colors = ["#F24647", "#33D3E9", "#F8E49D"];
    private fonts = {};

    onLoad(): void {
        this.initData();
    }

    initData() {
        this.fonts = {
            en: "NotoSerif-Regular",
            th: "NotoSerifThai-Regular",
            zh_cn: "NotoSerifZHCN-Regular",
            zh_tw: "NotoSerifZHTW-Regular"
        };
    }

    update(t) {
        if (this.content.childrenCount === 0) {
            this.reset();
            return;
        }
        const limitLeft = -this.content.width / 2;
        for (let i = 0; i < this.content.childrenCount; i++) {
            const child = this.content.children[i];
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
        const nameFont = this.getFontNameByLanguage();
        this.loadFont(nameFont).then((font) => {
            const node = new cc.Node();
            node.anchorX = 0;
            node.color = node.color.fromHEX(this.colors[Math.floor(Math.random() * 3)]);
            node.addComponent(cc.Label);
            const label = node.getComponent(cc.Label);
            label.font = font;
            label.string = message;
            label.lineHeight = 47;
            label.verticalAlign = cc.Label.VerticalAlign.CENTER;
            label.fontSize = 16;
            this.addNewsNode(node);
            this.node.active = true;
        });
    }

    addNewsNode(node) {
        const count = this.content.childrenCount;
        let lastItemX = this.content.width / 2;
        const lastNode = this.content.children[count - 1];

        this.content.addChild(node);
        const spacing = 100;
        if (lastNode) {
            lastItemX = Math.max(lastNode.position.x + lastNode.width + spacing, lastItemX);
        }
        node.position = cc.v2(lastItemX, 0);
    }

    getFontNameByLanguage(): any {
        const lang = window.i18n.curLang;
        return this.fonts[lang] || this.fonts["en"];
    }

    loadFont(name: string) {
        return new Promise<cc.Font>((resolve, reject) => {
            cc.resources.load<cc.Font>(`fonts/${name}`, cc.Font, (err, font) => {
                resolve(font);
            });
        });
    }
}
