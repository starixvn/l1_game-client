import PaginationCommon from '../../../common/helpers/Pagination/PaginationCommon';
import LuckyWheelHistoryItem from './LuckyWheelHistoryItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class LuckyWheelHistory extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(PaginationCommon)
    pages: PaginationCommon = null;

    @property(cc.Prefab)
    itemHistory: cc.Prefab = null;

    private dataObserverKey = "LuckyWheelHistory";

    onLoad() {
        this.pages.init(this);
        this.addDataObserver();
        this.get_data();
    }

    onDisable() {
        this.node.destroy();
    }

    addDataObserver() {
        cc.RedT.addDataObserver(this.dataObserverKey, this.receivedData.bind(this));
    }

    removeDataObserver() {
        cc.RedT.removeDataObserver(this.dataObserverKey);
    }

    receivedData(data) {
        if (data["luckyWheel"]) {
            this.onData(data["luckyWheel"].history);
        }
    }

    get_data(page = 1) {
        cc.RedT.send({ g: { ["luckyWheel"]: { getHistory: { page: page } } } });
    }

    onDestroy() {
        this.removeDataObserver();
    }

    onData(data) {
        this.pages.onSet(data.page, data.pageSize, data.total);
        this.content.children.forEach((child) => child.destroy());

        data.spinHistories.forEach((log) => {
            const item = cc.instantiate(this.itemHistory);
            const component = item.getComponent(LuckyWheelHistoryItem);
            component.updateData(log);
            this.content.addChild(item);
        });
    }
}
