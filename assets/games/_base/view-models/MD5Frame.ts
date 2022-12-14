// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class MD5Frame extends cc.Component {
    @property(cc.Label)
    md5Label: cc.Label = null;

    @property(cc.Button)
    md5CopyBtn: cc.Button = null;

    @property(cc.Node)
    md5HintCopy: cc.Node = null;

    @property(cc.Node)
    md5Node: cc.Node = null;

    public clickCopyButton = () => {};

    public assginProperties = () => {};
    layoutNode: cc.Layout;

    onClickCopyButton() {
        this.clickCopyButton();
    }

    onLoad() {
        this.layoutNode = this.node.getComponent(cc.Layout);
    }

    updateLayout(width: number) {
        this.md5Node.width = width;
        this.layoutNode.updateLayout();
    }
}
