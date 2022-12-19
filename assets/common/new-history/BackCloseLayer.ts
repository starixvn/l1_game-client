const { ccclass, property } = cc._decorator;

@ccclass
export default class BackCloseLayer extends cc.Component {
    public clickBackCloseLayer = () => {};

    onBackClose() {
        this.clickBackCloseLayer();
    }
}
