import { lazyInject } from "../../../Application";
import DropDownList from "../../../common/drop-down-list/view-models/DropDownList";
import DropDownOption from "../../../common/drop-down-list/view-models/DropDownOption";
import { GameIds, GameInfos } from "../../../configs/SabaConfigs";
import SocketIOController from "../../../SocketIOController";
import SocketIOGameHistoryBase from "../../_base/view-models/SocketIOGameHistoryBase";
import MultiplayGameHistoryItem from "./MultiplayGameHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MultiplayGameHistory extends SocketIOGameHistoryBase {
    @property(cc.Prefab)
    dropDownListPrefab: cc.Prefab = null;

    @property(cc.Node)
    dropDownContainer: cc.Node = null;

    @lazyInject(SocketIOController)
    private readonly socketIOController: SocketIOController;

    public gameDropDownList: DropDownList;

    private readonly options: DropDownOption[] = [
        new DropDownOption(GameIds.UnbalancedBigSmall1, "Las Vegas"),
        new DropDownOption(GameIds.UnbalancedBigSmall2, "Marina Bay"),
        new DropDownOption(GameIds.UnbalancedBigSmall3, "Macau"),
        new DropDownOption(GameIds.UnbalancedBigSmall4, "Monte Carlo")
    ];

    onLoad() {
        super.onLoad();
        this.initDropDown();
        this.updateSocketChanged();
    }

    initDropDown() {
        const dropdownNode = cc.instantiate(this.dropDownListPrefab);
        this.gameDropDownList = dropdownNode.getComponent("DropDownList");
        this.gameDropDownList.init(this.options, this.onGameChanged.bind(this));
        this.dropDownContainer.addChild(dropdownNode);
    }

    updateSocketChanged() {
        const id = this.gameDropDownList.selectedItem.gameId;
        this.socket = this.socketIOController.getSocketGame(id);
    }

    onGameChanged() {
        this.updateSocketChanged();
        this.pagination.resetPageCurrent();
        this.get_data();
    }

    onData(data) {
        const { page, pageSize, total, betLogs } = data;
        this.pagination.onSet(page, pageSize, total);
        this.content.destroyAllChildren();
        this.scrollView && this.scrollView.scrollToTop(0.1);

        if (!betLogs || !betLogs.length) {
            return;
        }

        betLogs.forEach((betLog, index) => this.bindItemRowData(betLog, index));
        this.onUpdatedData();
    }

    receivedData(dataHistory: any, gameName: string) {
        const id = this.gameDropDownList.selectedItem.gameId;
        const currentGameName = GameInfos[id].key;
        if (gameName === currentGameName) {
            this.onData(dataHistory);
        }
    }

    bindItemRowData(betLog, index) {
        const itemNode = cc.instantiate(this.itemPrefab);
        const item = itemNode.getComponent(MultiplayGameHistoryItem);
        item.setData(betLog);
        // item.showTicketDetail = (log) => {
        //     this.showTicketDetail(log);
        // };
        this.content.addChild(itemNode);
    }

    closeDropDown() {
        this.gameDropDownList && this.gameDropDownList.closeDropDown();
    }
}
