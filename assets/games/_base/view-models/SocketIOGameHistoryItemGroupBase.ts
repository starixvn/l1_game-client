import { Socket } from "socket.io-client";

import { i18n } from "../../../ClientModules";
import CommonDialog from "../../../common/_base/view-models/CommonDialog";
import BaseComponent from "../../../common/BaseComponent";
import GameUtils from "../../../common/GameUtils";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import PaginationCommon from "../../../common/helpers/Pagination/PaginationCommon";
import HistoryFrame from "../../../common/new-history/HistoryFrame";

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class SocketIOGameHistoryItemGroupBase extends BaseComponent {
    protected socket: Socket;

    init(socket: Socket) {
        this.socket = socket;
    }

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Button)
    verify: cc.Button = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    public roundId = 0;

    abstract addItem(log);

    setBackground(enabled: boolean) {
        this.bg.getComponent(cc.Sprite).enabled = enabled;
    }

    onClickVerify() {
        this.socket && this.socket.connected && this.socket.emit("getProvablyFair", { roundId: this.roundId });
    }

    onData(data: any) {
        if (data.provablyFair) {
            cc.log(data.provablyFair);
        }
    }
}
