const { ccclass, property } = cc._decorator;

import * as Pagination from "./../../../common/helpers/Pagination/Pagination";

@ccclass
export default class GameHistoryBase extends cc.Component {

    @property(Pagination)
    pages: Pagination = null;

    @property(cc.Node)
    content: cc.Node = null;

    private gameName: string;
    private dataObserverKey: string;

    init(gameName) {
        this.gameName = gameName;
        this.dataObserverKey = `${gameName}History`;
    };

    onLoad() {
        this.pages.init(this);
    }

    onEnable() {
        cc.RedT.addDataObserver(this.dataObserverKey, this.receivedData.bind(this));
        this.getData();
    }

    onDisable() {
        cc.RedT.removeDataObserver(this.dataObserverKey);
        this.content.children.forEach(child => child.destroy());
        this.node.destroy();
    }

    receivedData(data) {
        if (data.baccarat && data.baccarat.history) {
            this.onData(data.baccarat.history);
        }
    }

    getData(page = 1) {
        cc.RedT.send({ g: { [this.gameName]: { getHistory: { page: page } } } });
    }

    onData(data) { }
}