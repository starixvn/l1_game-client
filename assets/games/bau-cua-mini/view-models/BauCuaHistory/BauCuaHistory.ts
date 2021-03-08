import PaginationCommon from "../../../../common/helpers/Pagination/PaginationCommon";
import { getStringDateByTime } from "../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
import SocketIOGameHistoryBase from "../../../_base/view-models/SocketIOGameHistoryBase";
import BauCuaHistoryItems from "./BauCuaHistoryItems";

const { ccclass, property } = cc._decorator;
@ccclass
export default class BauCuaHistory extends SocketIOGameHistoryBase {
    @property(cc.SpriteFrame)
    animalSprites: cc.SpriteFrame[] = [];

    private readonly dataObserverKey = "BauCuaHistory";

    onEnable() {
        cc.RedT.addDataObserver(this.dataObserverKey, this.receivedData.bind(this));
        this.get_data();
    }

    receivedData(data) {
        if (data.baucua && data.baucua.history) {
            this.onData(data.baucua.history);
        }
    }

    bindItemRowData(betLog, index) {
        const itemNode = cc.instantiate(this.itemPrefab);
        const item = itemNode.getComponent(BauCuaHistoryItems);
        item.node.active = true;
        const { time, phien, result, settlementResult, betwin } = betLog;
        item.time.string = getStringDateByTime(time);
        item.round.string = phien;

        item.dices[0].spriteFrame = this.animalSprites[result.dice1];
        item.dices[1].spriteFrame = this.animalSprites[result.dice2];
        item.dices[2].spriteFrame = this.animalSprites[result.dice3];

        // Object.keys(settlementResult).forEach((choice, index) => {
        //     item[choice].string = numberWithCommas(betLog[choice]);

        //     item.dataLabels.forEach((bet, index) => {

        //     });

        //     if (settlementResult[choice]) {
        //         item[choice].node.color = cc.Color.YELLOW;
        //     } else {
        //         item[choice].node.color = cc.Color.WHITE;
        //     }
        // });

        item.win.string = numberWithCommas(betwin);
        item.win.node.color = betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
        this.content.addChild(itemNode);
    }
}
