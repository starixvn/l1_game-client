import { getStringDateByTime } from "./../../../common/helpers/Helper";
import * as Pagination from "./../../../common/helpers/Pagination/Pagination";
import FreeBetDetail from "./FreeBetDetail";
import SedieHistoryItem from "./SedieHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SedieHistory extends cc.Component {

    @property(Pagination)
    pagination: Pagination = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.SpriteFrame)
    iconRed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    iconWhite: cc.SpriteFrame = null;

    @property(cc.Prefab)
    freeBetDetailPrefab: cc.Prefab = null;

    private socket: SocketIOClient.Socket;

    init(socket: SocketIOClient.Socket) {
        this.socket = socket;
    }

    onLoad() {
        this.pagination.init(this);
    }

    onEnable() {
        this.get_data();
    }

    get_data(page = 1) {
        this.socket.emit('getHistory', { page: page });
    }

    onData(data) {
        const { page, pageSize, total, betLogs } = data;
        this.pagination.onSet(page, pageSize, total);
        this.content.destroyAllChildren();

        if (betLogs && betLogs.length) {
            betLogs.map((betLog, index) => {
                let itemNode = cc.instantiate(this.itemPrefab);
                let item = itemNode.getComponent(SedieHistoryItem);
                item.node.active = true;
                item.bg.active = (index % 2) > 0;

                const { freeBet, time, phien, result, settlementResult, betwin } = betLog;

                item.time.string = getStringDateByTime(time);
                item.phien.string = phien;

                let number = 0;
                Object.keys(result).forEach(key => {
                    if (result[key]) {
                        number++;
                    }
                });

                item.kqLabel.string = number.toString();
                if (number % 2) {
                    item.kqSprite.spriteFrame = this.iconRed;
                    item.kqLabel.node.color = cc.Color.WHITE;
                } else {
                    item.kqSprite.spriteFrame = this.iconWhite;
                    item.kqLabel.node.color = cc.Color.BLACK;
                }

                Object.keys(settlementResult).forEach(choice => {
                    item[choice].string = freeBet ? 0 : betLog[choice];
                    if (settlementResult[choice]) {
                        item[choice].node.color = cc.Color.YELLOW;
                    } else {
                        item[choice].node.color = cc.Color.WHITE;
                    }
                });

                item.win.string = betwin;
                if (freeBet) {
                    item.win.node.color = item.win.node.color.fromHEX("#34B4FF");
                    item.win.node.on(cc.Node.EventType.TOUCH_END, () => this.showFreeBetDetail(betLog));
                }

                this.content.addChild(itemNode);
            });
        }
    }

    showFreeBetDetail(betLog) {
        const freeBetDetailNode = cc.instantiate(this.freeBetDetailPrefab);
        const freeBetDetail = freeBetDetailNode.getComponent(FreeBetDetail);
        freeBetDetail.init(betLog);
        this.node.addChild(freeBetDetailNode);
    }
}