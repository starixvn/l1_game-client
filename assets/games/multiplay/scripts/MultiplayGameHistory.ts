import { lazyInject } from "../../../Application";
import { getGameName } from "../../../configs/GameConfigurations";
import SocketIOController from "../../../SocketIOController";
import SocketIOGameHistoryBase from "../../_base/view-models/SocketIOGameHistoryBase";

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
        super.get_data(page);
    }

    receiveData = (data) => {
        if (data.history) {
            this.onData(data.history);
        }
    };

    bindItemRowData(betLog, index) {}

    openTabGame(toggle: cc.Toggle) {
        const gameId = +toggle.node.name;
        this.handleSocketFromGame(gameId);
    }

    handleSocketFromGame(gameId: number) {
        this.clearSocket(this.currentGameId);
        this.currentGameId = gameId;
        this.updateSocketChanged(gameId);
        this.pagination.resetPageCurrent();
        const name = getGameName(gameId);
        this.socket.on(name, this.receiveData);
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
