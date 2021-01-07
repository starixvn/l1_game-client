const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteBase extends cc.Component {
    @property(cc.Node)
    mainFrame: cc.Node = null;
    protected dataObserverKey = "";

    onLoad() {
        this.get_data();
        this.addDataObserver();

        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };
    }

    addDataObserver() {
        cc.RedT.addDataObserver(this.dataObserverKey, this.receivedData.bind(this));
    }

    onDestroy() {
        this.removeDataObserver();
    }

    removeDataObserver() {
        cc.RedT.removeDataObserver(this.dataObserverKey);
    }

    receivedData(data) {}

    get_data(page = 1) {}
    onData(data: any) {}
}
