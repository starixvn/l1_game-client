import { lazyInject } from "../../../Application";
import { getGameName } from "../../../configs/GameConfigurations";
import SocketIOController from "../../../SocketIOController";
import SocketIOGameHistoryBase from "../../_base/view-models/SocketIOGameHistoryBase";
import MultiplayGameHistoryItem from "./MultiplayGameHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MultiplayGameHistory extends SocketIOGameHistoryBase {
    @property(cc.Node)
    tabContainer: cc.Node = null;

    @lazyInject(SocketIOController)
    private readonly socketIOController: SocketIOController;

    protected currentGameId: number;

    onDestroy() {
        this.clearSocket(this.currentGameId);
        this.socket = null;
    }

    clearSocket(gameId: number) {
        if (this.socket) {
            const name = getGameName(gameId);
            this.socket.off(name, this.receiveData);
        }
    }

    updateSocketChanged(id) {
        this.socket = this.socketIOController.getSocketGame(id);
    }

    get_data(page = 1) {
        this.socket && this.socket.connected && this.socket.emit("getHistory", { page: page });
        const name = getGameName(this.currentGameId);
        this.socket && this.socket.on(name, this.receiveData);
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
        this.handleSocketFromGame(gameId);
    }

    handleSocketFromGame(gameId: number) {
        this.clearSocket(this.currentGameId);
        this.currentGameId = gameId;
        this.updateSocketChanged(gameId);
        this.pagination.resetPageCurrent();

        this.get_data();
        this.setStyleActiveTab(gameId);
    }

    setStyleActiveTab(gameId: number) {
        const children = this.tabContainer.children;
        children.forEach((child) => {
            const subChildren = child.children;
            if (+child.name === gameId) {
                child.getComponent(cc.Toggle).isChecked = true;
                subChildren[1].color = cc.Color.WHITE;
                subChildren[1].getComponent(cc.Label).fontSize = 18;
            } else {
                subChildren[1].color = cc.Color.BLACK.fromHEX("#c3c3c3");
                subChildren[1].getComponent(cc.Label).fontSize = 16;
            }
        });
    }
}
