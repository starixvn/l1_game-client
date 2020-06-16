const { ccclass, property } = cc._decorator;

import * as Pagination from "./../../../common/helpers/Pagination/Pagination";

@ccclass
export default class GameHistoryBase extends cc.Component {

    @property(Pagination)
    pages: Pagination = null;

    @property(cc.Node)
    content: cc.Node = null;

    protected gameName: string;

    init(gameName) {
        this.gameName = gameName;
    };

    onLoad() {
        this.pages.init(this);
    }

    onEnable() {
        this.addDataObserver(this.gameName);
        this.getData();
    }

    addDataObserver(gameName: string) {
        cc.RedT.addDataObserver(`${gameName}History`, this.receivedData.bind(this));
    }

    onDisable() {
        this.removeDataObserver(this.gameName);
        this.content.destroyAllChildren();
        this.node.destroy();
    }

    removeDataObserver(gameName: string) {
        cc.RedT.removeDataObserver(`${gameName}History`);
    }

    receivedData(data) {
        if (data[this.gameName] && data[this.gameName].history) {
            this.onData(data[this.gameName].history);
        }
    }

    getData(page = 1) {
        cc.RedT.send({ g: { [this.gameName]: { getHistory: { page: page } } } });
    }

    onData(data) { }
}