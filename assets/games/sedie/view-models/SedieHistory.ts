import { getStringDateByTime } from "../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import SocketIOGameHistoryBase from "../../_base/view-models/SocketIOGameHistoryBase";
import SedieHistoryItem from "./SedieHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SedieHistory extends SocketIOGameHistoryBase {
    @property(cc.SpriteFrame)
    iconRed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    iconWhite: cc.SpriteFrame = null;

    bindItemRowData(betLog, index) {
        const itemNode = cc.instantiate(this.itemPrefab);
        const item = itemNode.getComponent(SedieHistoryItem);
        item.node.active = true;
        item.bg.active = index % 2 > 0;

        const { freeBet, time, phien, result, settlementResult, betwin } = betLog;

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
            item.kqSprite.spriteFrame = this.iconRed;
            item.kqLabel.node.color = cc.Color.WHITE;
        } else {
            item.kqSprite.spriteFrame = this.iconWhite;
            item.kqLabel.node.color = cc.Color.BLACK;
        }

        Object.keys(settlementResult).forEach((choice) => {
            const historyItem = item[choice];
            historyItem.string = freeBet ? 0 : numberWithCommas(betLog[choice]);

            if (settlementResult[choice]) {
                historyItem.node.color = cc.Color.YELLOW;
            } else {
                historyItem.node.color = cc.Color.WHITE;
            }
        });

        item.win.string = numberWithCommas(betwin);
        this.content.addChild(itemNode);

        item.betLog = betLog;
    }
}
