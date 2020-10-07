import { getStringDateByTime, numberWithCommas } from "./../../../common/helpers/Helper";
import GameUtils from "./../../../common/GameUtils";
import * as Pagination from "./../../../common/helpers/Pagination/Pagination";
import SpecialSeDieHistoryItem from "./SpecialSeDieHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpecialSeDieHistory extends cc.Component {

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
                let item = itemNode.getComponent(SpecialSeDieHistoryItem);
                item.node.active = true;
                item.bg.active = (index % 2) > 0;

                const { time, phien, result, betwin, choice, amount, refund } = betLog;

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
                item.option.string = GameUtils.getBetChoiceString(choice);
                item.bet.string = amount;
                item.refund.string = refund;

                item.win.string = numberWithCommas(betwin);

                this.content.addChild(itemNode);
            });
        }
    }

}