import { lazyInject } from "../../../Application";
import { getGameName } from "../../../configs/GameConfigurations";
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

    private multiplayHistory: MultiplayGameHistory;

    onLoad() {
        super.onLoad();
    }

    updateSocketChanged(id) {
        this.socket = this.socketIOController.getSocketGame(id);
    }

    receiveData = (data) => {
        if (data.history) {
            this.onData(data.history);
        }
    };

    bindItemRowData(betLog, index) {
        const itemNode = cc.instantiate(this.itemPrefab);
        const item = itemNode.getComponent(MultiplayGameHistoryItem);
        item.setData(betLog);
        this.content.addChild(itemNode);
    }

    openTabGame(toggle: cc.Toggle) {
        const gameId = +toggle.node.name;
        this.updateSocketChanged(gameId);
        this.pagination.resetPageCurrent();
        const gameName = getGameName(gameId);
        //this.socket.off(getGameName(gameId), this.receiveData);
        this.socket.off(getGameName(gameId)).on(getGameName(gameId), this.receiveData);
        this.get_data();
    }
}
