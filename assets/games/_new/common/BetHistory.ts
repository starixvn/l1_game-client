import Connection from "../connection/Connection";
import { events } from "../connection/SocketIOConnection";
import CommonDialog from "../../../common/_base/view-models/CommonDialog";
import PaginationCommon from "../../../common/helpers/Pagination/PaginationCommon";

const { ccclass, property } = cc._decorator;
@ccclass
export default class BetHistory extends cc.Component {
    @property(PaginationCommon)
    pages: PaginationCommon = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    prefabItem: cc.Prefab = null;

    @property(CommonDialog)
    commonDialog: CommonDialog = null;

    protected connection: Connection;
    protected gameName: string;
    protected currentRoundId: number;

    private callback: any;

    onLoad() {
        this.pages.init(this);
        this.commonDialog.addOnDidHide(() => {
            this.node.destroy();
        });
    }

    setConnection(connection: Connection, gameName: string, currentRoundId?: number) {
        this.connection = connection;
        this.gameName = gameName;
        this.currentRoundId = currentRoundId;
        this.callback = (data) => this.onData(data);
        this.connection.on(gameName, this.callback);
    }

    onDestroy() {
        this.connection.removeListener(this.gameName, this.callback);
    }

    getHistory(page = 1) {
        this.connection && this.connection.emit(events.getHistory, { page });
    }

    setId(id: number) {
        this.currentRoundId = id;
    }

    onData(data: any) {
        if (!data.history) {
            return;
        }
        this.pages.onSet(data.history.page, data.history.pageSize, data.history.total);
        this.content.children.forEach((child) => child.destroy());
        this.renderTicketHistory(data.history);
    }

    get_data(page = 1) {
        this.getHistory(page);
    }

    showDialog() {
        if (this.commonDialog) {
            this.get_data();
            this.commonDialog.showDialog();
        }
    }

    renderTicketHistory(data: any) {}
}
