import { getStringDateByTime } from "../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import PaginationCommon from "../../../common/helpers/Pagination/PaginationCommon";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameHistoryBase extends cc.Component {
    @property(PaginationCommon)
    pages: PaginationCommon = null;

    @property(cc.Node)
    content: cc.Node = null;

    protected gameName: string;

    init(gameName) {
        this.gameName = gameName;
    }

    onLoad() {
        this.pages.init(this);
    }

    onEnable() {
        this.addDataObserver(this.gameName);
        this.get_data();
    }

    addDataObserver(gameName: string) {
        cc.RedT.addDataObserver(`${gameName}History`, this.receivedData.bind(this));
    }

    onDisable() {
        this.removeDataObserver(this.gameName);
        this.content.destroyAllChildren();
        this.node.destroy();
    }

    removeDataObserver(gameName: string) {
        cc.RedT.removeDataObserver(`${gameName}History`);
    }

    receivedData(data) {
        if (data[this.gameName] && data[this.gameName].history) {
            this.onData(data[this.gameName].history);
        }
    }

    get_data(page = 1) {
        cc.RedT.send({ g: { [this.gameName]: { getHistory: { page: page } } } });
    }

    onData(data) {}

    static buildItemRowData(context: any, betLog: any, index: number, componentName: any) {
        const itemNode = cc.instantiate(context.itemPrefab);
        const item = itemNode.getComponent(componentName);
        item.node.active = true;
        item.bg.active = index % 2 > 0;

        const { time, phien, result, settlementResult, betwin } = betLog;

        item.time.string = getStringDateByTime(time);
        item.phien.string = phien;

        let number = 0;
        Object.keys(result).forEach((key) => {
            if (result[key]) {
                number++;
            }
        });

        item.kqLabel.string = number.toString();
        if (number % 2) {
            item.kqSprite.spriteFrame = context.iconRed;
            item.kqLabel.node.color = cc.Color.WHITE;
        } else {
            item.kqSprite.spriteFrame = context.iconWhite;
            item.kqLabel.node.color = cc.Color.BLACK;
        }

        Object.keys(settlementResult).forEach((choice) => {
            item[choice].string = numberWithCommas(betLog[choice]);
            if (settlementResult[choice]) {
                item[choice].node.color = cc.Color.YELLOW;
            } else {
                item[choice].node.color = cc.Color.WHITE;
            }
        });

        item.win.string = numberWithCommas(betwin);

        context.content.addChild(itemNode);
    }

    static handleSomeItemRowData(context: any, item: any, log: any) {
        item.amountLabel.string = numberWithCommas(log.totalAmount);
        item.winLabel.string = numberWithCommas(log.betwin);
        item.winLabel.node.color = log.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

        item.time = "";
        item.round = log.phien;
        item.result = log.result;
        item.betLogDetails = log.betLogDetails;
        item.settlementResult = log.settlementResult;

        item.showTicketDetail = (round, time, result, betLogDetails, settlementResult) => {
            context.showTicketDetail(round, time, result, betLogDetails, settlementResult);
        };
    }
}
