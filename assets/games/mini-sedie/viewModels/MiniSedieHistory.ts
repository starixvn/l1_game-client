import PaginationCommon from "../../../common/helpers/Pagination/PaginationCommon";
import GameHistoryBase from "../../_base/view-models/GameHistoryBase";
import MiniSedieHistoryItem from "./MiniSedieHistoryItem";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MiniSedieHistory extends cc.Component {
    @property(PaginationCommon)
    pages: PaginationCommon = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.SpriteFrame)
    iconRed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    iconWhite: cc.SpriteFrame = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    private readonly dataObserverKey = "MiniSedieHistory";

    onLoad() {
        this.pages.init(this);

        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };
    }

    onEnable() {
        cc.RedT.addDataObserver(this.dataObserverKey, this.receivedData.bind(this));
        this.get_data();
    }

    receivedData(data) {
        if (data.miniSedie && data.miniSedie.history) {
            this.onData(data.miniSedie.history);
        }
    }

    get_data(page = 1) {
        cc.RedT.send({ g: { miniSedie: { getHistory: { page: page } } } });
    }

    onData(data) {
        const { page, pageSize, total, betLogs } = data;
        this.pages.onSet(page, pageSize, total);
        this.content.destroyAllChildren();

        if (betLogs && betLogs.length) {
            betLogs.map((betLog, index) => {
                GameHistoryBase.buildItemRowData(this, betLog, index, MiniSedieHistoryItem);
            });
        }
    }
}
