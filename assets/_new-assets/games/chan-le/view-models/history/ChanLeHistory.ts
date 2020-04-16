const { ccclass, property } = cc._decorator;
import * as Pagination from '../../../../common/helpers/Pagination/Pagination'
import ChanLe from '../ChanLe';

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(Pagination)
    pages: Pagination = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    private root: ChanLe;

    init(root: ChanLe) {
        this.root = root;
    }

    onEnable() {
        this.pages.init(this);
        this.getHistoryData();
    }

    onDisable() {
        this.node.destroyAllChildren();
        this.node.destroy();
    }

    close() {
        cc.RedT.audio.playClick();
        this.node.active = false;
    }

    onData(data) {

    }

    getHistoryData(page = 1) {
        this.root.sendData({ get_log: { page: page } });
    }
}
