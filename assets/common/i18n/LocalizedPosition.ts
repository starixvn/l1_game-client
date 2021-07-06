const { ccclass, property } = cc._decorator;

@ccclass
class LocalizedPositionData {
    @property()
    language = "";

    @property(cc.Node)
    node: cc.Node = null;
}

@ccclass
export default class LocalizedPosition extends cc.Component {
    @property({ type: LocalizedPositionData })
    data: LocalizedPositionData[] = [];

    onLoad() {
        const lang = window.i18n.curLang;
        this.data.forEach((data) => {
            if (data.language === lang) {
                this.node.position = data.node.position;
            }
        });
    }
}
